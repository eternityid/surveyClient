import { Action } from "@ngrx/store";
import { DataSource, Field } from "@app/analyze/_shared/data-models";
import { AnalyzeDataModelState } from "@app/analyze/_store/data-model";
import { BaseDataModelErrorsAction, BaseDataModelUpdatedAction, BaseDataModelAction, BaseUpdateDataModelAction } from "@app/core/abstract";

export class Update_DataSources extends BaseUpdateDataModelAction<DataSource> {
    public static Type = 'Update_DataSources [data-model]';

    public type: string = Update_DataSources.Type;
}

export class Updated_DataSources extends BaseDataModelUpdatedAction<AnalyzeDataModelState> {
    public static Type = 'Updated_DataSources [data-model]';

    public type: string = Updated_DataSources.Type;
}

export class Load_DataSources extends BaseDataModelAction {
    public static Type = 'Load_DataSources [data-model]';

    public type: string = Load_DataSources.Type;
    public fromAction: string;
}

export class LoadSuccess_DataSources extends BaseDataModelAction {
    public static Type = 'LoadSuccess_DataSources [data-model]';

    constructor(caller: string, payload: Dictionary<DataSource>) {
        super(caller);
        this.payload = payload;
    }

    public type: string = LoadSuccess_DataSources.Type;
    public payload: Dictionary<DataSource>;
}

export class LoadFail_DataSources extends BaseDataModelErrorsAction {
    public static Type = 'LoadFail_DataSources [data-model]';

    constructor(caller: string, error: string[]) {
        super(caller, error);
    }

    public type: string = LoadFail_DataSources.Type;
}

export class LoadFields_DataSources extends BaseDataModelAction {
    public static Type = 'LoadFields_DataSources [data-model]';

    constructor(caller: string, dataSourceId: string) {
        super(caller);
        this.dataSourceId = dataSourceId;
    }

    public type: string = LoadFields_DataSources.Type;
    public dataSourceId: string;
}

export class LoadFieldsSuccess_DataSources extends BaseDataModelAction {
    public static Type = 'LoadFieldsSuccess_DataSources [data-model]';

    constructor(caller: string, dataSourceId: string, fields: Field[]) {
        super(caller);
        this.dataSourceId = dataSourceId;
        this.fields = fields;
    }

    public type: string = LoadFieldsSuccess_DataSources.Type;
    public dataSourceId: string;
    public fields: Field[];
}

export class LoadFieldsFail_DataSources extends BaseDataModelErrorsAction {
    public static Type = 'LoadFieldsFail_DataSources [data-model]';

    constructor(caller: string, dataSourceId: string, error: string[]) {
        super(caller, error);
        this.dataSourceId = dataSourceId;
    }

    public type: string = LoadFieldsFail_DataSources.Type;
    public dataSourceId: string;
}