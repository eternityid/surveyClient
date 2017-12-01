import { DataSourceFieldsUi, FieldItemType } from "@app/analyze/_shared/ui-models";
import { Field } from "@app/analyze/_shared/data-models";
import { Action } from "@ngrx/store";
import { ObjectUtil } from "@app/core/utils";
import { AnalyzeDataModelState } from "@app/analyze/_store/data-model";

export class Init_DataSourceFields implements Action {
    public static Type = 'Init_DataSourceFields [ui-model]';

    public type: string = Init_DataSourceFields.Type;
}

export class Destroy_DataSourceFields implements Action {
    public static Type = 'Destroy_DataSourceFields [ui-model]';
    
    public type: string = Destroy_DataSourceFields.Type;
}

export class LoadData_DataSourceFields {
    public static Type = 'LoadData_DataSourceFields [ui-model]';

    constructor(dataSourceId: string, currentModelState: AnalyzeDataModelState) {
        this.dataSourceId = dataSourceId;
        this.currentModelState = currentModelState;
    }

    public type: string = LoadData_DataSourceFields.Type;
    public dataSourceId: string;
    public currentModelState: AnalyzeDataModelState;
}

export class LoadDataSuccess_DataSourceFields {
    public static Type = 'LoadDataSuccess_DataSourceFields [ui-model]';

    public type: string = LoadDataSuccess_DataSourceFields.Type;
}

export class LoadDataFail_DataSourceFields {
    public static Type = 'LoadDataFail_DataSourceFields [ui-model]';

    constructor(error: any) {
        this.error = error;
    }

    public type: string = LoadDataFail_DataSourceFields.Type;
    public error: string[];
}

export class SetSelectedItems_DataSourceFields {
    public static Type = 'SetSelectedItems_DataSourceFields [ui-model]';

    constructor(selectedFieldNames: string[]) {
        this.selectedFieldNames = selectedFieldNames;
    }

    public type: string = SetSelectedItems_DataSourceFields.Type;
    public selectedFieldNames: string[];
}

export class SelectMeasure_DataSourceFields { 
    public static Type = 'SelectMeasure_DataSourceFields [ui-model]';

    constructor(field:Field) {
        this.field = field;
    }

    public type: string = SelectMeasure_DataSourceFields.Type;
    public field: Field;
}

export class SelectDimension_DataSourceFields { 
    public static Type = 'SelectDimension_DataSourceFields [ui-model]';

    constructor(field:Field) {
        this.field = field;
    }

    public type: string = SelectDimension_DataSourceFields.Type;
    public field: Field;
}