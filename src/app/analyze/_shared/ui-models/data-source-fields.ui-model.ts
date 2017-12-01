
import { Field, FieldType, fieldNameResponseId } from "@app/analyze/_shared/data-models";
import { AnalyzeDataModelState } from "@app/analyze/_store/data-model";
import { ObjectUtil, ArrayUtil } from "@app/core/utils";
import { BaseUiModel } from "@app/core/abstract";


export class DataSourceFieldsUi extends BaseUiModel {
    constructor() {
        super();
    }

    private _dataSourceId: string | undefined;
    public get dataSourceId(): string | undefined {
        return this._dataSourceId;
    }
    public set dataSourceId(value) {
        if (value == undefined) {
            this.fields = undefined;
            this.loading = false;
        }

        this._dataSourceId = value;
    }
    private _fields: Field[] | undefined;
    public get fields(): Field[] | undefined {
        return this._fields;
    }
    public set fields(value) {
        this._fields = value ? sortFields(value) : value;
        if (this.fields == undefined) {
            this.dimensions = [];
            this.measures = [];
        } else {
            this.dimensions = this.fields.filter(Field.isDimensionOnly).map(item => fieldToFieldItemUi(item, FieldItemType.dimension));
            this.measures = this.fields.filter(Field.canBeMeasure).map(item => fieldToFieldItemUi(item, FieldItemType.measure));
        }
    }
    public dimensions: FieldItemUi[] = [];
    public measures: FieldItemUi[] = [];

    public get errorMsg() {
        return this.errorsByLinesAsHtml();
    }

    public onDataSourceFieldsChangeSelectedItem(selectedDataSourceId: string | undefined) {
        this.dataSourceId = selectedDataSourceId;
    }

    public onLoadFields(dataSourceId: string, currentModelState: AnalyzeDataModelState) {
        this.dataSourceId = dataSourceId;
        this.error = undefined;
        this.updateDataModel(currentModelState);
        this.loading = true;
    }

    public onLoadFieldsSuccess() {
        this.loading = false;
    }

    public onLoadFieldsFail(error: string[]) {
        this.error = error;
        this.loading = false;
    }

    public setSelectedFields(selectedFieldNames: string[]) {
        this.setSelectedDimensions(selectedFieldNames);
        this.setSelectedMeasures(selectedFieldNames);
    }

    public updateDataModel(modelState: AnalyzeDataModelState): void {
        if (!modelState.dataSources.initiated || this.dataSourceId == undefined) return;

        let currentDataSource = modelState.dataSources.data[this.dataSourceId];
        if (currentDataSource == undefined) {
            this.fields = undefined;
        } else if (ObjectUtil.isDifferent(this.fields, currentDataSource.fields)) {
            this.fields = currentDataSource.fields;
        }
    }

    private getFieldItems(): FieldItemUi[] {
        let result: FieldItemUi[] = [];
        return result.concat(this.dimensions ? this.dimensions : [], this.measures ? this.measures : []);
    }

    private setSelectedDimensions(selectedFieldNames: string[]) {
        this.dimensions = updateFieldItemSelections(this.dimensions, selectedFieldNames);
    }

    private setSelectedMeasures(selectedFieldNames: string[]) {
        this.measures = updateFieldItemSelections(this.measures, selectedFieldNames);
    }
}

export interface FieldItemUiData {
    selected?: boolean;
    fieldItemType: FieldItemType;
}

export class FieldItemUi implements FieldItemUiData {
    constructor(fieldSource: Field, data: FieldItemUiData) {
        this.fieldSource = fieldSource;
        this.selected = data.selected ? data.selected : false;
        this.fieldItemType = data.fieldItemType;
    }

    public fieldSource: Field;
    public selected: boolean;
    public fieldItemType: FieldItemType;

    public get name(): string {
        return this.fieldSource.name;
    }
    public get title(): { [index: string]: string } {
        return this.fieldSource.title;
    }
    public get type(): string {
        return this.fieldSource.type;
    }
    public get iconClass(): string {
        switch (this.type) {
            case FieldType.Date:
                return 'calendar-icon-sm';
            case FieldType.Numeric:
                return 'number-icon-sm';
            case FieldType.String:
            case FieldType.StringArray:
                return 'text-icon-sm';

            default:
                return '';
        }
    }
}

export enum FieldItemType {
    dimension = 'dimension',
    measure = 'measure'
}

function fieldToFieldItemUi(field: Field, fieldAs: FieldItemType) {
    let result = new FieldItemUi(field, {
        selected: false,
        fieldItemType: fieldAs
    });
    return result;
}

function sortFields(fields: Field[]): Field[] {
    return ArrayUtil.sortBy(fields, (value: Field) => {
        switch (value.type) {
            case FieldType.String:
                return 0;
            case FieldType.StringArray:
                return 1;
            case FieldType.Date:
                return 2;
            case FieldType.Numeric:
                return 3;
            default:
                return 4;
        }
    });
}

function updateFieldItemSelections(sourcefieldItems: FieldItemUi[], selectedFieldNames: string[]) {
    let updatedFieldItems = ObjectUtil.clone(sourcefieldItems);
    for (var i = 0; i < updatedFieldItems.length; i++) {
        let newSelectedValue = selectedFieldNames.includes(updatedFieldItems[i].name);
        if (updatedFieldItems[i].selected != newSelectedValue) {
            updatedFieldItems[i] = ObjectUtil.clone(updatedFieldItems[i]);
            updatedFieldItems[i].selected = newSelectedValue;
        }
    }
    return updatedFieldItems;
}