
import { ObjectUtil } from "@app/core/utils";
import { DataSource } from "@app/analyze/_shared/data-models";
import { AnalyzeDataModelState } from "@app/analyze/_store/data-model";
import { BaseUiModel } from "@app/core/abstract";


export class DataSourceListUi extends BaseUiModel {
    constructor() {
        super();
    }

    public dataSources: DataSourceListUiItem[] | undefined;
    public selectedDataSourceId: string | undefined;
    public get errorMsg() {
        return this.errorsByLinesAsHtml();
    }

    public updateDataModel(modelState: AnalyzeDataModelState): void {
        if (modelState.dataSources.initiated) {
            let newData = ObjectUtil.values(modelState.dataSources.data).map(x => new DataSourceListUiItem(x));
            if (ObjectUtil.isDifferent(this.dataSources, newData)) this.dataSources = newData;
        }
    }

    public onLoadData(currentModelState: AnalyzeDataModelState) {
        this.error = undefined;
        this.loading = true;
        this.updateDataModel(currentModelState);
    }

    public onLoadDataSuccess() {
        this.loading = false;
    }

    public onLoadDataFail(error: string[]) {
        this.error = error;
        this.loading = false;
    }

    public changeSelectedDataSourceId(selectedDataSourceId: string | undefined) {
        this.selectedDataSourceId = selectedDataSourceId;
    }
}

export class DataSourceListUiItem {
    constructor(data: DataSource) {
        this.title = data.title;
        this.id = data.id;
    }
    public title: string;
    public id: string;
}