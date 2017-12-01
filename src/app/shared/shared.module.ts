import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppButtonDirective, AppDragEndDirective } from '@app/shared/directives';
import { AppAlertComponent, AppDropdownComponent, AppButtonComponent, AppNavigationComponent, AppLinkButtonComponent } from '@app/shared/components';
import { DndModule } from 'ng2-dnd';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule, Routes, Route } from '@angular/router';
import { AppDatepickerComponent } from '@app/shared/components/app-datepicker/app-datepicker.component';

@NgModule({
    imports: [CommonModule, FormsModule, NgbModule, DndModule, FlexLayoutModule, TranslateModule, RouterModule],
    declarations: [
        AppButtonDirective,
        AppDragEndDirective,

        AppAlertComponent,
        AppDropdownComponent,
        AppButtonComponent,
        AppNavigationComponent,
        AppLinkButtonComponent,
        AppDatepickerComponent
    ],
    exports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        NgbModule,
        DndModule,
        FlexLayoutModule,
        RouterModule,

        AppButtonDirective,
        AppDragEndDirective,

        AppAlertComponent,
        AppDropdownComponent,
        AppButtonComponent,
        AppNavigationComponent,
        AppLinkButtonComponent,
        AppDatepickerComponent
    ]
})
export class SharedModule { }
