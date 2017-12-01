import { AppState } from "@app/store";
import { AnalyzeUIModelState, analyzeUiModelStateReducer } from "@app/analyze/_store/ui-model";
import { AnalyzeDataModelState, analyzeDataModelStateReducer } from "@app/analyze/_store/data-model";
import { ActionReducerMap, Action } from "@ngrx/store";
import { InjectionToken, Provider } from "@angular/core";

export const analyzeStateKey = 'analyze';

export interface AnalyzeAppState extends AppState {
    'analyze': AnalyzeState
};

export interface AnalyzeState {
    dataModelState: AnalyzeDataModelState,
    uiModelState: AnalyzeUIModelState
}

export function getAnalyzeReducers(): ActionReducerMap<AnalyzeState> {
    return {
        dataModelState: analyzeDataModelStateReducer,
        uiModelState: analyzeUiModelStateReducer,
    };
}

export const analyzeReducerToken = new InjectionToken<ActionReducerMap<AnalyzeAppState, Action>>('AnalyzeAppReducer');

export const analyzeReducerProvider: Provider[] = [
    { provide: analyzeReducerToken, useFactory: getAnalyzeReducers }
];