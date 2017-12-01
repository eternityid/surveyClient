import { Component, ViewEncapsulation, OnDestroy, ChangeDetectorRef, OnInit, ElementRef, ViewChild, Input, ChangeDetectionStrategy } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ChartComponent } from 'angular2-highcharts';
import { AggregationData, AggregationMeasure, DataSource, Field, MeasureOperator, FieldType, SimpleAggregationDimension, DateAggregationDimension, DateAggregationDimensionInterval, AggregationDimensionType, getDateDimensionIntervalTranslateKey, getMeasureOperatorTranslateKey } from '@app/analyze/_shared/data-models';
import { ObjectUtil, ArrayUtil, StringUtil, DateUtil, NumberUtil } from '@app/core/utils';
import { TranslateService } from '@ngx-translate/core';
import { MultiLanguageService } from '@app/core/services';
import { BaseComponent } from '@app/core/abstract';
import { Observable, Subscription } from 'rxjs/Rx';
import { ObservableMedia } from '@angular/flex-layout';

const defaultMinHighChartWidth = 400;
const minHorizontalMargin = 20;
const minPointLength = 3;
const answerFactionDigits = 2;

@Component({
    selector: 'aggregation-chart',
    templateUrl: './aggregation-chart.component.html',
    styleUrls: ['./aggregation-chart.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AggregationChartComponent extends BaseComponent implements OnDestroy, OnInit {
    constructor(changeDector: ChangeDetectorRef, elementRef: ElementRef, multiLanguageService: MultiLanguageService, media: ObservableMedia) {
        super(changeDector, multiLanguageService, elementRef, media);
        this.onWindowResize$ = this.createOnWindowResize();
    }
    @ViewChild('highChartComponent')
    public highChartComponent: ChartComponent;

    private _aggregationData: AggregationData;
    public get aggregationData(): AggregationData {
        return this._aggregationData;
    }
    @Input()
    public set aggregationData(value) {
        this._aggregationData = value;
        if (this.viewInitiated) {
            this.availableChartTypes = this.getAvailableChartTypes();
            this.reInitChart();
        }
    }
    @Input() public type: AggregationChartType | undefined;

    private _dataSource: DataSource;
    public get dataSource(): DataSource {
        return this._dataSource;
    }
    @Input()
    public set dataSource(value) {
        this._dataSource = value;
        if (this.viewInitiated) {
            this.reInitChart();
        }
    }

    private _highChartOptions: Highcharts.Options | undefined;
    public get highChartOptions(): Highcharts.Options | undefined {
        return this._highChartOptions;
    }
    public set highChartOptions(value) {
        this._highChartOptions = value;
        this.detectChanges();
    }
    public get element(): HTMLElement {
        return this.elementRef.nativeElement;
    }
    public get highChartObj(): Highcharts.ChartObject {
        return this.highChartComponent.chart;
    }
    public availableChartTypes: string[];

    ngOnInit(): void {
        super.ngOnInit();
        this.availableChartTypes = this.getAvailableChartTypes();
        this.loadHighChartOptions();
    }
    ngOnDestroy(): void {
        super.ngOnDestroy();
        clearTimeout(this.reInitChartTimeout);
        this.loadHighChartOptionsWatcher.unsubscribe();
        this.onWindowResize$.unsubscribe();
    }

    private loadHighChartOptionsWatcher: Subscription = new Subscription();
    public loadHighChartOptions() {
        this.loadHighChartOptionsWatcher.unsubscribe();
        this.loadHighChartOptionsWatcher = this.createHighChartOptions()
            .subscribe(value => {
                this.highChartOptions = value;
            });
    }

    private reInitChartTimeout: any;
    public reInitChart() {
        this.highChartOptions = undefined;
        this.reInitChartTimeout = setTimeout(() => {
            this.loadHighChartOptions();
        });
    }

    private onWindowResize$: Subscription;
    private createOnWindowResize(): Subscription {
        return Observable
            .fromEvent(window, 'resize')
            .debounce(() => Observable.timer(1000))
            .subscribe(val => {
                this.reInitChart();
            });
    }

    private getAvailableChartTypes(): AggregationChartType[] {
        return allAggregationChartTypes.filter(type => this.validateChartTypeSupportAggregation(type, this.aggregationData));
    }

    private getHighChartWidthFillParent(): number | undefined {
        return this.element.parentElement && this.element.parentElement.clientWidth >= defaultMinHighChartWidth
            ? this.element.parentElement.clientWidth - minHorizontalMargin * 2
            : undefined
    }

    private createHighChartOptions(): Observable<Highcharts.Options | undefined> {
        let availableChartTypes = this.getAvailableChartTypes();
        if (availableChartTypes.length == 0 || this.dataSource.fields == undefined) return Observable.of(undefined);

        let renderChartType = this.type != undefined && availableChartTypes.includes(this.type) ? this.type : availableChartTypes[0];

        let firstDimension = this.aggregationData.dimensions[0];
        let firstDimensionTitle$ = this.getDimensionTitle(firstDimension);
        let firstDimensionAnswers = getFieldAnswers(firstDimension.fieldName, this.aggregationData, this.dataSource, this.browserLang, this.defaultLang);

        if (this.aggregationData.dimensions.length == AggregationData.maxDimensionLength) {
            let secondDimension = this.aggregationData.dimensions[1];
            let secondDimensionTitle$ = this.getDimensionTitle(secondDimension);
            let secondDimensionAnswers = getFieldAnswers(secondDimension.fieldName, this.aggregationData, this.dataSource, this.browserLang, this.defaultLang);

            let firstMeasure = this.aggregationData.measures[0];
            let firstMeasureTitle$ = this.getMeasureTitle(firstMeasure);

            return Observable.forkJoin(
                firstMeasureTitle$,
                firstDimensionTitle$,
                secondDimensionTitle$
            ).map(data => {
                let measureTitle = data[0];
                let firstDimensionTitle = data[1];
                let secondDimensionTitle = data[2];

                return this.buildChartOptions({
                    chartType: renderChartType,
                    yAxisTitle: measureTitle,
                    xAxisCategories: firstDimensionAnswers.map(item => formatDimensionAnswerValue(item.value, firstDimension)),
                    xAxisTitle: firstDimensionTitle,
                    series: secondDimensionAnswers.map(secondDimensionAnswer => {
                        let secondDimensionAnswerFormatedValue = formatDimensionAnswerValue(secondDimensionAnswer.value, secondDimension);
                        return {
                            name: `${secondDimensionAnswerFormatedValue}`,
                            data: firstDimensionAnswers.map(firstDimensionAnswer => this.getMeasureValue(firstMeasure,
                                { fieldName: firstDimension.fieldName, fieldAnswer: firstDimensionAnswer.name },
                                { fieldName: secondDimension.fieldName, fieldAnswer: secondDimensionAnswer.name }
                            ))
                        };
                    })
                });
            });
        } else {
            let measureTitles$ = this.aggregationData.measures.map(measure => this.getMeasureTitle(measure));

            return Observable.forkJoin(
                measureTitles$.concat(firstDimensionTitle$)
            ).map(data => {
                let firstDimensionTitle = data.pop();
                let measureTitles = data;

                return this.buildChartOptions({
                    chartType: renderChartType,
                    yAxisTitle: measureTitles.length == 1 ? measureTitles[0] : "",
                    xAxisCategories: firstDimensionAnswers.map(item => formatDimensionAnswerValue(item.value, firstDimension)),
                    xAxisTitle: firstDimensionTitle,
                    series: this.aggregationData.measures.map((measure, measureIndex) => {
                        let measureTitle = measureTitles[measureIndex];
                        return {
                            name: measureTitle,
                            data: firstDimensionAnswers.map(firstDimensionAnswer => this.getMeasureValue(measure,
                                { fieldName: firstDimension.fieldName, fieldAnswer: firstDimensionAnswer.name }
                            ))
                        };
                    })
                });
            });
        }
    }

    private validateChartTypeSupportAggregation(chartType: AggregationChartType, aggregationData: AggregationData) {
        if (!AggregationData.isQueryDataValid(aggregationData.dimensions, aggregationData.measures)) return false;

        let isFirstDimensionDateType = aggregationData.dimensions[0].type == AggregationDimensionType.Date;
        let canBeLineChart = isFirstDimensionDateType;

        switch (chartType) {
            case AggregationChartType.column: {
                return !canBeLineChart;
            }
            case AggregationChartType.line: {
                return canBeLineChart;
            }
        }

        return false;
    }

    private getMeasureTitle(measure: AggregationMeasure): Observable<string> {
        return this.multiLanguageService
            .get(getMeasureOperatorTranslateKey(measure.operator))
            .map(measureOperatorText => {
                return `${this.getBrowserLangText(this.aggregationData.fieldsDictionary[measure.fieldName])} (${measureOperatorText})`;
            })
    }

    private getDimensionTitle(dimension: SimpleAggregationDimension | DateAggregationDimension): Observable<string> {
        let dimensionNameTitle = this.getBrowserLangText(this.aggregationData.fieldsDictionary[dimension.fieldName]);
        if (dimension instanceof DateAggregationDimension) {
            let dateDimension = <DateAggregationDimension>dimension;
            return this.multiLanguageService
                .get(getDateDimensionIntervalTranslateKey(dateDimension.interval))
                .map(dateDimensionIntervalText => {
                    return `${dimensionNameTitle} (${dateDimensionIntervalText})`;
                });
        }

        return Observable.of(`${dimensionNameTitle}`);
    }

    private getDefaultChartOptions(): Highcharts.Options {
        return {
            chart: {
                type: AggregationChartType.column,
                width: this.getHighChartWidthFillParent()
            },
            title: { text: '' },
            credits: {
                enabled: false
            },
            plotOptions: {
                column: {
                    minPointLength: minPointLength
                }
            }
        };
    }

    private buildChartOptions(aggreationChartOptions: AggreationChartOptions, additionOptions?: Highcharts.Options) {
        let result = this.getDefaultChartOptions();
        ObjectUtil.assignDeep(result, {
            chart: {
                type: aggreationChartOptions.chartType
            },
            yAxis: {
                title: {
                    text: aggreationChartOptions.yAxisTitle
                }
            },
            xAxis: {
                categories: aggreationChartOptions.xAxisCategories,
                title: {
                    text: aggreationChartOptions.xAxisTitle
                }
            },
            series: aggreationChartOptions.series
        });
        if (aggreationChartOptions.xAxisType) {
            ObjectUtil.assignDeep(result, {
                xAxis: {
                    type: aggreationChartOptions.xAxisType
                }
            });
        }
        if (additionOptions != undefined) ObjectUtil.assignDeep(result, additionOptions);
        return result;
    }

    private getMeasureValue(measure: AggregationMeasure, ...ofFieldAnswers: { fieldName: string, fieldAnswer: any }[]) {
        let documentItemOfFieldAnswers = this.aggregationData.documents.find(document => ArrayUtil.all(ofFieldAnswers, item => document[item.fieldName] == item.fieldAnswer));
        let value = documentItemOfFieldAnswers && documentItemOfFieldAnswers[measure.toString()] != undefined ? <number>documentItemOfFieldAnswers[measure.toString()] : 0;

        return NumberUtil.round(value, answerFactionDigits);
    }
}

function formatDimensionAnswerValue(value: any, dimension: SimpleAggregationDimension | DateAggregationDimension): string {
    if (typeof (value) == 'number') {
        return parseFloat(value.toString()).toFixed(answerFactionDigits);
    }
    if (value instanceof Date) {
        let dateDimension = <DateAggregationDimension>dimension;
        switch (dateDimension.interval) {
            case DateAggregationDimensionInterval.Month:
                return DateUtil.format(value, 'MM/YYYY');

            case DateAggregationDimensionInterval.Quarter: {
                let momentValue = DateUtil.moment(value);
                return `Q${momentValue.quarter()}/${momentValue.year()}`;
            }
            case DateAggregationDimensionInterval.Year:
                return DateUtil.format(value, 'YYYY');

            default:
                return DateUtil.format(value);
        }
    }
    return value;
}

function getFieldAnswers(fieldName: string, aggregationData: AggregationData, dataSource: DataSource, browserLang: string, fallbackLang: string) {
    let fieldType = ArrayUtil.findSelect(dataSource.fields, item => item.name == fieldName, item => item.type);
    let fieldAnswersDic = aggregationData.fieldAnswersDictionary[fieldName];
    let fieldAnswerNames = Object.keys(fieldAnswersDic);
    let fieldAnswerNameValueMappings: NameValue[] = fieldAnswerNames.map(fieldAnswerName => {
        return {
            name: fieldAnswerName,
            value: Field.toFieldTypeValue(MultiLanguageService.getMultiLangText(fieldAnswersDic[fieldAnswerName], browserLang, fallbackLang), fieldType)
        }
    });
    let result = fieldAnswerNameValueMappings;
    if (fieldType == FieldType.Date || fieldType == FieldType.Numeric)
        result = ArrayUtil.sortBy(fieldAnswerNameValueMappings, (item: NameValue) => item.value);

    return result;
}

function getUniqueSortedMeasureValues(measureName: string, aggregationData: AggregationData) {
    return ArrayUtil
        .distinct(aggregationData.documents.map(item => NumberUtil.round(<number>item[measureName], answerFactionDigits)))
        .sort((a: any, b: any) => a - b);
}

export enum AggregationChartType {
    line = 'line',
    column = 'column'
}

export const allAggregationChartTypes = [
    AggregationChartType.line,
    AggregationChartType.column
];

export interface AggreationChartOptions {
    chartType: string;
    yAxisTitle?: string;
    xAxisTitle?: string;
    xAxisType?: string;
    xAxisCategories?: (string | number)[];
    series: Highcharts.IndividualSeriesOptions[];
}