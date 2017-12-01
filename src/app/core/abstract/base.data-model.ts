export abstract class BaseDataModel implements IBaseDataModel {
    constructor(data: IBaseDataModel | undefined) {
        this.id = data ? data.id : '';
    }
    public id: string;
}

export interface IBaseDataModel {
    id: string;
}