import { Component, ViewEncapsulation, Input, EventEmitter, Output, ChangeDetectorRef, ElementRef, ChangeDetectionStrategy } from "@angular/core";
import { AggregationFilter, Field, AggregationFilterType, FieldType, AggregationFilterTypes, FieldTypes } from "@app/analyze/_shared/data-models";
import { BaseComponent } from "@app/core/abstract";
import { MultiLanguageService } from "@app/core/services";
import { ObjectUtil } from "@app/core/utils";
import { Subject } from "rxjs/Rx";
import { ObservableMedia } from "@angular/flex-layout";

@Component({
    selector: 'aggregation-filter',
    templateUrl: './aggregation-filter.component.html',
    styleUrls: ['./aggregation-filter.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AggregationFilterComponent extends BaseComponent {
    constructor(changeDector: ChangeDetectorRef, elementRef: ElementRef, multiLanguageService: MultiLanguageService, media: ObservableMedia) {
        super(changeDector, multiLanguageService, elementRef, media);

        this.subscribeEmitValueChanged(this.singleFilterEmitValueChangedSource);
        this.subscribeEmitValueChanged(this.betweenFilterEmitFirstValueChangedSource);
        this.subscribeEmitValueChanged(this.betweenFilterEmitSecondValueChangedSource);
    }

    private _aggregationFilter: AggregationFilter;
    public get aggregationFilter(): AggregationFilter {
        return this._aggregationFilter;
    }
    @Input()
    public set aggregationFilter(value) {
        this._aggregationFilter = value;
        this.updatePrevValue();
    }
    @Input()
    public field: Field;
    @Input()
    public inputDelay: number = 1000;
    @Output()
    public aggregationFilterUpdated: EventEmitter<AggregationFilter> = new EventEmitter<AggregationFilter>();
    public bodyClosed: boolean = false;

    public toggleBody() {
        this.bodyClosed = !this.bodyClosed;
    }

    private get availableFilterTypes(): AggregationFilterType[] {
        return AggregationFilter.getAvailableFilterTypes(this.field);
    }
    private get valueInputType(): string {
        if (this.field.type == FieldType.Numeric) return "number";
        return "text";
    }
    private filterTypes = AggregationFilterTypes;
    private fieldTypes = FieldTypes;
    private get toggleBtnClass() {
        return this.bodyClosed ? 'black-arrow-up-icon-sm' : 'black-arrow-down-icon-sm'
    }
    private prevSingleValue: any;
    private prevMultipleValue: any;

    private getFilterTypeTranslateKey(filterType: AggregationFilterType) {
        switch (filterType) {
            case AggregationFilterType.Between: return 'WORDS.BETWEEN';
            case AggregationFilterType.Equal: return 'WORDS.EQUAL';
            case AggregationFilterType.GreaterThan: return 'WORDS.GREATER_THAN';
            case AggregationFilterType.GreaterThanOrEqualTo: return 'WORDS.GREATER_THAN_OR_EQUAL_TO';
            case AggregationFilterType.LessThan: return 'WORDS.LESS_THAN';
            case AggregationFilterType.LessThanOrEqualTo: return 'WORDS.LESS_THAN_OR_EQUAL_TO';
            case AggregationFilterType.NotEqual: return 'WORDS.NOT_EQUAL';

            default:
                return '';
        }
    }

    private onSelectedFilterTypeChanged($event: any) {
        this.syncPrevValueAndCurrentValue();
        this.aggregationFilterUpdated.emit(this.aggregationFilter);
    }

    private syncPrevValueAndCurrentValue() {
        if (this.aggregationFilter.isSingleValue()) {
            if (this.prevSingleValue == undefined) {
                this.updatePrevValue();
            } else {
                this.setAggregationFilterValue(this.prevSingleValue);
            }
        } else {
            if (this.prevMultipleValue == undefined) {
                this.updatePrevValue();
            } else {
                this.setAggregationFilterValue(this.prevMultipleValue);
            }
        }
        this.detectChanges();
    }

    private singleFilterEmitValueChangedSource: Subject<any> = new Subject<any>();
    private onSingleFilterValueChanged(value: any) {
        this.setAggregationFilterValue(Field.toFieldTypeValue(value, this.field.type));
        this.updatePrevValue();
        this.singleFilterEmitValueChangedSource.next(value);
    }

    private betweenFilterEmitFirstValueChangedSource: Subject<any> = new Subject<any>();
    private onBetweenFilterFirstValueChanged(value: any) {
        let betweenValue = this.aggregationFilter.value ? this.aggregationFilter.value : [];
        betweenValue[0] = Field.toFieldTypeValue(value, this.field.type);
        this.setAggregationFilterValue(betweenValue);
        this.updatePrevValue();
        this.betweenFilterEmitFirstValueChangedSource.next(value);
    }

    private betweenFilterEmitSecondValueChangedSource: Subject<any> = new Subject<any>();
    private onBetweenFilterSecondValueChanged(value: any) {
        let betweenValue = this.aggregationFilter.value ? this.aggregationFilter.value : [];
        betweenValue[1] = Field.toFieldTypeValue(value, this.field.type);
        this.setAggregationFilterValue(betweenValue);
        this.updatePrevValue();
        this.betweenFilterEmitSecondValueChangedSource.next(value);
    }

    private subscribeEmitValueChanged(source: Subject<any>) {
        source.debounceTime(this.inputDelay).subscribe((value) => {
            this.aggregationFilterUpdated.emit(this.aggregationFilter);
        });
    }

    private updatePrevValue() {
        if (this.aggregationFilter.isSingleValue()) {
            this.prevSingleValue = this.aggregationFilter.value;
        } else {
            this.prevMultipleValue = this.aggregationFilter.value;
        }
    }

    private setAggregationFilterValue(value: string | number | Date | (string | null)[] | number[] | (Date | null)[] | null) {
        this.aggregationFilter.value = value;
        this.aggregationFilter = ObjectUtil.clone(this.aggregationFilter);
        this.detectChanges();
    }
}
