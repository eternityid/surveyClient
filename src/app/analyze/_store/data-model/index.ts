
import { DataSource } from "@app/analyze/_shared/data-models";
import { combineReducers, Action, ActionReducer } from "@ngrx/store";
import { dataSourcesReducer } from "@app/analyze/_store/data-model/reducers";
import { DataModelState, DataModelCollection } from "@app/core/abstract";

export interface AnalyzeDataModelState extends DataModelState {
    dataSources: DataModelCollection<DataSource>
}

export const analyzeDataModelStateReducer: ActionReducer<AnalyzeDataModelState> = combineReducers<AnalyzeDataModelState, Action>({
    dataSources: dataSourcesReducer
});