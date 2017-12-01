import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { AnalyzeAppState } from "@app/analyze/_store";
import { AggregationSettingUi, AggregationSettingTab } from "@app/analyze/_shared/ui-models";
import { OpenPanel_AggregationSetting, ClosePanel_AggregationSetting, OpenPanelTab_AggregationSetting } from "@app/analyze/_store/ui-model/actions";
import { Actions } from "@ngrx/effects";
import { Observable, Subscription, Subject } from 'rxjs/Rx';

@Injectable()
export class AggregationSettingUiService {
    constructor(store: Store<AnalyzeAppState>, private actions$: Actions) {
        this.store = store.select(state => state.analyze.uiModelState.aggregationSetting);
        this.store.subscribe(x => {
            this.currentUiState = x;
        })
    }

    public get currentUiState(): AggregationSettingUi {
        return this._currentUiState;
    }
    public set currentUiState(value) {
        if (this._currentUiState != undefined && value != undefined) {
            if (this.currentUiState.aggregationSettingPanelClosed != value.aggregationSettingPanelClosed) {
                this.panelDisplayChangedSource.next();
            }
        }
        this._currentUiState = value;
    }
    private panelDisplayChangedSource: Subject<any> = new Subject<string>();
    public panelDisplayChanged$: Observable<any> = this.panelDisplayChangedSource.asObservable();

    private store: Store<AggregationSettingUi>;
    private _currentUiState: AggregationSettingUi;

    public openAggregationSettingPanelFiltersTab() {
        this.store.dispatch(new OpenPanel_AggregationSetting(AggregationSettingTab.filters));
    }

    public openAggregationSettingPanelChartsTab() {
        this.store.dispatch(new OpenPanel_AggregationSetting(AggregationSettingTab.charts));
    }

    public closeAggregationSettingPanel() {
        this.store.dispatch(new ClosePanel_AggregationSetting());
    }
}