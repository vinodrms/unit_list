import {Observable} from 'rxjs/Observable';
import {OpaqueToken} from '@angular/core';
import {ThServerApi} from './ThServerApi';

export interface RequestConfiguration {
    serverApi: ThServerApi;
    headers?: Dictionary<string>;
    parameters?: Object;
};

export interface UploadedFileResponse {
    url: string;
    secureUrl: string;
}

export interface IThHttp {
	get(config: RequestConfiguration): Observable<Object>;
	post(config: RequestConfiguration): Observable<Object>;
	uploadFile(file: File): Observable<UploadedFileResponse>;
}
export const IThHttp = new OpaqueToken("IThHttp");