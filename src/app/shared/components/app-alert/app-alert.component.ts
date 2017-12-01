import { Input, Output, Component, EventEmitter, ViewEncapsulation, ChangeDetectionStrategy } from "@angular/core";

@Component({
    selector: 'app-alert',
    templateUrl: './app-alert.component.html',
    styleUrls: ['./app-alert.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppAlertComponent {
    public static Types = {
        primary: "primary",
        secondary: "secondary",
        success: "success",
        danger: "danger",
        warning: "warning",
        info: "info"
    };

    @Input()
    public dismissible: boolean = false;
    @Input()
    public refreshable: boolean = false;
    @Input()
    public type: string | undefined;
    public isClosed: boolean = false;
    public get alertTypeClass() {
        if (this.type != undefined) {
            return `alert-${this.type}`;
        }
        return "";
    }

    @Output()
    public closed: EventEmitter<any> = new EventEmitter<any>();
    @Output()
    public onRefresh: EventEmitter<any> = new EventEmitter<any>();

    public get alertDismissibleClass() {
        return this.dismissible ? 'alert-dismissible' : '';
    }

    public closeAlert() {
        this.isClosed = true;
        this.closed.emit();
    }

    private onCloseBtnClicked(e: MouseEvent) {
        this.closeAlert();
    }

    private onRefreshBtnClicked(e: MouseEvent) {
        this.onRefresh.emit(e);
        this.closeAlert();
    }
}