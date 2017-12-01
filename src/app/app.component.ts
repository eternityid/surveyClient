import { Component, OnInit, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { appConfig } from './app.config';
import { LanguageUtil } from '@app/core/utils';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  constructor(translate: TranslateService) {
    const browserLang = LanguageUtil.getBrowserLang();
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang(appConfig.defaultLang);

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use(browserLang);
  }
}
