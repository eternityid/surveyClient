import { Input, Output, Component, EventEmitter, ViewEncapsulation, OnInit, ChangeDetectionStrategy, AfterViewInit, ChangeDetectorRef } from "@angular/core";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { Subject } from "rxjs/Rx";
import { StringUtil } from "@app/core/utils";

@Component({
    selector: 'app-datepicker',
    templateUrl: './app-datepicker.component.html',
    styleUrls: ['./app-datepicker.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppDatepickerComponent implements OnInit, AfterViewInit {
    constructor(changeDetector: ChangeDetectorRef) {
        this.changeDetector = changeDetector;
    }

    private _value: Date | null;
    public get value(): Date | null {
        return this._value;
    }
    @Input()
    public set value(value) {
        this._value = value;
        this._ngbDateValue = this.toNgbDateStruct(this.value);
    }
    @Output()
    public valueChange: EventEmitter<Date | null> = new EventEmitter<Date | null>();

    private _ngbDateValue: NgbDateStruct | null;
    public get ngbDateValue(): NgbDateStruct | null {
        return this._ngbDateValue;
    }
    public set ngbDateValue(value) {
        this._ngbDateValue = value;
    }

    private changeDetector: ChangeDetectorRef;
    private viewInitiated: boolean;

    ngOnInit(): void {
        this.ngbDateValue = this.toNgbDateStruct(this.value);
    }

    ngAfterViewInit(): void {
        this.viewInitiated = true;
    }

    private toNgbDateStruct(value: Date | null): NgbDateStruct | null {
        if (value == undefined) return null;
        return {
            day: value.getDate(),
            month: value.getMonth(),
            year: value.getFullYear()
        };
    }

    private toDate(value: NgbDateStruct | null): Date | null {
        if (value == null) return null;
        return new Date(value.year, value.month, value.day);
    }

    private onNgbDateValueChanged(value: any) {
        if (!this.isNgbDateStruct(value)) return;

        this.value = this.toDate(value);
        this.valueChange.emit(this.toDate(value));
        this.changeDetector.detectChanges();
    }

    private isNgbDateStruct(value: any) {
        return value == null || (StringUtil.isInt(value.year) && StringUtil.isInt(value.month) && StringUtil.isInt(value.day));
    }
}