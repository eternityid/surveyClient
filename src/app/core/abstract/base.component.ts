import { LanguageUtil, ObjectUtil } from "@app/core/utils";
import { ChangeDetectorRef, AfterViewInit, ElementRef, OnInit, OnDestroy, Component } from "@angular/core";
import { MultiLanguageService } from "@app/core/services";
import { appConfig } from "@app/app.config";
import { Store } from "@ngrx/store";
import { Observable, Subscription } from 'rxjs/Rx';
import { AppState } from "@app/store";
import { BaseUiModel } from "./base.ui-model";
import { DataModelState } from "./base.states";
import { ObservableMedia, MediaChange } from "@angular/flex-layout";

export abstract class BaseComponent implements AfterViewInit, OnDestroy, OnInit {
    constructor(
        changeDetector: ChangeDetectorRef,
        multiLanguageService: MultiLanguageService,
        elementRef: ElementRef,
        media: ObservableMedia
    ) {
        this.changeDetector = changeDetector;
        this.multiLanguageService = multiLanguageService;
        this.browserLang = LanguageUtil.getBrowserLang();
        this.defaultLang = appConfig.defaultLang;
        this.elementRef = elementRef;
        this.media = media;
    }

    protected multiLanguageService: MultiLanguageService;
    protected browserLang: string;
    protected defaultLang: string;
    protected viewInitiated: boolean = false;
    protected destroyed: boolean = false;
    protected elementRef: ElementRef;
    protected get element(): HTMLElement {
        return this.elementRef.nativeElement;
    }
    protected media: ObservableMedia;

    private changeDetector: ChangeDetectorRef;

    ngAfterViewInit(): void {
        this.viewInitiated = true;
    }

    ngOnDestroy(): void {
        this.destroyed = true;
    }

    ngOnInit(): void {

    }

    public getBrowserLangText(value: Dictionary<string>) {
        return this.multiLanguageService.getBrowserLangText(value);
    }

    protected detectChanges() {
        if (this.viewInitiated && !this.destroyed) this.changeDetector.detectChanges();
    }
}

export abstract class BaseSmartComponent<TUi extends BaseUiModel, TModelState extends DataModelState> extends BaseComponent implements OnInit, OnDestroy {

    constructor(
        modelStore: Store<TModelState>,
        uiStore: Store<TUi>,
        changeDetector: ChangeDetectorRef,
        multiLanguageService: MultiLanguageService,
        elementRef: ElementRef,
        media: ObservableMedia
    ) {
        super(changeDetector, multiLanguageService, elementRef, media);
        this.uiStore = uiStore;
        this.modelStore = modelStore;

        this.subscribeVm();
        this.subscribeDataModel();
        this.currentMediaWatcher = this.media.subscribe(change => {
            this.currentMedia = change.mqAlias;
        })
    }

    ngOnInit(): void {
        super.ngOnInit();
        if (this.initAction)
            this.uiStore.dispatch({ type: this.initAction });
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        this.unsubscribeVm();
        this.unsubscribeDataModel();
        if (this.destroyAction)
            this.uiStore.dispatch({ type: this.destroyAction });
        this.currentMediaWatcher.unsubscribe();
    }

    private vm$: Subscription | undefined;
    private model$: Subscription | undefined;
    private modelStore: Store<TModelState>;
    private currentMediaWatcher: Subscription;

    protected abstract initAction: string;
    protected abstract destroyAction: string;
    protected uiStore: Store<TUi>;
    protected currentMedia: string;

    public abstract vm: TUi;
    public vmOnStore: TUi;
    public currentModelState: TModelState;

    public subscribeVm() {
        this.unsubscribeVm();

        this.vm$ = this.uiStore
            .subscribe(vmState => {
                this.vmOnStore = vmState;
                this.setVm(vmState);
            });
    }

    public unsubscribeVm() {
        if (this.vm$) {
            this.vm$.unsubscribe();
            this.vm$ = undefined;
        }
    }

    public subscribeDataModel() {
        this.unsubscribeDataModel();

        this.model$ = this.modelStore
            .subscribe(modelState => {
                this.currentModelState = modelState;
            });
    }

    public unsubscribeDataModel() {
        if (this.model$) {
            this.model$.unsubscribe();
            this.model$ = undefined;
        }
    }

    public revertToVmOnStore() {
        this.setVm(this.vmOnStore);
    }

    protected setVm(newVm: TUi) {
        if (newVm && newVm.destroyed) return;
        if (this.vm == undefined) {
            this.vm = ObjectUtil.cloneDeep(newVm);
        } else if (ObjectUtil.isDifferent(this.vm, newVm)) {
            ObjectUtil.setDeep(this.vm, newVm, true);
            this.vm = ObjectUtil.clone(this.vm);
        }
    }

    protected detectChanges() {
        if (!this.vm.destroyed && this.viewInitiated && !this.destroyed) super.detectChanges();
    }
}