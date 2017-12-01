import { Directive, ElementRef, Input } from "@angular/core";
import { HtmlUtil } from "@app/core/utils";

@Directive({
    selector: '[appButton]'
})
export class AppButtonDirective {
    public static Types = {
        primary: "primary",
        secondary: "secondary",
        success: "success",
        danger: "danger",
        warning: "warning",
        info: "info",
        outlinePrimary: "outline-primary",
        outlineSecondary: "outline-secondary",
        outlineSuccess: "outline-success",
        outlineDanger: "outline-danger",
        outlineWarning: "outline-warning",
        outlineInfo: "outline-info"
    };

    @Input()
    set btnType(value) {
        let oldBtnTypeClass = getbtnTypeClass(this.btnType);
        let newBtnTypeClass = getbtnTypeClass(value);
        HtmlUtil.replaceClass(this.element, oldBtnTypeClass, newBtnTypeClass);

        this._btnType = value;
    }
    get btnType(): string | undefined {
        return this._btnType;
    }
    private _btnType: string | undefined;

    private _btnSize: string;
    public get btnSize(): string {
        return this._btnSize;
    }
    @Input()
    public set btnSize(value) {
        let oldBtnSizeClass = getbtnTypeClass(this.btnSize);
        let newBtnSizeClass = getbtnTypeClass(value);
        HtmlUtil.replaceClass(this.element, oldBtnSizeClass, newBtnSizeClass);

        this._btnSize = value;
    }

    public get element(): HTMLElement {
        return this.elementRef.nativeElement;
    }

    private elementRef: ElementRef;

    constructor(elementRef: ElementRef) {
        this.elementRef = elementRef;
        this.element.classList.add('btn');
        this.element.style.cursor = 'default';
    }
}

function getbtnTypeClass(type: string | undefined): string {
    if (type) {
        return `btn-${type}`;
    }
    return "";
}

function getbtnSizeClass(size: string | undefined): string {
    if (size) {
        return `btn-${size}`;
    }
    return "";
}