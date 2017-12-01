import { Actions, Effect } from "@ngrx/effects";
import { Store, Action } from "@ngrx/store";
import { AnalyzeAppState } from "@app/analyze/_store";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";
import { AddFilter_Aggregation, OpenPanel_AggregationSetting, RemoveFilter_Aggregation, SetFilters_AggregationSetting } from "@app/analyze/_store/ui-model/actions";
import { AggregationSettingTab } from "@app/analyze/_shared/ui-models";
import { ObjectUtil } from "@app/core/utils";

@Injectable()
export class AggregationSettingEffectService {
    constructor(private actions$: Actions, private store: Store<AnalyzeAppState>) {
    }

    @Effect()
    onAddFilterFirstTimeInAggregation: Observable<Action> = this.actions$
        .ofType<AddFilter_Aggregation>(AddFilter_Aggregation.Type)
        .withLatestFrom(this.store.select(state => state.analyze.uiModelState.aggregation.filters))
        .filter(data => {
            let filters = data[1];
            return filters.length == 1;
        })
        .map(data => {
            return new OpenPanel_AggregationSetting(AggregationSettingTab.filters);
        });

    @Effect()
    onAddRemoveFilterInAggregation: Observable<Action> = this.actions$
        .ofType<Action>(
        AddFilter_Aggregation.Type,
        RemoveFilter_Aggregation.Type
        )
        .withLatestFrom(this.store.select(x => x.analyze.uiModelState.aggregation))
        .map(data => {
            return new SetFilters_AggregationSetting(ObjectUtil.cloneDeep(data[1].filters));
        })
}