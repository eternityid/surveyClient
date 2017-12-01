import { Action } from "@ngrx/store";
import { AggregationSettingTab } from "@app/analyze/_shared/ui-models";
import { AggregationFilter } from "@app/analyze/_shared/data-models";

export class InitTriggerButtons_AggregationSetting implements Action {
    public static Type = 'InitTriggerButtons_AggregationSetting [ui-model]';

    public type: string = InitTriggerButtons_AggregationSetting.Type;
}

export class DestroyTriggerButtons_AggregationSetting implements Action {
    public static Type = 'DestroyTriggerButtons_AggregationSetting [ui-model]';

    public type: string = DestroyTriggerButtons_AggregationSetting.Type;
}

export class InitPanel_AggregationSetting implements Action {
    public static Type = 'InitPanel_AggregationSetting [ui-model]';

    public type: string = InitPanel_AggregationSetting.Type;
}

export class DestroyPanel_AggregationSetting implements Action {
    public static Type = 'DestroyPanel_AggregationSetting [ui-model]';

    public type: string = DestroyPanel_AggregationSetting.Type;
}

export class OpenPanel_AggregationSetting implements Action {
    public static Type = 'OpenPanel_AggregationSetting [ui-model]';

    constructor(activateTab: AggregationSettingTab) {
        this.activateTab = activateTab;
    }

    public type: string = OpenPanel_AggregationSetting.Type;
    public activateTab: AggregationSettingTab;
}

export class OpenPanelTab_AggregationSetting implements Action {
    public static Type = 'OpenPanelTab_AggregationSetting [ui-model]';

    constructor(activateTab: AggregationSettingTab) {
        this.activateTab = activateTab;
    }

    public type: string = OpenPanelTab_AggregationSetting.Type;
    public activateTab: AggregationSettingTab;
}

export class ClosePanel_AggregationSetting implements Action {
    public static Type = 'ClosePanel_AggregationSetting [ui-model]';

    public type: string = ClosePanel_AggregationSetting.Type;
}

export class SetFilters_AggregationSetting implements Action {
    public static Type = 'SetFilters_AggregationSetting [ui-model]';

    constructor(items: AggregationFilter[]) {
        this.items = items;
    }

    public type: string = SetFilters_AggregationSetting.Type;
    public items: AggregationFilter[];
}

export class UpdateFilterItem_AggregationSetting implements Action {
    public static Type = 'UpdateFilterItem_AggregationSetting [ui-model]';

    constructor(updateValue: AggregationFilter) {
        this.updateValue = updateValue;
    }

    public type: string = UpdateFilterItem_AggregationSetting.Type;
    public updateValue: AggregationFilter;
}