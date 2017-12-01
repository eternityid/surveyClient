import { Component, ViewEncapsulation, ChangeDetectorRef, ChangeDetectionStrategy, Output, EventEmitter, ElementRef } from "@angular/core";
import { DataSourceFieldsUi, FieldItemUi } from "@app/analyze/_shared/ui-models";
import { AnalyzeAppState } from "@app/analyze/_store";
import { Store } from "@ngrx/store";
import { AnalyzeDataModelState } from "@app/analyze/_store/data-model";
import { LoadData_DataSourceFields, SelectMeasure_DataSourceFields, SelectDimension_DataSourceFields, Init_DataSourceFields, Destroy_DataSourceFields } from "@app/analyze/_store/ui-model/actions";
import { MultiLanguageService } from "@app/core/services";
import { AggregationComponent } from "../aggregation/aggregation.component";
import { BaseSmartComponent } from "@app/core/abstract";
import { ObservableMedia } from "@angular/flex-layout";

@Component({
    selector: 'data-source-fields',
    templateUrl: './data-source-fields.component.html',
    styleUrls: ['./data-source-fields.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DataSourceFieldsComponent extends BaseSmartComponent<DataSourceFieldsUi, AnalyzeDataModelState> {
    constructor(
        store: Store<AnalyzeAppState>,
        changeDetector: ChangeDetectorRef,
        multiLanguageService: MultiLanguageService,
        elementRef: ElementRef,
        media: ObservableMedia
    ) {
        super(
            store.select(state => state.analyze.dataModelState),
            store.select(state => state.analyze.uiModelState.dataSourceFields),
            changeDetector,
            multiLanguageService,
            elementRef,
            media
        );
    }

    private _vm: DataSourceFieldsUi;
    public get vm(): DataSourceFieldsUi {
        return this._vm;
    }
    public set vm(value) {
        this._vm = value;
        this.detectChanges();
    }

    protected initAction: string = Init_DataSourceFields.Type;
    protected destroyAction: string = Destroy_DataSourceFields.Type;

    private aggregationFieldDropZones = AggregationComponent.fieldDropZones;

    ngOnInit(): void {
        super.ngOnInit();
    }

    public loadFields() {
        if (this.vm.dataSourceId == undefined) return;
        this.uiStore.dispatch(new LoadData_DataSourceFields(this.vm.dataSourceId, this.currentModelState));
    }

    public selectDimension(item: FieldItemUi) {
        this.uiStore.dispatch(new SelectDimension_DataSourceFields(item.fieldSource));
    }

    public selectMeasure(item: FieldItemUi) {
        this.uiStore.dispatch(new SelectMeasure_DataSourceFields(item.fieldSource));
    }

    private onRefresh(e: MouseEvent) {
        this.loadFields();
    }
}