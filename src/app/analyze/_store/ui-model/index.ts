import { combineReducers, Action, ActionReducer } from "@ngrx/store";
import { DataSourceListUi, DataSourceFieldsUi, AggregationUi, AggregationSettingUi } from "@app/analyze/_shared/ui-models";
import { dataSourceListUiReducer, dataSourceFieldsUiReducer, aggregationUiReducer, aggregationSettingUiReducer } from "@app/analyze/_store/ui-model/reducers";
import { UiState } from "@app/core/abstract";

export const analyzeUiModelStateReducer: ActionReducer<AnalyzeUIModelState> = combineReducers<AnalyzeUIModelState, Action>({
    dataSourceList: dataSourceListUiReducer,
    dataSourceFields: dataSourceFieldsUiReducer,
    aggregation: aggregationUiReducer,
    aggregationSetting: aggregationSettingUiReducer
});

export interface AnalyzeUIModelState extends UiState {
    dataSourceList: DataSourceListUi,
    dataSourceFields: DataSourceFieldsUi,
    aggregation: AggregationUi,
    aggregationSetting: AggregationSettingUi
}