import { Injectable } from "@angular/core";
import { LanguageUtil } from "@app/core/utils";
import { appConfig } from "@app/app.config";
import { TranslateService } from "@ngx-translate/core";
import { Observable, Subscription } from 'rxjs/Rx';

@Injectable()
export class MultiLanguageService {
    public static getMultiLangText(value: Dictionary<string>, lang: string, fallbackLang: string) {
        return value[lang] != undefined
            ? value[lang]
            : value[fallbackLang];
    }

    constructor(translateService: TranslateService) {
        this.translateService = translateService;
    }

    private translateService: TranslateService;

    public getBrowserLangText(value: Dictionary<string>) {
        const browserLang = LanguageUtil.getBrowserLang();
        return MultiLanguageService.getMultiLangText(value, browserLang, appConfig.defaultLang);
    }

    public get(key: string): Observable<any> {
        return this.translateService.get(key);
    }
}