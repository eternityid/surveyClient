import { AggregationSettingUi } from "@app/analyze/_shared/ui-models";
import { Action } from "@ngrx/store";
import { BaseUiModel, updateUiStateByModelState } from "@app/core/abstract";
import { InitTriggerButtons_AggregationSetting, DestroyTriggerButtons_AggregationSetting, OpenPanel_AggregationSetting, OpenPanelTab_AggregationSetting, ClosePanel_AggregationSetting, InitPanel_AggregationSetting, DestroyPanel_AggregationSetting, SetFilters_AggregationSetting, ChangeSelectedItem_DataSourceList, UpdateFilterItem_AggregationSetting } from "@app/analyze/_store/ui-model/actions";
import { ObjectUtil } from "@app/core/utils";
import { Updated_DataSources } from "@app/analyze/_store/data-model/actions";

export function aggregationSettingUiReducer(state: AggregationSettingUi = new AggregationSettingUi(), action: Action) {

    switch (action.type) {
        case InitTriggerButtons_AggregationSetting.Type:
            return state.destroyed ? new AggregationSettingUi() : state;
        case InitPanel_AggregationSetting.Type:
            return state.destroyed ? new AggregationSettingUi() : state;;
        case DestroyTriggerButtons_AggregationSetting.Type:
            return BaseUiModel.setUiModelDestroyed(new AggregationSettingUi());
        case DestroyPanel_AggregationSetting.Type:
            return BaseUiModel.setUiModelDestroyed(new AggregationSettingUi());
    }

    if (state.destroyed) return state;

    switch (action.type) {
        case ChangeSelectedItem_DataSourceList.Type:
            return changeDataSourceId_AggregationSettingReducer(state, <ChangeSelectedItem_DataSourceList>action);

        case OpenPanel_AggregationSetting.Type:
            return openPanel_AggregationSettingReducer(state, <OpenPanel_AggregationSetting>action);
        case OpenPanelTab_AggregationSetting.Type:
            return openPanelTab_AggregationSettingReducer(state, <OpenPanelTab_AggregationSetting>action);
        case ClosePanel_AggregationSetting.Type:
            return closePanel_AggregationSettingReducer(state, <ClosePanel_AggregationSetting>action);
        case SetFilters_AggregationSetting.Type:
            return setFilters_AggregationSettingReducer(state, <SetFilters_AggregationSetting>action);
        case UpdateFilterItem_AggregationSetting.Type:
            return updateFilterItem_AggregationSettingReducer(state, <UpdateFilterItem_AggregationSetting>action);

        case Updated_DataSources.Type:
            return updateUiStateByModelState(state, (<Updated_DataSources>action).currentModelState);
    }

    return state;
}

export function changeDataSourceId_AggregationSettingReducer(state: AggregationSettingUi, action: ChangeSelectedItem_DataSourceList) {
    let newState = ObjectUtil.clone(state);
    newState.dataSourceId = action.selectedId;
    return ObjectUtil.isDifferent(state, newState) ? newState : state;
}

export function openPanel_AggregationSettingReducer(state: AggregationSettingUi, action: OpenPanel_AggregationSetting) {
    let newState = ObjectUtil.clone(state);
    newState.openAggregationSettingPanel(action.activateTab);
    return ObjectUtil.isDifferent(state, newState) ? newState : state;
}

export function openPanelTab_AggregationSettingReducer(state: AggregationSettingUi, action: OpenPanelTab_AggregationSetting) {
    let newState = ObjectUtil.clone(state);
    newState.openAggregationSettingPanelTab(action.activateTab);
    return ObjectUtil.isDifferent(state, newState) ? newState : state;
}

export function closePanel_AggregationSettingReducer(state: AggregationSettingUi, action: ClosePanel_AggregationSetting) {
    let newState = ObjectUtil.clone(state);
    newState.closeAggregationSettingPanel();
    return ObjectUtil.isDifferent(state, newState) ? newState : state;
}

export function setFilters_AggregationSettingReducer(state: AggregationSettingUi, action: SetFilters_AggregationSetting) {
    let newState = ObjectUtil.clone(state);
    newState.setFilters(action.items);
    return ObjectUtil.isDifferent(state, newState) ? newState : state;
}

export function updateFilterItem_AggregationSettingReducer(state: AggregationSettingUi, action: UpdateFilterItem_AggregationSetting) {
    let newState = ObjectUtil.clone(state);
    newState.updateFilterItem(action.updateValue);
    return ObjectUtil.isDifferent(state, newState) ? newState : state;
}