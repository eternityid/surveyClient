import { Component, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef, ElementRef } from "@angular/core";
import { BaseSmartComponent } from "@app/core/abstract";
import { AggregationSettingUi, AggregationSettingTab } from "@app/analyze/_shared/ui-models";
import { AnalyzeDataModelState } from "@app/analyze/_store/data-model";
import { OpenPanel_AggregationSetting, InitTriggerButtons_AggregationSetting, DestroyTriggerButtons_AggregationSetting } from "@app/analyze/_store/ui-model/actions";
import { Store } from "@ngrx/store";
import { AnalyzeAppState } from "@app/analyze/_store";
import { MultiLanguageService } from "@app/core/services";
import { AggregationSettingUiService } from "@app/analyze/aggregation-setting/aggregation-setting.ui-service";
import { ObservableMedia } from "@angular/flex-layout";


@Component({
    selector: 'aggregation-setting-trigger',
    templateUrl: './aggregation-setting-trigger.component.html',
    styleUrls: ['./aggregation-setting-trigger.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AggregationSettingTriggerComponent extends BaseSmartComponent<AggregationSettingUi, AnalyzeDataModelState> {

    constructor(
        store: Store<AnalyzeAppState>,
        changeDetector: ChangeDetectorRef,
        multiLanguageService: MultiLanguageService,
        elementRef: ElementRef,
        uiService: AggregationSettingUiService,
        media: ObservableMedia
    ) {
        super(
            store.select(state => state.analyze.dataModelState),
            store.select(state => state.analyze.uiModelState.aggregationSetting),
            changeDetector,
            multiLanguageService,
            elementRef,
            media
        );
        this.uiService = uiService;
    }

    protected initAction: string = InitTriggerButtons_AggregationSetting.Type;
    protected destroyAction: string = DestroyTriggerButtons_AggregationSetting.Type;
    private _vm: AggregationSettingUi;
    public get vm(): AggregationSettingUi {
        return this._vm;
    }
    public set vm(value) {
        this._vm = value;
        this.detectChanges();
    }

    private uiService: AggregationSettingUiService;

    public openAggregationSettingPanelFiltersTab() {
        this.uiService.openAggregationSettingPanelFiltersTab();
    }

    public openAggregationSettingPanelChartsTab() {
        this.uiService.openAggregationSettingPanelChartsTab();
    }
}