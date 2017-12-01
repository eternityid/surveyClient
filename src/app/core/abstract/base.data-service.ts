
import { Observable, Subscription } from 'rxjs/Rx';
import { ArrayUtil, StringUtil } from "@app/core/utils";
import { BaseDataModel } from "./base.data-model";
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";

const ERR_CONNECTION_REFUSED_STATUS = 0;
const HTTP_CLIENT_ERRORS_STATUS = [400, 403, 404, 401, 409];

export interface HttpClientOptions {
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    observe?: 'body';
    params?: HttpParams | {
        [param: string]: string | string[];
    };
    reportProgress?: boolean;
    withCredentials?: boolean;
};

export interface IBaseDataService<T extends BaseDataModel> {
    getAll?: () => Observable<T[]>;
    get?: (id: number) => Observable<T>;
    post?: (value: T) => Observable<T>;
    put?: (value: T) => Observable<T>;
    delete?: (id: number) => Observable<any>;
}

export abstract class BaseDataService<T extends BaseDataModel> {
    constructor(config: DataServiceConfig, http: HttpClient) {
        this.baseUrl = config.baseUrl;
        this.http = http;
    }
    protected abstract resourceName: string;

    protected baseUrl: string;
    protected get baseResourceUrl(): string { return `${this.baseUrl}/${this.resourceName}`; }
    protected defaultOptions: HttpClientOptions = {
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        }
    };

    private http: HttpClient;

    protected getAll(): Observable<Dictionary<T>> {
        return this
            .httpGet<T[]>(`${this.baseResourceUrl}`)
            .map(res => {
                return ArrayUtil.keyBy(res, item => item.id);
            });
    }

    protected get(id: number): Observable<T> {
        return this
            .httpGet<T>(`${this.baseResourceUrl}/${id}`);
    }

    protected post(value: T): Observable<T> {
        return this
            .httpPost<T>(`${this.baseResourceUrl}`, value);
    }

    protected put(value: T): Observable<T> {
        return this
            .httpPut<T>(`${this.baseResourceUrl}/${value.id}`, value);
    }

    protected delete(id: number): Observable<any> {
        return this
            .httpDelete<any>(`${this.baseResourceUrl}/${id}`);
    }

    protected httpGet<T>(url: string, options?: HttpClientOptions) {
        return this.http
            .get(url, options || this.defaultOptions)
            .catch(this.catchHttpError);
    }

    protected httpPost<T>(url: string, body: T, options?: HttpClientOptions) {
        return this.http
            .post(url, this.stringify(body), options || this.defaultOptions)
            .catch(this.catchHttpError);
    }

    protected httpPut<T>(url: string, body: T, options?: HttpClientOptions) {
        return this.http
            .put(url, this.stringify(body), options || this.defaultOptions)
            .catch(this.catchHttpError);
    }

    protected httpDelete<T>(url: string, options?: HttpClientOptions) {
        return this.http
            .delete(url, options || this.defaultOptions)
            .catch(this.catchHttpError);
    }

    protected stringify(value: any) {
        let json = JSON.stringify(value);
        json = StringUtil.replaceUnderscoreProp(json);
        return json;
    }

    private catchHttpError(errorResponse: HttpErrorResponse) {
        if (errorResponse.status == ERR_CONNECTION_REFUSED_STATUS)
            return Observable.throw(["Can't connect to server."]);
        if (HTTP_CLIENT_ERRORS_STATUS.includes(errorResponse.status)) {
            let errorJson = <JsonErrorResponse>errorResponse.error;
            return Observable.throw(errorJson.messages);
        }

        return Observable.throw(["Unknown error."]);
    }
}

export class DataServiceConfig {
    baseUrl: string;
}

export class JsonErrorResponse {
    public messages: string[];
    public developerMessage: any;
}