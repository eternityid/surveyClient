import { DataModelState } from "./base.states";

export abstract class BaseUiModel {
    public static setUiModelDestroyed<TUi extends BaseUiModel>(uiModel: TUi): TUi {
        uiModel.destroyed = true;
        return uiModel;
    }

    public destroyed: boolean;
    public loading: boolean;
    public error: string[] | undefined;
    public abstract updateDataModel(modelState: DataModelState): void;

    protected errorsByLinesAsHtml(): string | null {
        if (this.error == undefined) return null;
        return this.error.join('<br>');
    }
}