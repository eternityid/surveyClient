import { Directive, ElementRef, Input, Output, EventEmitter } from "@angular/core";
import { HtmlUtil } from "@app/core/utils";

@Directive({
    selector: '[app-drag-end]'
})
export class AppDragEndDirective {

    constructor(elemRef: ElementRef) {
        let elem: HTMLElement = elemRef.nativeElement;
        let prevOnDragEnd = elem.ondragend;
        elem.ondragend = (dragEvent: DragEvent) => {
            if (prevOnDragEnd) prevOnDragEnd.call(elem, dragEvent);
            if (this.dragEndCallback) this.dragEndCallback(dragEvent);
        };
    }

    @Input("app-drag-end")
    dragEndCallback: (dragEvent: DragEvent) => void;
}