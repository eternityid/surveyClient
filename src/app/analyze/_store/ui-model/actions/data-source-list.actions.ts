import { DataSourceListUi } from "@app/analyze/_shared/ui-models";
import { DataSource } from "@app/analyze/_shared/data-models";
import { Action } from "@ngrx/store";
import { ObjectUtil } from "@app/core/utils";
import { AnalyzeDataModelState } from "@app/analyze/_store/data-model";

export class Init_DataSourceList implements Action {
    public static Type = 'Init_DataSourceList [ui-model]';

    public type: string = Init_DataSourceList.Type;
}

export class Destroy_DataSourceList implements Action {
    public static Type = 'Destroy_DataSourceList [ui-model]';
    
    public type: string = Destroy_DataSourceList.Type;
}

export class LoadData_DataSourceList {
    public static Type = 'LoadData_DataSourceList [ui-model]';

    constructor(currentModelState: AnalyzeDataModelState) {
        this.currentModelState = currentModelState;
    }

    public type: string = LoadData_DataSourceList.Type;
    public currentModelState: AnalyzeDataModelState;
}

export class LoadDataSuccess_DataSourceList {
    public static Type = 'LoadDataSuccess_DataSourceList [ui-model]';

    constructor() { }

    public type: string = LoadDataSuccess_DataSourceList.Type;
}

export class LoadDataFail_DataSourceList {
    public static Type = 'LoadDataFail_DataSourceList [ui-model]';

    constructor(error: any) {
        this.error = error;
    }

    public type: string = LoadDataFail_DataSourceList.Type;
    public error: string[];
}

export class ChangeSelectedItem_DataSourceList {
    public static Type = 'ChangeSelectedItem_DataSourceList [ui-model]';

    constructor(selectedId: string | undefined) {
        this.selectedId = selectedId;
    }

    public type: string = ChangeSelectedItem_DataSourceList.Type;
    public selectedId: string | undefined;
}