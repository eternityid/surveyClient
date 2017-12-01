import { Action } from "@ngrx/store";
import { DataSourceListUi } from "@app/analyze/_shared/ui-models";
import { LoadDataFail_DataSourceList, ChangeSelectedItem_DataSourceList, LoadData_DataSourceList, LoadDataSuccess_DataSourceList, Init_DataSourceList, Destroy_DataSourceList } from "@app/analyze/_store/ui-model/actions";
import { DataSource } from "@app/analyze/_shared/data-models";
import { AnalyzeDataModelState } from "@app/analyze/_store/data-model";
import { ObjectUtil } from "@app/core/utils";
import { Updated_DataSources } from "@app/analyze/_store/data-model/actions";
import { updateUiStateByModelState, BaseUiModel } from "@app/core/abstract";

export function dataSourceListUiReducer(state: DataSourceListUi = new DataSourceListUi(), action: Action) {

    switch (action.type) {
        case Init_DataSourceList.Type:
            return new DataSourceListUi();
        case Destroy_DataSourceList.Type:
            return BaseUiModel.setUiModelDestroyed(new DataSourceListUi());
    }
    
    if (state == undefined || state.destroyed) return state;
    
    switch (action.type) {
        case LoadData_DataSourceList.Type:
            return loadDataSources_DataSourceListReducer(state, <LoadData_DataSourceList>action);

        case LoadDataSuccess_DataSourceList.Type:
            return loadDataSourcesSuccess_DataSourceListReducer(state, <LoadDataSuccess_DataSourceList>action);

        case LoadDataFail_DataSourceList.Type:
            return loadDataSourcesFail_DataSourceListReducer(state, <LoadDataFail_DataSourceList>action);

        case ChangeSelectedItem_DataSourceList.Type:
            return changeSelectedDataSourceId_DataSourceListReducer(state, <ChangeSelectedItem_DataSourceList>action);

        case Updated_DataSources.Type:
            return updateUiStateByModelState(state, (<Updated_DataSources>action).currentModelState);

        default:
            return state;
    }
}

export function loadDataSources_DataSourceListReducer(state: DataSourceListUi = new DataSourceListUi(), action: LoadData_DataSourceList) {
    let newState = ObjectUtil.clone(state);
    newState.onLoadData(action.currentModelState);
    return ObjectUtil.isDifferent(state, newState) ? newState : state;
}

export function loadDataSourcesSuccess_DataSourceListReducer(state: DataSourceListUi = new DataSourceListUi(), action: LoadDataSuccess_DataSourceList) {
    let newState = ObjectUtil.clone(state);
    newState.onLoadDataSuccess();
    return ObjectUtil.isDifferent(state, newState) ? newState : state;
}

export function loadDataSourcesFail_DataSourceListReducer(state: DataSourceListUi = new DataSourceListUi(), action: LoadDataFail_DataSourceList) {
    let newState = ObjectUtil.clone(state);
    newState.onLoadDataFail(action.error);
    return ObjectUtil.isDifferent(state, newState) ? newState : state;
}

export function changeSelectedDataSourceId_DataSourceListReducer(state: DataSourceListUi = new DataSourceListUi(), action: ChangeSelectedItem_DataSourceList) {
    let newState = ObjectUtil.clone(state);
    newState.changeSelectedDataSourceId(action.selectedId);
    return ObjectUtil.isDifferent(state, newState) ? newState : state;
}