import { NgModule, ModuleWithProviders } from "@angular/core";
import { AnalyzeComponent } from "./analyze.component";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "@app/shared";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { analyzeStateKey, analyzeReducerToken, analyzeReducerProvider } from "@app/analyze/_store";
import { DataSourceListEffectService, DataSourceFieldsEffectService, AggregationEffectService, AggregationSettingEffectService } from "@app/analyze/_store/ui-model/effects";
import { DataSourceDataService } from "@app/analyze/_shared/data-services";
import { ChartModule } from "angular2-highcharts";
import { DataSourcesModelEffectService } from "@app/analyze/_store/data-model/effects";
import { HighchartsStatic } from "angular2-highcharts/dist/HighchartsService";
import { AggregationChartComponent, AggregationFilterComponent } from "@app/analyze/_shared/components";
import { DataSourceListComponent } from "@app/analyze/data-source-list/data-source-list.component";
import { DataSourceFieldsComponent } from "@app/analyze/data-source-fields/data-source-fields.component";
import { DataSourceFieldItemComponent } from "@app/analyze/data-source-fields/data-source-field-item.component";
import { AggregationComponent } from "@app/analyze/aggregation/aggregation.component";
import { AggregationSettingTriggerComponent } from "@app/analyze/aggregation-setting/aggregation-setting-trigger.component";
import { AggregationSettingPanelComponent } from "@app/analyze/aggregation-setting/aggregation-setting-panel.component";
import { AggregationSettingUiService } from "@app/analyze/aggregation-setting/aggregation-setting.ui-service";

export declare var require: any;

const ANALYZE_ROUTES: Routes = [
    { path: '', component: AnalyzeComponent }
];

export function highchartsFactory() {
    const hc = require('highcharts/highcharts.src');
    return hc;
}

@NgModule({
    imports: [
        RouterModule.forChild(ANALYZE_ROUTES),
        SharedModule,
        StoreModule.forFeature(analyzeStateKey, analyzeReducerToken),
        EffectsModule.forFeature([
            DataSourcesModelEffectService,

            DataSourceListEffectService,
            DataSourceFieldsEffectService,
            AggregationEffectService,
            AggregationSettingEffectService
        ]),
        ChartModule
    ],
    exports: [],
    declarations: [
        AnalyzeComponent,
        DataSourceListComponent,
        DataSourceFieldsComponent,
        DataSourceFieldItemComponent,
        AggregationComponent,
        AggregationChartComponent,
        AggregationSettingTriggerComponent,
        AggregationSettingPanelComponent,
        AggregationFilterComponent
    ],
    providers: [
        analyzeReducerProvider,
        DataSourceDataService,
        {
            provide: HighchartsStatic,
            useFactory: highchartsFactory
        },
        AggregationSettingUiService
    ],
    bootstrap: []
})
export class AnalyzeModule {
}