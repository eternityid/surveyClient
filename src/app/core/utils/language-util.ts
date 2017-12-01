export class LanguageUtil {
    public static getBrowserLang() {
        return window.navigator.language.substr(0, 2);
    }
}