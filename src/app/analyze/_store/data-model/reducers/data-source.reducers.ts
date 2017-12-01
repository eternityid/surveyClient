
import { Action } from "@ngrx/store";
import { DataSource } from "@app/analyze/_shared/data-models";
import { DataModelCollection, initialDataModelCollection, updateDataModelCollection } from "@app/core/abstract";
import { LoadSuccess_DataSources, LoadFieldsSuccess_DataSources, Update_DataSources } from "@app/analyze/_store/data-model/actions";
import { ObjectUtil } from "@app/core/utils";

export function dataSourcesReducer(
    state: DataModelCollection<DataSource> = initialDataModelCollection<DataSource>(),
    action: Action
) {

    switch (action.type) {
        case Update_DataSources.Type:
            return (<Update_DataSources>action).data;

        default:
            return state;
    }
}

export function loadDataSourceFieldsSuccessReducer(
    state: DataModelCollection<DataSource> = initialDataModelCollection<DataSource>(),
    action: LoadFieldsSuccess_DataSources
) {
    let newState = ObjectUtil.clone(state);
    state.data = ObjectUtil.clone(state.data);

    let updateDataSource = ObjectUtil.clone(newState.data[action.dataSourceId]);
    if (updateDataSource != undefined) {
        updateDataSource.fields = action.fields;
    } else {
        updateDataSource = new DataSource({ id: action.dataSourceId });
        updateDataSource.fields = action.fields;
    }
    newState.data[action.dataSourceId] = updateDataSource;

    return ObjectUtil.isDifferent(state, newState) ? newState : state;
}