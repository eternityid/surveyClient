import { AnalyzeDataModelState } from "@app/analyze/_store/data-model";
import { Field, DataSource, getDateDimensionIntervalTranslateKey, getMeasureOperatorTranslateKey, AggregationFilter } from "@app/analyze/_shared/data-models";
import { ArrayUtil, ObjectUtil } from "@app/core/utils";
import { AggregationData, MeasureOperator, fieldNameResponseId, AggregationMeasure, SimpleAggregationDimension, DateAggregationDimension, DateAggregationDimensionInterval, AggregationDimension } from "@app/analyze/_shared/data-models";
import { BaseUiModel } from "@app/core/abstract";


export class AggregationUi extends BaseUiModel {
    public static getFieldName(value: Field | (SimpleAggregationDimension | DateAggregationDimension) | AggregationMeasure | AggregationFilter) {
        let fieldName: string = value.toString();
        if (value instanceof Field) {
            fieldName = value.name;
        } else if (value instanceof SimpleAggregationDimension || value instanceof DateAggregationDimension) {
            fieldName = value.fieldName;
        } else if (value instanceof AggregationMeasure) {
            fieldName = value.fieldName;
        } else if (value instanceof AggregationFilter) {
            fieldName = value.fieldName;
        }

        return fieldName;
    }

    public static getField(value: Field | (SimpleAggregationDimension | DateAggregationDimension) | AggregationMeasure | AggregationFilter, fields: Field[]) {
        if (value instanceof Field) return value;

        let fieldName = AggregationUi.getFieldName(value);
        return ArrayUtil.find(fields, x => x.name == fieldName);
    }

    public static isQueryDataDiff(vm1: AggregationUi, vm2: AggregationUi): boolean {
        if (ObjectUtil.isDifferent(vm1.dimensions, vm2.dimensions)) return true;
        if (ObjectUtil.isDifferent(vm1.measures, vm2.measures)) return true;
        return false;
    }

    constructor() {
        super();
    }

    private _dataSource: DataSource | undefined;
    public get dataSource(): DataSource | undefined {
        return this._dataSource;
    }
    public set dataSource(value) {
        if (value == undefined || value.fields == undefined || this._dataSource == undefined || this._dataSource.id != value.id) {
            this.dimensions = [];
            this.measures = [];
            this.filters = [];
        } else {
            let fieldNames: string[] = value.fields.map(item => item.name);

            this.dimensions = this.dimensions.filter(item => fieldNames.includes(item.fieldName));
            this.measures = this.measures.filter(item => fieldNames.includes(item.fieldName));
            this.filters = this.filters.filter(item => fieldNames.includes(item.fieldName));
        }

        this._dataSource = value;
    }

    public _dimensions: (SimpleAggregationDimension | DateAggregationDimension)[] = [];
    public get dimensions(): (SimpleAggregationDimension | DateAggregationDimension)[] {
        return this._dimensions;
    }
    public set dimensions(value) {
        if (ObjectUtil.isDifferent(this._dimensions, value)) {
            this.aggregationData = undefined;
            this._dimensions = value;
            this.loading = false;
        }
    }

    public _measures: AggregationMeasure[] = [];
    public get measures(): AggregationMeasure[] {
        return this._measures;
    }
    public set measures(value) {
        if (ObjectUtil.isDifferent(this._measures, value)) {
            this.aggregationData = undefined;
            this._measures = value;
            this.loading = false;
        }
    }

    public _filters: AggregationFilter[] = [];
    public get filters(): AggregationFilter[] {
        return this._filters;
    }
    public set filters(value) {
        if (ArrayUtil.all(value, x => x.isValid) && ObjectUtil.isDifferent(this.filters.filter(x => x.isValid), value)) {
            this.aggregationData = undefined;
            this.loading = false;
        }
        if (ObjectUtil.isDifferent(this._filters, value)) {
            this._filters = value;
        }
    }

    public aggregationData: AggregationData | undefined;
    public get errorMsg() {
        return this.errorsByLinesAsHtml();
    }
    public get responseIdMeasureOperators(): MeasureOperator[] {
        return AggregationMeasure.responseIdOperators;
    }
    public get notResponseIdMeasureOperators(): MeasureOperator[] {
        return AggregationMeasure.notResponseIdOperators;
    }
    public dateDimensionIntervals: DateAggregationDimensionInterval[] = [
        DateAggregationDimensionInterval.Day,
        DateAggregationDimensionInterval.Week,
        DateAggregationDimensionInterval.Month,
        DateAggregationDimensionInterval.Quarter,
        DateAggregationDimensionInterval.Year
    ];

    public updateDataModel(modelState: AnalyzeDataModelState): void {
        if (!modelState.dataSources.initiated || this.dataSource == undefined) return;
        this.dataSource = modelState.dataSources.data[this.dataSource.id];
    }

    public onLoadAggregationData(dataSourceId: string, dimensions: (SimpleAggregationDimension | DateAggregationDimension)[], measureFields: AggregationMeasure[]) {
        this.error = undefined;
        this.loading = true;
    }

    public onLoadAggregationDataSuccess(data: AggregationData) {
        if (this.isAggregationQueryDataValid() && this.loading) {
            this.aggregationData = data;
            this.loading = false;
        }
    }

    public onLoadAggregationDataFail(error: string[]) {
        if (this.loading) {
            this.error = error;
            this.loading = false;
        }
    }

    public removeDimension(removeItem: (SimpleAggregationDimension | DateAggregationDimension)) {
        this.dimensions = ArrayUtil.remove(
            ObjectUtil.clone(this.dimensions),
            item => item.toString() == removeItem.toString()
        );
    }

    public removeMeasure(removeItem: AggregationMeasure) {
        this.measures = ArrayUtil.remove(
            ObjectUtil.clone(this.measures),
            item => item.toString() == removeItem.toString()
        );
    }

    public canAddDimension(newItem: Field | (SimpleAggregationDimension | DateAggregationDimension) | AggregationMeasure) {
        let newItemFieldName = AggregationUi.getFieldName(newItem);
        if (newItemFieldName == fieldNameResponseId) return false;

        let isNewItemNotExisted = this.dimensions.find(item => item.fieldName == newItemFieldName) == undefined;
        return isNewItemNotExisted;
    }

    public addDimension(newItem: Field | (SimpleAggregationDimension | DateAggregationDimension) | AggregationMeasure) {
        if (!this.canAddDimension(newItem) || this.dataSource == undefined || this.dataSource.fields == undefined) return;

        let fieldValue = AggregationUi.getField(newItem, this.dataSource.fields);
        if (fieldValue == undefined) return;

        let newDimensions = ObjectUtil.clone(this.dimensions);
        if (newItem instanceof SimpleAggregationDimension || newItem instanceof DateAggregationDimension) {
            newDimensions.push(newItem);
        } else {
            newDimensions.push(AggregationDimension.createAggregationDimension(fieldValue));
        }

        this.dimensions = newDimensions;
    }

    public canAddMeasure(newItem: Field | (SimpleAggregationDimension | DateAggregationDimension) | AggregationMeasure) {
        if (this.dataSource == undefined || this.dataSource.fields == undefined) return false;

        let fieldValue = <Field>AggregationUi.getField(newItem, this.dataSource.fields);
        if (fieldValue == undefined || !Field.canBeMeasure(fieldValue)) return false;

        let newMeasureItem = newItem instanceof AggregationMeasure ? newItem : this.newMeasureToAddByField(fieldValue);
        if (newMeasureItem == null) return false;

        let existedMeasure = this.measures.find(item => item.toString() == (<AggregationMeasure>newMeasureItem).toString());
        return existedMeasure == undefined;
    }

    public addMeasure(newItem: Field | (SimpleAggregationDimension | DateAggregationDimension) | AggregationMeasure) {
        if (!this.canAddMeasure(newItem) || this.dataSource == undefined || this.dataSource.fields == undefined) return;

        let fieldValue = AggregationUi.getField(newItem, this.dataSource.fields);
        if (fieldValue == undefined) return;

        let newMeasures = ObjectUtil.clone(this.measures);
        if (newItem instanceof AggregationMeasure) {
            newMeasures.push(newItem);
        } else {
            let newMeasureItem = this.newMeasureToAddByField(fieldValue);
            if (newMeasureItem) newMeasures.push(newMeasureItem);
        }

        this.measures = newMeasures;
    }

    public canAddFilter(newItem: Field | (SimpleAggregationDimension | DateAggregationDimension) | AggregationMeasure | AggregationFilter) {
        let newItemFieldName = AggregationUi.getFieldName(newItem);
        if (newItemFieldName == fieldNameResponseId) return false;

        let isNewItemNotExisted = this.filters.find(item => item.fieldName == newItemFieldName) == undefined;
        return isNewItemNotExisted;
    }

    public addFilter(newItem: AggregationFilter | Field) {
        if (!this.canAddFilter(newItem) || this.dataSource == undefined || this.dataSource.fields == undefined) return;

        let fieldValue = AggregationUi.getField(newItem, this.dataSource.fields);
        if (fieldValue == undefined) return;

        let newFilters = ObjectUtil.clone(this.filters);
        if (newItem instanceof AggregationFilter)
            newFilters.push(newItem);
        else
            newFilters.push(AggregationFilter.createByField(newItem));

        this.filters = newFilters;
    }

    public removeFilter(removeItem: AggregationFilter | Field) {
        let removeItemFieldName = removeItem instanceof Field ? removeItem.name : removeItem.fieldName;
        this.filters = ArrayUtil.remove(
            ObjectUtil.clone(this.filters),
            item => item.fieldName == removeItemFieldName
        );
    }

    public isAggregationQueryDataValid(): boolean {
        return AggregationData.isQueryDataValid(this.dimensions, this.measures);
    }

    public isMeasureOperatorChanged(newOperator: MeasureOperator, measureFieldTarget: AggregationMeasure) {
        return newOperator != measureFieldTarget.operator;
    }

    public updateMeasureOperator(newOperator: MeasureOperator, updateItem: AggregationMeasure) {
        if (!this.isMeasureOperatorChanged(newOperator, updateItem)) return;
        let newMeasures = ObjectUtil.clone(this.measures);
        for (var i = 0; i < newMeasures.length; i++) {
            if (newMeasures[i].toString() == updateItem.toString()) {

                newMeasures[i] = ObjectUtil.clone(newMeasures[i]);
                newMeasures[i].operator = newOperator;
                this.measures = newMeasures;
                return;
            }
        }
    }

    public isDateDimensionIntervalChanged(newInterval: DateAggregationDimensionInterval, dimension: DateAggregationDimension) {
        return newInterval != dimension.interval;
    }

    public updateDateDimensionInterval(newInterval: DateAggregationDimensionInterval, dimension: DateAggregationDimension) {
        if (!this.isDateDimensionIntervalChanged(newInterval, dimension)) return;
        let newDimensions = <DateAggregationDimension[]>ObjectUtil.clone(this.dimensions);
        for (var i = 0; i < newDimensions.length; i++) {
            if (newDimensions[i].toString() == dimension.toString()) {

                newDimensions[i] = ObjectUtil.clone(newDimensions[i]);
                newDimensions[i].interval = newInterval;
                this.dimensions = newDimensions;
                return;
            }
        }
    }

    public updateDimensions(dimensions: (SimpleAggregationDimension | DateAggregationDimension)[]) {
        this.dimensions = ObjectUtil.clone(dimensions);
    }

    public updateMeasures(measures: AggregationMeasure[]) {
        this.measures = ObjectUtil.clone(measures);
    }

    public updateQueryData(dimensions: (SimpleAggregationDimension | DateAggregationDimension)[], measures: AggregationMeasure[]) {
        this.updateDimensions(dimensions);
        this.updateMeasures(measures);
    }

    public getDimensionItemTitle(item: (SimpleAggregationDimension | DateAggregationDimension) | AggregationMeasure, getMultiLangTextCallback: (value: Dictionary<string>) => string) {
        if (this.dataSource == undefined || this.dataSource.fields == undefined) return "";

        let fieldValue = AggregationUi.getField(item, this.dataSource.fields);
        if (fieldValue == undefined) return "";

        return getMultiLangTextCallback(fieldValue.title);
    }

    public getFilterItemTitle(item: AggregationFilter | Field, getMultiLangTextCallback: (value: Dictionary<string>) => string) {
        if (this.dataSource == undefined || this.dataSource.fields == undefined) return "";

        let fieldValue = AggregationUi.getField(item, this.dataSource.fields);
        if (fieldValue == undefined) return "";

        return getMultiLangTextCallback(fieldValue.title);
    }

    public getMeasureItemTitle(item: (SimpleAggregationDimension | DateAggregationDimension) | AggregationMeasure, getMultiLangTextCallback: (value: Dictionary<string>) => string) {
        if (this.dataSource == undefined || this.dataSource.fields == undefined) return "";

        let fieldValue = AggregationUi.getField(item, this.dataSource.fields);
        if (fieldValue == undefined) return "";

        return getMultiLangTextCallback(fieldValue.title);
    }

    public newMeasureToAddByField(fieldValue: Field, operator?: MeasureOperator) {
        let availableOperators = this.getAvailableMeasureOperators(fieldValue);
        if (operator && !availableOperators.includes(operator)) return null;
        return AggregationMeasure.createByField(fieldValue, this.getAvailableMeasureOperators(fieldValue));
    }

    public isQueryDataDiffFromAggregationQueryData() {
        if (this.aggregationData == undefined) return true;
        if (ObjectUtil.isDifferent(this.dimensions, this.aggregationData.dimensions) &&
            ObjectUtil.isDifferent(this.measures, this.aggregationData.measures) &&
            ArrayUtil.all(this.filters, x => x.isValid) &&
            ObjectUtil.isDifferent(this.filters, this.aggregationData.filters)) return true;
        return false;
    }

    public getAllFieldNamesInQueryData(): string[] {
        let allFieldNames = ArrayUtil.concatAll(
            this.dimensions.map(item => item.fieldName),
            this.measures.map(item => item.fieldName),
            this.filters.map(item => item.fieldName)
        );
        return ArrayUtil.distinct(allFieldNames);
    }

    public updateFilterItem(updateItem: AggregationFilter) {
        let newFilters = ObjectUtil.clone(this.filters);

        for (let i = 0; i < this.filters.length; i++) {
            const item = this.filters[i];
            if (item.fieldName == updateItem.fieldName) {
                newFilters[i] = ObjectUtil.cloneDeep(updateItem);
                this.filters = newFilters;
                return;
            }
        }

    }

    private getMeasureItemOperatorTranslateKey(item: AggregationMeasure | (SimpleAggregationDimension | DateAggregationDimension)) {
        if (this.dataSource == undefined || this.dataSource.fields == undefined) return "";

        let fieldValue = AggregationUi.getField(item, this.dataSource.fields);
        if (fieldValue == undefined) return "";

        if (item instanceof SimpleAggregationDimension || item instanceof DateAggregationDimension)
            return getMeasureOperatorTranslateKey(AggregationMeasure.defaultNotResponseIdOperator);

        if (item instanceof AggregationMeasure) return getMeasureOperatorTranslateKey((<AggregationMeasure>item).operator);
        return "";
    }

    private getDateDimensionItemIntervalTranslateKey(item: AggregationMeasure | DateAggregationDimension) {
        if (item instanceof DateAggregationDimension)
            return getDateDimensionIntervalTranslateKey(item.interval);
        else
            return getDateDimensionIntervalTranslateKey(DateAggregationDimension.defaultInterval);
    }

    private getAvailableMeasureOperators(item: Field | AggregationMeasure) {
        let fieldName = item instanceof Field ? item.name : item.fieldName;

        if (fieldName == fieldNameResponseId) return this.responseIdMeasureOperators;
        if (this.measures.length == 0) return this.notResponseIdMeasureOperators;

        let selectedOperators = this.measures.filter(x => x.fieldName == fieldName).map(x => x.operator);
        return this.notResponseIdMeasureOperators.filter(operator => {
            return (item instanceof AggregationMeasure && item.operator == operator) || !selectedOperators.includes(operator);
        });
    }

    private isDateAggregationDimension(item: any) {
        return item instanceof DateAggregationDimension;
    }
}