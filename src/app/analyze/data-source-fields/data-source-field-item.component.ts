import { ViewEncapsulation, Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef } from "@angular/core";
import { FieldItemUi } from "@app/analyze/_shared/ui-models";
import { MultiLanguageService } from "@app/core/services";
import { BaseComponent } from "@app/core/abstract";
import { ObservableMedia } from "@angular/flex-layout";

@Component({
    selector: 'data-source-field-item',
    templateUrl: './data-source-field-item.component.html',
    styleUrls: ['./data-source-field-item.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataSourceFieldItemComponent extends BaseComponent {
    constructor(changeDetector: ChangeDetectorRef, multiLanguageService: MultiLanguageService, elementRef: ElementRef, media: ObservableMedia) {
        super(changeDetector, multiLanguageService, elementRef, media);
    }

    @Input()
    public vm: FieldItemUi;
    @Input()
    public iconClass: string;
}