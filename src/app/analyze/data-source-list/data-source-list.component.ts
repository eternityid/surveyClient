import { Component, ChangeDetectorRef, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ElementRef } from "@angular/core";
import { Store } from "@ngrx/store";
import { DataSourceListUi } from "@app/analyze/_shared/ui-models";
import { AnalyzeAppState } from "@app/analyze/_store";
import { ChangeSelectedItem_DataSourceList, LoadData_DataSourceList, Init_DataSourceList, Destroy_DataSourceList } from "@app/analyze/_store/ui-model/actions";
import { AnalyzeDataModelState } from "@app/analyze/_store/data-model";
import { MultiLanguageService } from "@app/core/services";
import { BaseSmartComponent } from "@app/core/abstract";
import { ObservableMedia } from "@angular/flex-layout";

@Component({
    selector: 'data-source-list',
    templateUrl: './data-source-list.component.html',
    styleUrls: ['./data-source-list.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DataSourceListComponent extends BaseSmartComponent<DataSourceListUi, AnalyzeDataModelState> implements OnInit {
    constructor(
        store: Store<AnalyzeAppState>,
        changeDetector: ChangeDetectorRef,
        multiLanguageService: MultiLanguageService,
        elementRef: ElementRef,
        media: ObservableMedia
    ) {
        super(
            store.select(state => state.analyze.dataModelState),
            store.select(state => state.analyze.uiModelState.dataSourceList),
            changeDetector,
            multiLanguageService,
            elementRef,
            media
        );
    }

    private _vm: DataSourceListUi;
    public get vm(): DataSourceListUi {
        return this._vm;
    }
    public set vm(value) {
        this._vm = value;
        this.detectChanges();
    }

    protected initAction: string = Init_DataSourceList.Type;
    protected destroyAction: string = Destroy_DataSourceList.Type;

    ngOnInit(): void {
        super.ngOnInit();
        this.loadDataSources();
    }

    public loadDataSources() {
        this.uiStore.dispatch(new LoadData_DataSourceList(this.currentModelState));
    }

    private onSelectedDataSourceChanged(e: any) {
        this.uiStore.dispatch(new ChangeSelectedItem_DataSourceList(this.vm.selectedDataSourceId));
    }

    private onRefresh(e: MouseEvent) {
        this.loadDataSources();
    }
}