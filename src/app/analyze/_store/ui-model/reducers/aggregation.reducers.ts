import { AggregationUi } from "@app/analyze/_shared/ui-models";
import { Action } from "@ngrx/store";
import { SetDataSource_Aggregation, LoadAggregationData_Aggregation, LoadAggregationDataSuccess_Aggregation, LoadAggregationDataFail_Aggregation, UpdateMeasureOperator_Aggregation, RemoveDimension_Aggregation, RemoveMeasure_Aggregation, AddDimension_Aggregation, AddMeasure_Aggregation, UpdateQueryData_Aggregation, UpdateDateDimensionInterval_Aggregation, Init_Aggregation, Destroy_Aggregation, AddFilter_Aggregation, RemoveFilter_Aggregation, UpdateFilterItem_AggregationSetting } from "@app/analyze/_store/ui-model/actions";
import { ObjectUtil } from "@app/core/utils";
import { Updated_DataSources } from "@app/analyze/_store/data-model/actions";
import { updateUiStateByModelState, BaseUiModel } from "@app/core/abstract";

export function aggregationUiReducer(state: AggregationUi = new AggregationUi(), action: Action) {

    switch (action.type) {
        case Init_Aggregation.Type:
            return new AggregationUi();
        case Destroy_Aggregation.Type:
            return BaseUiModel.setUiModelDestroyed(new AggregationUi());
    }

    if (state.destroyed) return state;

    switch (action.type) {
        case SetDataSource_Aggregation.Type:
            return setDataSource_AggregationReducer(state, <SetDataSource_Aggregation>action);

        case LoadAggregationData_Aggregation.Type:
            return loadAggregationData_AggregationReducer(state, <LoadAggregationData_Aggregation>action);

        case LoadAggregationDataSuccess_Aggregation.Type:
            return loadAggregationDataSuccess_AggregationReducer(state, <LoadAggregationDataSuccess_Aggregation>action);

        case LoadAggregationDataFail_Aggregation.Type:
            return loadAggregationDataFail_AggregationReducer(state, <LoadAggregationDataFail_Aggregation>action);

        case UpdateMeasureOperator_Aggregation.Type:
            return updateMeasureOperator_AggregationReducer(state, <UpdateMeasureOperator_Aggregation>action);

        case RemoveDimension_Aggregation.Type:
            return removeDimension_AggregationReducer(state, <RemoveDimension_Aggregation>action);

        case RemoveMeasure_Aggregation.Type:
            return removeMeasure_AggregationReducer(state, <RemoveMeasure_Aggregation>action);

        case AddDimension_Aggregation.Type:
            return addDimension_AggregationReducer(state, <AddDimension_Aggregation>action);

        case AddMeasure_Aggregation.Type:
            return addMeasure_AggregationReducer(state, <AddMeasure_Aggregation>action);

        case AddFilter_Aggregation.Type:
            return addFilter_AggregationReducer(state, <AddFilter_Aggregation>action);

        case RemoveFilter_Aggregation.Type:
            return removeFilter_AggregationReducer(state, <RemoveFilter_Aggregation>action);

        case UpdateQueryData_Aggregation.Type:
            return updateQueryData_AggregationReducer(state, <UpdateQueryData_Aggregation>action);

        case UpdateDateDimensionInterval_Aggregation.Type:
            return updateDateDimensionInterval_AggregationReducer(state, <UpdateDateDimensionInterval_Aggregation>action);

        case UpdateFilterItem_AggregationSetting.Type:
            return updateFilterItem_AggregationReducer(state, <UpdateFilterItem_AggregationSetting>action);

        case Updated_DataSources.Type:
            return updateUiStateByModelState(state, (<Updated_DataSources>action).currentModelState);

        default:
            return state;
    }
}

export function setDataSource_AggregationReducer(state: AggregationUi = new AggregationUi(), action: SetDataSource_Aggregation) {
    let newState = ObjectUtil.clone(state);
    newState.dataSource = action.dataSource;
    return ObjectUtil.isDifferent(state, newState) ? newState : state;
}

export function loadAggregationData_AggregationReducer(state: AggregationUi = new AggregationUi(), action: LoadAggregationData_Aggregation) {
    let newState = ObjectUtil.clone(state);
    newState.onLoadAggregationData(action.dataSourceId, action.dimensions, action.measures);
    return ObjectUtil.isDifferent(state, newState) ? newState : state;
}

export function loadAggregationDataSuccess_AggregationReducer(state: AggregationUi = new AggregationUi(), action: LoadAggregationDataSuccess_Aggregation) {
    let newState = ObjectUtil.clone(state);
    newState.onLoadAggregationDataSuccess(action.data);
    return ObjectUtil.isDifferent(state, newState) ? newState : state;
}

export function loadAggregationDataFail_AggregationReducer(state: AggregationUi = new AggregationUi(), action: LoadAggregationDataFail_Aggregation) {
    let newState = ObjectUtil.clone(state);
    newState.onLoadAggregationDataFail(action.error);
    return ObjectUtil.isDifferent(state, newState) ? newState : state;
}

export function updateMeasureOperator_AggregationReducer(state: AggregationUi = new AggregationUi(), action: UpdateMeasureOperator_Aggregation) {
    let newState = ObjectUtil.clone(state);
    newState.updateMeasureOperator(action.operator, action.measureField);
    return ObjectUtil.isDifferent(state, newState) ? newState : state;
}

export function removeDimension_AggregationReducer(state: AggregationUi = new AggregationUi(), action: RemoveDimension_Aggregation) {
    let newState = ObjectUtil.clone(state);
    newState.removeDimension(action.item);
    return ObjectUtil.isDifferent(state, newState) ? newState : state;
}

export function removeMeasure_AggregationReducer(state: AggregationUi = new AggregationUi(), action: RemoveMeasure_Aggregation) {
    let newState = ObjectUtil.clone(state);
    newState.removeMeasure(action.item);
    return ObjectUtil.isDifferent(state, newState) ? newState : state;
}

export function addDimension_AggregationReducer(state: AggregationUi = new AggregationUi(), action: AddDimension_Aggregation) {
    let newState = ObjectUtil.clone(state);
    newState.addDimension(action.field);
    return ObjectUtil.isDifferent(state, newState) ? newState : state;
}

export function addMeasure_AggregationReducer(state: AggregationUi, action: AddMeasure_Aggregation) {
    let newState = ObjectUtil.clone(state);
    newState.addMeasure(action.field);
    return ObjectUtil.isDifferent(state, newState) ? newState : state;
}

export function updateQueryData_AggregationReducer(state: AggregationUi, action: UpdateQueryData_Aggregation) {
    let newState = ObjectUtil.clone(state);
    newState.updateQueryData(action.dimensions, action.measures);
    return ObjectUtil.isDifferent(state, newState) ? newState : state;
}

export function updateDateDimensionInterval_AggregationReducer(state: AggregationUi, action: UpdateDateDimensionInterval_Aggregation) {
    let newState = ObjectUtil.clone(state);
    newState.updateDateDimensionInterval(action.intervalValue, action.dimension);
    return ObjectUtil.isDifferent(state, newState) ? newState : state;
}

export function addFilter_AggregationReducer(state: AggregationUi, action: AddFilter_Aggregation) {
    let newState = ObjectUtil.clone(state);
    newState.addFilter(action.item);
    return ObjectUtil.isDifferent(state, newState) ? newState : state;
}

export function removeFilter_AggregationReducer(state: AggregationUi, action: RemoveFilter_Aggregation) {
    let newState = ObjectUtil.clone(state);
    newState.removeFilter(action.item);
    return ObjectUtil.isDifferent(state, newState) ? newState : state;
}

export function updateFilterItem_AggregationReducer(state: AggregationUi, action: UpdateFilterItem_AggregationSetting) {
    let newState = ObjectUtil.clone(state);
    newState.updateFilterItem(action.updateValue);
    return ObjectUtil.isDifferent(state, newState) ? newState : state;
}