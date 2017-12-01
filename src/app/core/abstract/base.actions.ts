
import { Action } from "@ngrx/store";
import { DataModelState, DataModelCollection } from "./base.states";
import { BaseDataModel } from "./base.data-model";

export abstract class BaseDataModelAction implements Action {
    constructor(caller: string) {
        this.caller = caller;
    }

    public abstract type: string;
    public caller: string;
}

export abstract class BaseUpdateDataModelAction<TModel extends BaseDataModel> extends BaseDataModelAction {
    constructor(caller: string, data: DataModelCollection<TModel>) {
        super(caller);
        this.data = data;
    }

    public abstract type: string;
    public data: DataModelCollection<TModel>;
}

export abstract class BaseDataModelUpdatedAction<TModelState extends DataModelState> extends BaseDataModelAction {
    constructor(caller: string, currentModelState: TModelState) {
        super(caller);
        this.currentModelState = currentModelState;
    }

    public abstract type: string;
    public currentModelState: TModelState;
}

export abstract class BaseDeleteDataModelsAction extends BaseDataModelAction {
    constructor(caller: string, deleteItemIds: string[]) {
        super(caller);
        this.deleteItemIds = deleteItemIds;
    }

    public abstract type: string;
    public deleteItemIds: string[];
}

export abstract class BaseDataModelErrorsAction extends BaseDataModelAction {
    constructor(caller: string, errors: string[]) {
        super(caller);
        this.errors = errors;
    }

    public abstract type: string;
    public errors: string[];
}