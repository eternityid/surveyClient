import { BaseUiModel } from "@app/core/abstract";
import { AnalyzeDataModelState } from "@app/analyze/_store/data-model";
import { AggregationFilter, Field, DataSource } from "@app/analyze/_shared/data-models";
import { ObjectUtil, ArrayUtil } from "@app/core/utils";

export class AggregationSettingUi extends BaseUiModel {

    constructor() {
        super();
        this.aggregationSettingPanelClosed = true;
    }

    public aggregationSettingPanelClosed: boolean = true;
    public activatedTab: AggregationSettingTab | undefined;
    public filters: AggregationSettingUiFilter[] = [];

    private _dataSourceId: string | undefined;
    public get dataSourceId(): string | undefined {
        return this._dataSourceId;
    }
    public set dataSourceId(value) {
        this._dataSourceId = value;
        if (this.currentDataSource && this.currentDataSource.id != this.dataSourceId) {
            this.currentDataSource = undefined;
        }
    }

    private _currentDataSource: DataSource | undefined;
    public get currentDataSource(): DataSource | undefined {
        return this._currentDataSource;
    }
    public set currentDataSource(value) {
        if (ObjectUtil.isDifferent(this._currentDataSource, value)) {
            this._currentDataSource = value;
            this.refreshFilters();
        }
    }

    public updateDataModel(modelState: AnalyzeDataModelState): void {
        if (!modelState.dataSources.initiated || this.dataSourceId == undefined) return;

        let currentDataSource = modelState.dataSources.data[this.dataSourceId];
        if (currentDataSource == undefined) {
            this.currentDataSource = undefined;
        } else if (ObjectUtil.isDifferent(this.currentDataSource, currentDataSource)) {
            this.currentDataSource = currentDataSource;
        }
    }

    public openAggregationSettingPanel(activateTab: AggregationSettingTab) {
        this.aggregationSettingPanelClosed = false;
        this.openAggregationSettingPanelTab(activateTab);
    }

    public openAggregationSettingPanelTab(activateTab: AggregationSettingTab) {
        this.activatedTab = activateTab;
    }

    public closeAggregationSettingPanel() {
        this.aggregationSettingPanelClosed = true;
        this.activatedTab = undefined;
    }

    public setFilters(items: AggregationFilter[]) {
        if (this.currentDataSource == undefined || this.currentDataSource.fields == undefined) return;

        let newFilters: AggregationSettingUiFilter[] = [];
        for (let i = 0; i < items.length; i++) {
            const aggregationFilterItem = items[i];
            let existedFilterItem = ArrayUtil.find(this.filters, x => x.field.name == aggregationFilterItem.fieldName);
            if (existedFilterItem != undefined) {
                let newItem = ObjectUtil.clone(existedFilterItem);
                newItem.aggregationFilter = aggregationFilterItem;
                newFilters.push(newItem);
            } else {
                let filterField = ArrayUtil.find(this.currentDataSource.fields, x => x.name == aggregationFilterItem.fieldName);
                if (filterField == undefined) continue;
                let newItem = new AggregationSettingUiFilter(filterField, aggregationFilterItem);
                newFilters.push(newItem);
            }
        }

        this.filters = newFilters;
    }

    public refreshFilters() {
        if (this.currentDataSource == undefined || this.currentDataSource.fields == undefined) {
            this.filters = [];
        } else {
            let availablefieldNames = this.currentDataSource.fields.map(x => x.name);
            this.filters = this.filters.filter(x => availablefieldNames.includes(x.field.name));
        }
    }

    public updateFilterItem(updateValue: AggregationFilter) {
        let newFilters = ObjectUtil.clone(this.filters);
        for (let i = 0; i < this.filters.length; i++) {
            let item = this.filters[i];
            if (item.field.name == updateValue.fieldName) {
                newFilters[i] = ObjectUtil.clone(item);
                newFilters[i].aggregationFilter = updateValue;
                this.filters = newFilters;
                return;
            }
        }
    }

    private getPanelTabItemClass(tab: AggregationSettingTab) {
        return tab == this.activatedTab ? 'aggregation-setting-panel__tabs-item--activated' : 'aggregation-setting-panel__tabs-item';
    }
}

export enum AggregationSettingTab {
    filters = "filters",
    charts = "charts"
}

export const AggregationSettingTabs = {
    filters: AggregationSettingTab.filters,
    charts: AggregationSettingTab.charts,
}

export class AggregationSettingUiFilter {

    constructor(field: Field, aggregationFilter: AggregationFilter) {
        this.field = field;
        this.aggregationFilter = aggregationFilter;
    }

    public aggregationFilter: AggregationFilter;
    public field: Field;
}