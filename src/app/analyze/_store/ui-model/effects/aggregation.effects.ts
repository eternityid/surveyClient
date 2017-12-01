import { Injectable } from "@angular/core";
import { Observable, Subscription } from 'rxjs/Rx';
import { Actions, Effect } from "@ngrx/effects";
import { Store, Action } from "@ngrx/store";
import { AnalyzeAppState } from "@app/analyze/_store";
import { SetDataSource_Aggregation, LoadAggregationData_Aggregation, LoadAggregationDataSuccess_Aggregation, LoadAggregationDataFail_Aggregation, UpdateMeasureOperator_Aggregation, RemoveDimension_Aggregation, RemoveMeasure_Aggregation, AddDimension_Aggregation, AddMeasure_Aggregation, SelectDimension_DataSourceFields, SelectMeasure_DataSourceFields, UpdateQueryData_Aggregation, UpdateDateDimensionInterval_Aggregation, ChangeSelectedItem_DataSourceList, AddFilter_Aggregation, RemoveFilter_Aggregation, UpdateFilterItem_AggregationSetting } from "@app/analyze/_store/ui-model/actions";
import { DataSourceDataService } from "@app/analyze/_shared/data-services";
import { DataSource } from "@app/analyze/_shared/data-models";
import { Updated_DataSources } from "@app/analyze/_store/data-model/actions";
import { ObjectUtil } from "@app/core/utils";


@Injectable()
export class AggregationEffectService {
    constructor(private actions$: Actions, private store: Store<AnalyzeAppState>, private dataSourceDataService: DataSourceDataService) {
    }

    @Effect()
    onDataSourceSelectedChange: Observable<Action> = this.actions$
        .ofType<ChangeSelectedItem_DataSourceList>(ChangeSelectedItem_DataSourceList.Type)
        .withLatestFrom(this.store.select(state => state.analyze.dataModelState.dataSources.data))
        .map(data => {
            let action = data[0];
            let dataSourcesData = data[1];
            return new SetDataSource_Aggregation(action.selectedId ? dataSourcesData[action.selectedId] : undefined);
        });

    @Effect()
    onQueryDataChanged$: Observable<Action> = this.actions$
        .ofType<Action>(
        UpdateMeasureOperator_Aggregation.Type,
        UpdateDateDimensionInterval_Aggregation.Type,
        RemoveDimension_Aggregation.Type,
        RemoveMeasure_Aggregation.Type,
        AddDimension_Aggregation.Type,
        AddMeasure_Aggregation.Type,
        UpdateQueryData_Aggregation.Type,
        Updated_DataSources.Type,
        SetDataSource_Aggregation.Type,
        AddFilter_Aggregation.Type,
        RemoveFilter_Aggregation.Type,
        UpdateFilterItem_AggregationSetting.Type
        )
        .withLatestFrom(this.store.select(state => state.analyze.uiModelState.aggregation))
        .filter(data => {
            let aggregationUi = data[1];
            return aggregationUi.isAggregationQueryDataValid() && aggregationUi.isQueryDataDiffFromAggregationQueryData();
        })
        .map(data => {
            let aggregationUi = data[1];
            let dataSourceId = (<DataSource>aggregationUi.dataSource).id;
            return new LoadAggregationData_Aggregation(dataSourceId, aggregationUi.dimensions, aggregationUi.measures, aggregationUi.filters);
        });

    @Effect()
    loadAggregationData$: Observable<Action> = this.actions$
        .ofType<LoadAggregationData_Aggregation>(LoadAggregationData_Aggregation.Type)
        .switchMap(action => {
            return this.dataSourceDataService
                .getAggregationData(action.dataSourceId, action.dimensions, action.measures, action.filters)
                .map(data => {
                    return new LoadAggregationDataSuccess_Aggregation(data);
                })
                .catch(err => {
                    return Observable.of(new LoadAggregationDataFail_Aggregation(err));
                });
        });

    @Effect()
    selectDimension$: Observable<Action> = this.actions$
        .ofType<SelectDimension_DataSourceFields>(SelectDimension_DataSourceFields.Type)
        .map(action => {
            return new AddDimension_Aggregation(action.field);
        });

    @Effect()
    selectMeasure$: Observable<Action> = this.actions$
        .ofType<SelectMeasure_DataSourceFields>(SelectMeasure_DataSourceFields.Type)
        .map(action => {
            return new AddMeasure_Aggregation(action.field);
        });
}
