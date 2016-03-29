import {Observable} from 'rxjs/Observable';
import {OpaqueToken} from 'angular2/core';
import {ThServerApi} from './ThServerApi';

export interface UploadedFileResponse {
    url: string;
    secureUrl: string;
}

export interface IThHttp {
	get(serverApi: ThServerApi, parameters?: Object): Observable<Object>;
	post(serverApi: ThServerApi, parameters: Object): Observable<Object>;
	uploadFile(file: File): Observable<UploadedFileResponse>;
}
export const IThHttp = new OpaqueToken("IThHttp");