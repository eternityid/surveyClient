import { Injectable } from "@angular/core";
import { Actions, Effect } from "@ngrx/effects";
import { Store, Action } from "@ngrx/store";
import { AnalyzeAppState } from "@app/analyze/_store";
import { ChangeSelectedItem_DataSourceList, LoadData_DataSourceFields, LoadDataSuccess_DataSourceFields, LoadDataFail_DataSourceFields, RemoveDimension_Aggregation, RemoveMeasure_Aggregation, SetSelectedItems_DataSourceFields, AddDimension_Aggregation, AddMeasure_Aggregation, SelectMeasure_DataSourceFields, UpdateQueryData_Aggregation, AddFilter_Aggregation, RemoveFilter_Aggregation } from "@app/analyze/_store/ui-model/actions";
import { ObjectUtil, ArrayUtil } from "@app/core/utils";
import { Observable, Subscription } from 'rxjs/Rx';
import { LoadFields_DataSources, LoadFieldsSuccess_DataSources, LoadFieldsFail_DataSources } from "@app/analyze/_store/data-model/actions";
import { FieldItemType } from "@app/analyze/_shared/ui-models";

@Injectable()
export class DataSourceFieldsEffectService {
    constructor(private actions$: Actions, private store: Store<AnalyzeAppState>) { }

    @Effect()
    onDataSourceListSelectedItemChange$: Observable<Action> = this.actions$
        .ofType<ChangeSelectedItem_DataSourceList>(ChangeSelectedItem_DataSourceList.Type)
        .filter(action => action.selectedId != undefined)
        .withLatestFrom(this.store.select(state => state.analyze.dataModelState))
        .map(data => {
            let action = data[0];
            let currentModelState = data[1];
            return new LoadData_DataSourceFields(<string>action.selectedId, currentModelState);
        });

    @Effect()
    onLoadData$: Observable<Action> = this.actions$
        .ofType<LoadData_DataSourceFields>(LoadData_DataSourceFields.Type)
        .map(action => new LoadFields_DataSources(LoadData_DataSourceFields.Type, action.dataSourceId));

    @Effect()
    onLoadFieldsSuccess$: Observable<Action> = this.actions$
        .ofType<LoadFieldsSuccess_DataSources>(LoadFieldsSuccess_DataSources.Type)
        .filter(action => action.caller == LoadData_DataSourceFields.Type)
        .map(action => new LoadDataSuccess_DataSourceFields());

    @Effect()
    onLoadFieldsFail$: Observable<Action> = this.actions$
        .ofType<LoadFieldsFail_DataSources>(LoadFieldsFail_DataSources.Type)
        .filter(action => action.caller == LoadData_DataSourceFields.Type)
        .map(action => {
            return new LoadDataFail_DataSourceFields(action.errors);
        });

    @Effect()
    aggregationQueryDataChanged$: Observable<Action> = this.actions$
        .ofType<Action>(
        RemoveDimension_Aggregation.Type,
        RemoveMeasure_Aggregation.Type,
        AddDimension_Aggregation.Type,
        AddMeasure_Aggregation.Type,
        UpdateQueryData_Aggregation.Type,
        AddFilter_Aggregation.Type,
        RemoveFilter_Aggregation.Type
        )
        .withLatestFrom(this.store.select(state => state.analyze.uiModelState.aggregation))
        .map(data => {
            let aggregationUi = data[1];
            return new SetSelectedItems_DataSourceFields(aggregationUi.getAllFieldNamesInQueryData());
        });
}