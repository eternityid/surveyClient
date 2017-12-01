import { Action } from "@ngrx/store";
import { ObjectUtil } from "@app/core/utils";
import { DataModelCollection, DataModelState } from "./base.states";
import { BaseUiModel } from "./base.ui-model";
import { BaseDataModel } from "./base.data-model";
import { BaseDeleteDataModelsAction } from "@app/core/abstract";

export function updateDataModelCollection<TModel extends BaseDataModel>(state: DataModelCollection<TModel>, data: Dictionary<TModel>, isRemoveNotExistedItems?: boolean) {
    let newState = ObjectUtil.clone(state);
    newState.data = ObjectUtil.clone(newState.data);
    newState.initiated = true;

    if (isRemoveNotExistedItems) {
        removeNotExistedItems(newState, data);
    }

    ObjectUtil.keys(data).forEach(id => {
        if (ObjectUtil.isDifferent(newState.data[id], data[id])) {
            newState.data[id] = data[id];
        }
    });

    return ObjectUtil.isDifferent(state, newState) ? newState : state;

    function removeNotExistedItems<TModel extends BaseDataModel>(state: DataModelCollection<TModel>, data: Dictionary<TModel>) {
        let updateItemIds = ObjectUtil.keys(data);
        let removeItemIds = ObjectUtil.keys(state.data).filter(id => !updateItemIds.includes(id));
        removeItemIds.forEach(id => {
            delete state.data[id];
        });
    }
}

export function deleteDataModels<TModel extends BaseDataModel>(state: DataModelCollection<TModel>, action: BaseDeleteDataModelsAction) {
    let newState = ObjectUtil.clone(state);
    action.deleteItemIds.map(id => {
        delete newState.data[id];
    });
    return newState;
}

export function updateUiStateByModelState<TUi extends BaseUiModel, TModel extends BaseDataModel, TModelState extends DataModelState>(vmState: TUi, modelState: TModelState | null) {
    if (vmState.updateDataModel == null || modelState == null) return vmState;

    let newUiState = ObjectUtil.clone(vmState);
    newUiState.updateDataModel(modelState);
    return ObjectUtil.isDifferent(vmState, newUiState) ? newUiState : vmState;
}