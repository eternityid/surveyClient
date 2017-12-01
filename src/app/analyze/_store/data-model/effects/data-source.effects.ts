import { Injectable } from "@angular/core";
import { Actions, Effect } from "@ngrx/effects";
import { Store, Action } from "@ngrx/store";
import { Observable, Subscription } from 'rxjs/Rx';
import { DataSourceDataService } from "@app/analyze/_shared/data-services";
import { AnalyzeAppState } from "@app/analyze/_store";
import { DataSource } from "@app/analyze/_shared/data-models";
import { ArrayUtil, ObjectUtil } from "@app/core/utils";
import { Load_DataSources, LoadSuccess_DataSources, LoadFail_DataSources, Updated_DataSources, LoadFields_DataSources, LoadFieldsSuccess_DataSources, LoadFieldsFail_DataSources, Update_DataSources } from "@app/analyze/_store/data-model/actions";
import { BaseDataModelAction, updateDataModelCollection } from "@app/core/abstract";
import { loadDataSourceFieldsSuccessReducer } from "@app/analyze/_store/data-model/reducers";

@Injectable()
export class DataSourcesModelEffectService {
    constructor(private actions$: Actions, private store: Store<AnalyzeAppState>, private dataSourceDataService: DataSourceDataService) {
    }

    @Effect()
    loadDataSources$ = this.actions$
        .ofType<Load_DataSources>(Load_DataSources.Type)
        .switchMap(action => {
            return this.dataSourceDataService.getAll()
                .map(data => {
                    return new LoadSuccess_DataSources(action.caller, data);
                })
                .catch(err => {
                    return Observable.of(new LoadFail_DataSources(action.caller, err));
                });
        });

    @Effect({ dispatch: false })
    loadDataSourcesSuccess$ = this.actions$
        .ofType<LoadSuccess_DataSources>(LoadSuccess_DataSources.Type)
        .withLatestFrom(this.store.select(state => state.analyze.dataModelState.dataSources))
        .map(data => {
            let action = data[0];
            let currentDataSourcesState = data[1];
            let newDataSourcesState = updateDataModelCollection(currentDataSourcesState, (<LoadSuccess_DataSources>action).payload, true);
            if (currentDataSourcesState != newDataSourcesState) {
                this.store.dispatch(new Update_DataSources(LoadSuccess_DataSources.Type, newDataSourcesState));
            }
        });

    @Effect()
    loadDataSourceFields$ = this.actions$
        .ofType<LoadFields_DataSources>(LoadFields_DataSources.Type)
        .switchMap(action => {
            return this.dataSourceDataService.getFields(action.dataSourceId)
                .map(data => {
                    return new LoadFieldsSuccess_DataSources(action.caller, action.dataSourceId, data);
                })
                .catch(err => {
                    return Observable.of(new LoadFieldsFail_DataSources(action.caller, action.dataSourceId, err));
                });
        });
        
    @Effect({ dispatch: false })
    loadDataSourceFieldsSuccess$ = this.actions$
        .ofType<LoadFieldsSuccess_DataSources>(LoadFieldsSuccess_DataSources.Type)
        .withLatestFrom(this.store.select(state => state.analyze.dataModelState.dataSources))
        .map(data => {
            let action = data[0];
            let currentDataSourcesState = data[1];
            let newDataSourcesState = loadDataSourceFieldsSuccessReducer(currentDataSourcesState, <LoadFieldsSuccess_DataSources>action);
            if (currentDataSourcesState != newDataSourcesState) {
                this.store.dispatch(new Update_DataSources(LoadSuccess_DataSources.Type, newDataSourcesState));
            }
        });

    @Effect()
    collectionChanged$ = this.actions$
        .ofType<Update_DataSources>(Update_DataSources.Type)
        .withLatestFrom(this.store.select(state => state.analyze.dataModelState))
        .map(data => {
            let action = data[0];
            let modelState = data[1];
            return new Updated_DataSources(action.caller, modelState);
        });
}
