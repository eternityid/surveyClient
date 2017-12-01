import { BaseDataModel } from "./base.data-model";
import { BaseUiModel } from "./base.ui-model";

export interface DataModelState{
    [index: string]: DataModelCollection<BaseDataModel>;
}

export interface DataModelCollection<TModel extends BaseDataModel> {
    initiated: boolean;
    data: Dictionary<TModel>;
}

export function initialDataModelCollection<TModel extends BaseDataModel>(): DataModelCollection<TModel> {
    return {
        initiated: false,
        data: {}
    };
}

export interface UiState {
    [index: string]: BaseUiModel;
}