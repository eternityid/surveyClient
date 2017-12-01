import { Injectable } from "@angular/core";
import { Actions, Effect } from "@ngrx/effects";
import { Store, Action } from "@ngrx/store";
import { LoadDataFail_DataSourceList, LoadData_DataSourceList, LoadDataSuccess_DataSourceList } from "@app/analyze/_store/ui-model/actions";
import { AnalyzeAppState } from "@app/analyze/_store";
import { ObjectUtil } from "@app/core/utils";
import { Observable, Subscription } from 'rxjs/Rx';
import { Load_DataSources, LoadSuccess_DataSources, LoadFail_DataSources } from "@app/analyze/_store/data-model/actions";


@Injectable()
export class DataSourceListEffectService {
    constructor(private actions$: Actions, private store: Store<AnalyzeAppState>) {
    }

    @Effect()
    onloadData$: Observable<Action> = this.actions$
        .ofType<LoadData_DataSourceList>(LoadData_DataSourceList.Type)
        .map(action => new Load_DataSources(LoadData_DataSourceList.Type));

    @Effect()
    onLoadDataSuccess$: Observable<Action> = this.actions$
        .ofType<LoadSuccess_DataSources>(LoadSuccess_DataSources.Type)
        .filter(action => action.caller == LoadData_DataSourceList.Type)
        .map(action => new LoadDataSuccess_DataSourceList());

    @Effect()
    onLoadDataFail$: Observable<Action> = this.actions$
        .ofType<LoadFail_DataSources>(LoadFail_DataSources.Type)
        .filter(action => action.caller == LoadData_DataSourceList.Type)
        .map(action => {
            return new LoadDataFail_DataSourceList(action.errors);
        });
}
