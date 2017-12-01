import { Component, OnInit, Input, ViewEncapsulation, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy } from "@angular/core";


@Component({
    selector: 'app-link-button',
    templateUrl: './app-link-button.component.html',
    styleUrls: ['./app-link-button.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppLinkButtonComponent implements OnInit {

    constructor(elementRef: ElementRef, changeDetector: ChangeDetectorRef) {
        this.elementRef = elementRef;
        this.changeDetector = changeDetector;
    }

    private _titleTranslateKey: string | undefined;
    public get titleTranslateKey(): string | undefined {
        return this._titleTranslateKey;
    }
    @Input()
    public set titleTranslateKey(value) {
        this._titleTranslateKey = value;
        if (this.initiated) {
            this.vm.titleTranslateKey = value;
        }
    }

    private _iconClass: string;
    public get iconClass(): string {
        return this._iconClass;
    }
    @Input()
    public set iconClass(value) {
        this._iconClass = value;
        if (this.initiated) {
            this.vm.iconClass = value;
        }
    }

    private _highlighted: boolean;
    public get highlighted(): boolean {
        return this._highlighted;
    }
    @Input()
    public set highlighted(value) {
        this._highlighted = value;
        if (this.initiated) {
            this.vm.highlighted = value;
        }
    }

    private _onHoverHighlight: boolean;
    public get onHoverHighlight(): boolean {
        return this._onHoverHighlight;
    }
    @Input()
    public set onHoverHighlight(value) {
        this._onHoverHighlight = value;
        if (this.initiated) {
            if (value) {
                this.registerOnHoverHighlight();
            } else {
                this.unregisterOnHoverHighlight();
            }
        }
    }

    public vm: AppLinkButtonUi;

    private initiated: boolean;
    private elementRef: ElementRef;
    private changeDetector: ChangeDetectorRef;
    private get element(): HTMLElement {
        return this.elementRef.nativeElement;
    }
    private onMouseEnter: ($event: any) => void;
    private onMouseLeave: ($event: any) => void;

    ngOnInit(): void {
        this.vm = new AppLinkButtonUi(this.titleTranslateKey, this.iconClass, this.highlighted);
        if (this.onHoverHighlight) this.registerOnHoverHighlight();
        this.initiated = true;
    }

    private registerOnHoverHighlight() {
        this.onMouseEnter = ($event: any) => {
            this.highlighted = true;
            this.changeDetector.detectChanges();
        };
        this.onMouseLeave = ($event: any) => {
            this.highlighted = false;
            this.changeDetector.detectChanges();
        };
        this.element.addEventListener('mouseenter', this.onMouseEnter);
        this.element.addEventListener('mouseleave', this.onMouseLeave);
    }

    private unregisterOnHoverHighlight() {
        if (this.onMouseEnter)
            this.element.removeEventListener('mouseenter', this.onMouseEnter);
        if (this.onMouseLeave)
            this.element.removeEventListener('mouseleave', this.onMouseLeave)
    }
}

export class AppLinkButtonUi {
    constructor(titleTranslateKey: string | undefined, iconClass: string, highlighted?: boolean) {
        this.titleTranslateKey = titleTranslateKey;
        this.iconClass = iconClass;
        this.highlighted = highlighted ? highlighted : false;
    }

    public iconClass: string;
    public titleTranslateKey: string | undefined;
    public highlighted: boolean;

    public getCurrentIconClassName() {
        return this.highlighted ? this.iconClass + '--highlight' : this.iconClass;
    }
}