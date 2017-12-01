import { ActionReducerMap, Action, combineReducers, ActionReducer } from "@ngrx/store";
import { InjectionToken, Provider } from "@angular/core";

export interface AppState {
};

export function getAppReducers(): ActionReducerMap<AppState> {
    return {
    };
}

export const appReducerToken = new InjectionToken<ActionReducerMap<AppState>>('AppReducer');

export const appReducerProvider: Provider[] = [
    { provide: appReducerToken, useFactory: getAppReducers }
];