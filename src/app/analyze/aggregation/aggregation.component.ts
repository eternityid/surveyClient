import { AnalyzeAppState } from "@app/analyze/_store";
import { Store } from "@ngrx/store";
import { ViewEncapsulation, ChangeDetectionStrategy, Component, ChangeDetectorRef, OnInit, Output, EventEmitter, ElementRef, ViewChild } from "@angular/core";
import { AnalyzeDataModelState } from "@app/analyze/_store/data-model";
import { AggregationUi } from "@app/analyze/_shared/ui-models";
import { MeasureOperator, FieldType, fieldNameResponseId, Field, SimpleAggregationDimension, DateAggregationDimension, AggregationMeasure, DateAggregationDimensionInterval, AggregationDimension, getDateDimensionIntervalTranslateKey, getMeasureOperatorTranslateKey, AggregationFilter } from "@app/analyze/_shared/data-models";
import { UpdateMeasureOperator_Aggregation, RemoveDimension_Aggregation, RemoveMeasure_Aggregation, AddDimension_Aggregation, AddMeasure_Aggregation, UpdateQueryData_Aggregation, UpdateDateDimensionInterval_Aggregation, Init_Aggregation, Destroy_Aggregation, LoadAggregationData_Aggregation, AddFilter_Aggregation, RemoveFilter_Aggregation } from "@app/analyze/_store/ui-model/actions";
import { MultiLanguageService } from "@app/core/services";
import { HtmlUtil, ArrayUtil, ObjectUtil } from "@app/core/utils";
import { DragDropService } from "ng2-dnd";
import { BaseSmartComponent } from "@app/core/abstract";
import { AggregationSettingUiService } from "@app/analyze/aggregation-setting/aggregation-setting.ui-service";
import { AggregationChartComponent } from "@app/analyze/_shared/components";
import { Subscription } from 'rxjs/Rx';
import { OnDestroy, AfterViewInit } from "@angular/core/src/metadata/lifecycle_hooks";
import { ObservableMedia } from "@angular/flex-layout";

const fieldDropZones = {
    dimension: 'dimension',
    measure: 'measure'
};

@Component({
    selector: 'aggregation',
    templateUrl: './aggregation.component.html',
    styleUrls: ['./aggregation.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AggregationComponent extends BaseSmartComponent<AggregationUi, AnalyzeDataModelState> implements OnInit, OnDestroy, AfterViewInit {
    public static fieldDropZones = fieldDropZones;

    constructor(
        store: Store<AnalyzeAppState>,
        changeDetector: ChangeDetectorRef,
        multiLanguageService: MultiLanguageService,
        elementRef: ElementRef,
        dragDropService: DragDropService,
        aggregationSettingUiService: AggregationSettingUiService,
        media: ObservableMedia
    ) {
        super(
            store.select(state => state.analyze.dataModelState),
            store.select(state => state.analyze.uiModelState.aggregation),
            changeDetector,
            multiLanguageService,
            elementRef,
            media
        );
        this.dragDropService = dragDropService;
        this.aggregationSettingUiService = aggregationSettingUiService;

        this.aggregationSettingpanelDisplayChanged$ = this.aggregationSettingUiService.panelDisplayChanged$.subscribe(x => {
            if (this.media.isActive('gt-sm'))
                this.reinitAggregationChart();
        });
    }

    private _vm: AggregationUi;
    public get vm(): AggregationUi {
        return this._vm;
    }
    public set vm(value) {
        this._vm = value;
        this.detectChanges();
    }

    public fieldDropZones = fieldDropZones;

    protected initAction: string = Init_Aggregation.Type;
    protected destroyAction: string = Destroy_Aggregation.Type;

    private dragDropService: DragDropService;
    private aggregationSettingUiService: AggregationSettingUiService;
    private aggregationSettingpanelDisplayChanged$: Subscription;

    @ViewChild('dimensionsContainer')
    private dimensionsContainer: ElementRef;
    private get dimensionsContainerEl(): HTMLElement {
        return this.dimensionsContainer.nativeElement;
    }

    @ViewChild('measuresContainer')
    private measuresContainer: ElementRef;
    private get measuresContainerEl(): HTMLElement {
        return this.measuresContainer.nativeElement;
    }

    @ViewChild('filtersContainer')
    private filtersContainer: ElementRef;
    private get filtersContainerEl(): HTMLElement {
        return this.filtersContainer.nativeElement;
    }

    @ViewChild('aggregationChart')
    private aggregationChart: AggregationChartComponent | undefined;

    ngOnInit(): void {
        super.ngOnInit();
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        //Support dnd sortable container to be dropable
        setupDimensionsContainerOnDrop.call(this);
        setupMeasuresContainerOnDrop.call(this);

        function setupDimensionsContainerOnDrop(this: AggregationComponent) {
            let currentOnDrop = this.dimensionsContainerEl.ondrop;
            this.dimensionsContainerEl.ondrop = (event: DragEvent) => {
                currentOnDrop.call(this.dimensionsContainerEl, event);

                let hasQueryChanged = this.fixQueryData();
                if (!hasQueryChanged)
                    this.addDimension(this.dragDropService.dragData);
            };
        }

        function setupMeasuresContainerOnDrop(this: AggregationComponent) {
            let currentOnDrop = this.measuresContainerEl.ondrop;
            this.measuresContainerEl.ondrop = (event: DragEvent) => {
                currentOnDrop.call(this.measuresContainerEl, event);

                let hasQueryChanged = this.fixQueryData();
                if (!hasQueryChanged)
                    this.addMeasure(this.dragDropService.dragData);
            };
        }
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        this.aggregationSettingpanelDisplayChanged$.unsubscribe();
    }

    public loadAggregationData() {
        if (this.vm.dataSource == undefined || !this.vm.isAggregationQueryDataValid()) return;
        this.uiStore.dispatch(new LoadAggregationData_Aggregation(this.vm.dataSource.id, this.vm.dimensions, this.vm.measures, this.vm.filters));
    }

    public removeDimension(item: (SimpleAggregationDimension | DateAggregationDimension)) {
        this.revertToVmOnStore();
        this.uiStore.dispatch(new RemoveDimension_Aggregation(item));
    }

    public removeMeasure(item: AggregationMeasure) {
        this.revertToVmOnStore();
        this.uiStore.dispatch(new RemoveMeasure_Aggregation(item));
    }

    public updateMeasureOperator(operator: MeasureOperator, measure: AggregationMeasure) {
        if (!this.vm.isMeasureOperatorChanged(operator, measure)) return;
        this.uiStore.dispatch(new UpdateMeasureOperator_Aggregation(operator, measure));
    }

    public updateDateDimensionInterval(selectedItem: DateAggregationDimensionInterval, dimension: DateAggregationDimension) {
        if (!this.vm.isDateDimensionIntervalChanged(selectedItem, dimension)) return;
        this.uiStore.dispatch(new UpdateDateDimensionInterval_Aggregation(selectedItem, dimension));
    }

    public addDimension(dragData: any) {
        if (dragData == undefined) return;
        if (this.vm.canAddDimension(dragData) && this.vm.dataSource != undefined && this.vm.dataSource.fields != undefined) {
            let field = AggregationUi.getField(dragData, this.vm.dataSource.fields);
            if (field != undefined)
                this.uiStore.dispatch(new AddDimension_Aggregation(field));
        }
    }

    public addMeasure(dragData: any) {
        if (dragData == undefined) return;
        if (this.vm.canAddMeasure(dragData) && this.vm.dataSource != undefined && this.vm.dataSource.fields != undefined) {
            let field = AggregationUi.getField(dragData, this.vm.dataSource.fields);
            if (field != undefined)
                this.uiStore.dispatch(new AddMeasure_Aggregation(field));
        }
    }

    public addFilter(dragData: any) {
        if (dragData == undefined) return;
        this.revertToVmOnStore();
        if (this.vm.canAddFilter(dragData) && this.vm.dataSource && this.vm.dataSource.fields) {
            let field = AggregationUi.getField(dragData, this.vm.dataSource.fields);
            if (field != undefined) this.uiStore.dispatch(new AddFilter_Aggregation(field));
        }
    }

    public removeFilter(item: AggregationFilter | Field) {
        this.revertToVmOnStore();
        this.uiStore.dispatch(new RemoveFilter_Aggregation(item));
    }

    public reinitAggregationChart() {
        if (this.aggregationChart)
            this.aggregationChart.reInitChart();
    }

    //Private Helper Funcs and EventHandles

    private getDimensionItemTitle(item: (SimpleAggregationDimension | DateAggregationDimension) | AggregationMeasure): string {
        return this.vm.getDimensionItemTitle(item, this.getBrowserLangText.bind(this));
    }

    private getFilterItemTitle(item: AggregationFilter | Field) {
        return this.vm.getFilterItemTitle(item, this.getBrowserLangText.bind(this));
    }

    private getMeasureItemTitle(item: (SimpleAggregationDimension | DateAggregationDimension) | AggregationMeasure): string {
        return this.vm.getMeasureItemTitle(item, this.getBrowserLangText.bind(this));
    }

    private onMeasureOperatorDropdownItemSelected(e: any, operator: MeasureOperator, measureField: AggregationMeasure) {
        this.updateMeasureOperator(operator, measureField);
    }

    private onDimensionCloseBtnClicked(event: any, item: (SimpleAggregationDimension | DateAggregationDimension)) {
        this.removeDimension(item);
    }

    private onMeasureCloseBtnClicked(event: any, item: AggregationMeasure) {
        this.removeMeasure(item);
    }

    private latestDragDimensionIndex: number = -1;
    private latestDragDimension: SimpleAggregationDimension | DateAggregationDimension | undefined;
    private onDragDimensionStart($event: any, dimensionItem: (SimpleAggregationDimension | DateAggregationDimension), index: number) {
        this.latestDragDimensionIndex = index;
        this.latestDragDimension = dimensionItem;
    }

    private resetLatestDragDimension() {
        this.latestDragDimensionIndex = -1;
        this.latestDragDimension = undefined;
    }

    private latestDragMeasureIndex: number = -1;
    private latestDragMeasure: AggregationMeasure | undefined;
    private onDragMeasureStart($event: any, measureItem: AggregationMeasure, index: number) {
        this.latestDragMeasureIndex = index;
        this.latestDragMeasure = measureItem;
    }

    private resetLatestDragMeasure() {
        this.latestDragDimensionIndex = -1;
        this.latestDragMeasure = undefined;
    }

    //use this instead of (onDragEnd) because of dragging between GroupBy <=> Measures, dragEnd isn't activated
    private onDragDimensionEndFactory(dimensionItem: (SimpleAggregationDimension | DateAggregationDimension)) {
        return (dragEvent: DragEvent) => {
            if (this.isDragIntoFieldsContainer(dragEvent)) {
                this.fixQueryData();
            } else {
                this.removeDimension(dimensionItem);
            }
        };
    }

    //use this instead of (onDragEnd) because of dragging between GroupBy <=> Measures, dragEnd isn't activated
    private onDragMeasureEndFactory(measureItem: AggregationMeasure) {
        return (dragEvent: DragEvent) => {
            if (this.isDragIntoFieldsContainer(dragEvent)) {
                this.fixQueryData();
            } else {
                this.removeMeasure(measureItem);
            }
        };
    }

    private onDateDimensionIntervalItemSelected($event: any, selectedItem: DateAggregationDimensionInterval, dimension: DateAggregationDimension) {
        this.updateDateDimensionInterval(selectedItem, dimension);
    }

    private isDragIntoFieldsContainer(dragEvent: DragEvent) {
        let dragEndElement = HtmlUtil.elementFromPoint(dragEvent.clientX, dragEvent.clientY);
        let fieldsContainerEls = HtmlUtil.findElements(this.element, el => el.classList.contains('aggregation__fields-container'));
        return ArrayUtil.any(fieldsContainerEls, fieldsContainerEl => HtmlUtil.contains(fieldsContainerEl, dragEndElement));
    }

    private isDragIntoFiltersContainer(dragEvent: DragEvent) {
        let dragEndElement = HtmlUtil.elementFromPoint(dragEvent.clientX, dragEvent.clientY);
        return HtmlUtil.contains(this.filtersContainerEl, dragEndElement);
    }

    private fixQueryData() {
        this.removeDuplicatedMeasureItems();
        this.removeDuplicatedDimensionItems();
        this.returnBackNotValidDimensionInMeasureList();
        this.returnBackNotValidMeasureInDimensionList();
        this.transformMeasureItemInDimensionList();
        this.transformDimensionItemInMeasureList();

        this.resetLatestDragDimension();
        this.resetLatestDragMeasure();

        if (!AggregationUi.isQueryDataDiff(this.vm, this.vmOnStore)) {
            this.revertToVmOnStore();
            this.detectChanges();
            return false;
        } else {
            this.uiStore.dispatch(new UpdateQueryData_Aggregation(this.vm.dimensions, this.vm.measures));
            return true;
        }
    }

    private transformMeasureItemInDimensionList() {
        if (!this.vm.dataSource || !this.vm.dataSource.fields) return;
        this.vm._dimensions = ObjectUtil.clone(this.vm.dimensions);
        for (var i = 0; i < this.vm.dimensions.length; i++) {
            var item = this.vm.dimensions[i];
            if (item instanceof AggregationMeasure) {
                let fieldValue = AggregationUi.getField(item, this.vm.dataSource.fields);
                if (fieldValue == undefined) continue;
                this.vm.dimensions[i] = AggregationDimension.createAggregationDimension(fieldValue);
            }
        }
    }

    private transformDimensionItemInMeasureList() {
        if (!this.vm.dataSource || !this.vm.dataSource.fields) return;

        this.vm._measures = ObjectUtil.clone(this.vm.measures);
        for (var i = 0; i < this.vm.measures.length; i++) {
            var item = this.vm.measures[i];
            if (item instanceof SimpleAggregationDimension || item instanceof DateAggregationDimension) {
                let fieldValue = AggregationUi.getField(item, this.vm.dataSource.fields);
                if (fieldValue == undefined) continue;
                let newMeasure = this.vm.newMeasureToAddByField(fieldValue);
                if (newMeasure) this.vm.measures[i] = newMeasure;
            }
        }
    }

    private returnBackNotValidMeasureInDimensionList() {
        if (!this.vm.dataSource || !this.vm.dataSource.fields || !this.latestDragMeasure) return;

        let newMeasures = ObjectUtil.clone(this.vm.measures);
        let newDimensions = ObjectUtil.clone(this.vm.dimensions);

        for (var i = 0; i < newDimensions.length; i++) {
            if (newDimensions[i].toString() == this.latestDragMeasure.toString()) {
                let field = AggregationUi.getField(newDimensions[i], this.vm.dataSource.fields);
                let isItemNameDuplicated = ArrayUtil.any(newDimensions, x => x.fieldName == newDimensions[i].fieldName && x != newDimensions[i]);
                if (field != undefined && (!Field.canBeDimension(field) || isItemNameDuplicated)) {
                    newDimensions.splice(i, 1)[0];
                    newMeasures.splice(this.latestDragMeasureIndex, 0, this.latestDragMeasure);

                    this.vm._measures = newMeasures;
                    this.vm._dimensions = newDimensions;
                    return;
                }
            }
        }
    }

    private returnBackNotValidDimensionInMeasureList() {
        if (!this.vm.dataSource || !this.vm.dataSource.fields || !this.latestDragDimension) return;

        let newMeasures = ObjectUtil.clone(this.vm.measures);
        let newDimensions = ObjectUtil.clone(this.vm.dimensions);

        for (var i = 0; i < newMeasures.length; i++) {
            if (newMeasures[i].toString() == this.latestDragDimension.toString()) {
                let field = AggregationUi.getField(newMeasures[i], this.vm.dataSource.fields);
                if (field != undefined && !Field.canBeMeasure(field)) {
                    newMeasures.splice(i, 1)[0];
                    newDimensions.splice(this.latestDragDimensionIndex, 0, this.latestDragDimension);

                    this.vm._measures = newMeasures;
                    this.vm._dimensions = newDimensions;
                }
                return;
            }
        }
    }

    private removeDuplicatedMeasureItems() {
        let newMeasures = ObjectUtil.clone(this.vm.measures);
        for (var i = 0; i < newMeasures.length; i++) {
            var item = newMeasures[i];
            if (ArrayUtil.any(newMeasures, x => x.toString() == item.toString() && x != item)) {
                newMeasures.splice(i, 1);
                i--;
            }
        }

        this.vm._measures = newMeasures;
    }

    private removeDuplicatedDimensionItems() {
        let newDimensions = ObjectUtil.clone(this.vm.dimensions);
        for (var i = 0; i < newDimensions.length; i++) {
            var item = newDimensions[i];
            if (ArrayUtil.any(newDimensions, x => x.toString() == item.toString() && x != item)) {
                newDimensions.splice(i, 1);
                i--;
            }
        }

        this.vm._dimensions = newDimensions;
    }

    private onRefresh(e: MouseEvent) {
        this.loadAggregationData();
    }

    private getDateDimensionIntervalTranslateKey(item: DateAggregationDimensionInterval) {
        return getDateDimensionIntervalTranslateKey(item);
    }

    private getMeasureOperatorTranslateKey(item: MeasureOperator) {
        return getMeasureOperatorTranslateKey(item);
    }

    private onDropFilterSuccess($event: any) {
        this.addFilter($event.dragData);
    }

    private onFilterCloseBtnClicked($event: any, filterItem: AggregationFilter | Field) {
        this.removeFilter(filterItem);
    }

    private onDragFilterEnd($event: any, filterItem: AggregationFilter | Field) {
        let dragEvent: DragEvent = $event.mouseEvent;

        if (!this.isDragIntoFiltersContainer(dragEvent)) {
            this.removeFilter($event.dragData);
        }
    }
}