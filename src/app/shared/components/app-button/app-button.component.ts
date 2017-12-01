import { Input, Output, Component, EventEmitter, ViewEncapsulation, ChangeDetectionStrategy } from "@angular/core";

@Component({
    selector: 'app-button',
    templateUrl: './app-button.component.html',
    styleUrls: ['./app-button.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppButtonComponent {
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

    private onCloseBtnClicked(e: any) {
        this.close.emit(e);
    }
}