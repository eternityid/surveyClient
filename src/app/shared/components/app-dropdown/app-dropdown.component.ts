import { Input, Output, Component, EventEmitter, ViewEncapsulation, ChangeDetectionStrategy } from "@angular/core";

@Component({
    selector: 'app-dropdown',
    templateUrl: './app-dropdown.component.html',
    styleUrls: ['./app-dropdown.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppDropdownComponent {
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
    public type: string | undefined;
    @Input()
    public size: string | undefined;
    @Input()
    public closeable: boolean = false;

    @Output()
    public close: EventEmitter<any> = new EventEmitter<any>();

    public get toggleBtnClasses(): string[] {
        let result = [this.toggleDropdownTypeClass, this.toggleDropdownSizeClass];
        if (this.closeable) result.push('app-button-closeable__btn');
        return result;
    }

    public get toggleDropdownTypeClass(): string {
        return this.type ? `btn-${this.type}` : defaultToggleDropdownTypeClass;
    }
    public get toggleDropdownSizeClass(): string {
        return this.size ? `btn-${this.size}` : '';
    }

    private onCloseBtnClicked(e: any) {
        this.close.emit(e);
    }
}

const defaultToggleDropdownTypeClass = 'btn-primary';