import { DataSourceFieldsUi } from "@app/analyze/_shared/ui-models";
import { Action } from "@ngrx/store";
import { LoadData_DataSourceFields, LoadDataSuccess_DataSourceFields, LoadDataFail_DataSourceFields, SetSelectedItems_DataSourceFields, SelectDimension_DataSourceFields, SelectMeasure_DataSourceFields, Init_DataSourceFields, Destroy_DataSourceFields, ChangeSelectedItem_DataSourceList } from "@app/analyze/_store/ui-model/actions";
import { AnalyzeDataModelState } from "@app/analyze/_store/data-model";
import { ObjectUtil } from "@app/core/utils";
import { Updated_DataSources } from "@app/analyze/_store/data-model/actions";
import { updateUiStateByModelState, BaseUiModel } from "@app/core/abstract";

export function dataSourceFieldsUiReducer(state: DataSourceFieldsUi = new DataSourceFieldsUi(), action: Action) {

    switch (action.type) {
        case Init_DataSourceFields.Type:
            return new DataSourceFieldsUi();
        case Destroy_DataSourceFields.Type:
            return BaseUiModel.setUiModelDestroyed(new DataSourceFieldsUi());
    }

    if (state == undefined || state.destroyed) return state;

    switch (action.type) {
        case ChangeSelectedItem_DataSourceList.Type:
            return changeSelectedItem_DataSourceFieldsReducer(state, <ChangeSelectedItem_DataSourceList>action);

        case LoadData_DataSourceFields.Type:
            return loadData_DataSourceFieldsReducer(state, <LoadData_DataSourceFields>action);

        case LoadDataSuccess_DataSourceFields.Type:
            return loadDataSuccess_DataSourceFieldsReducer(state, <LoadDataSuccess_DataSourceFields>action);

        case LoadDataFail_DataSourceFields.Type:
            return loadDataFail_DataSourceFieldsReducer(state, <LoadDataFail_DataSourceFields>action);

        case SetSelectedItems_DataSourceFields.Type:
            return setSelectedFields_DataSourceFieldsReducer(state, <SetSelectedItems_DataSourceFields>action);

        case Updated_DataSources.Type:
            return updateUiStateByModelState(state, (<Updated_DataSources>action).currentModelState);

        default:
            return state;
    }
}

export function changeSelectedItem_DataSourceFieldsReducer(state: DataSourceFieldsUi = new DataSourceFieldsUi(), action: ChangeSelectedItem_DataSourceList) {
    let newState = ObjectUtil.clone(state);
    newState.onDataSourceFieldsChangeSelectedItem(action.selectedId);
    return ObjectUtil.isDifferent(state, newState) ? newState : state;
}

export function loadData_DataSourceFieldsReducer(state: DataSourceFieldsUi = new DataSourceFieldsUi(), action: LoadData_DataSourceFields) {
    let newState = ObjectUtil.clone(state);
    newState.onLoadFields(action.dataSourceId, action.currentModelState);
    return ObjectUtil.isDifferent(state, newState) ? newState : state;
}

export function loadDataSuccess_DataSourceFieldsReducer(state: DataSourceFieldsUi = new DataSourceFieldsUi(), action: LoadDataSuccess_DataSourceFields) {
    let newState = ObjectUtil.clone(state);
    newState.onLoadFieldsSuccess();
    return ObjectUtil.isDifferent(state, newState) ? newState : state;
}

export function loadDataFail_DataSourceFieldsReducer(state: DataSourceFieldsUi = new DataSourceFieldsUi(), action: LoadDataFail_DataSourceFields) {
    let newState = ObjectUtil.clone(state);
    newState.onLoadFieldsFail(action.error);
    return ObjectUtil.isDifferent(state, newState) ? newState : state;
}

export function setSelectedFields_DataSourceFieldsReducer(state: DataSourceFieldsUi = new DataSourceFieldsUi(), action: SetSelectedItems_DataSourceFields) {
    let newState = ObjectUtil.clone(state);
    newState.setSelectedFields(action.selectedFieldNames);
    return ObjectUtil.isDifferent(state, newState) ? newState : state;
}