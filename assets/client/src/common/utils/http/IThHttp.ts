import {Observable} from 'rxjs/Observable';
import {OpaqueToken} from 'angular2/core';
import {ThServerApi} from './ThServerApi';

export interface IThHttp {
	get(serverApi: ThServerApi, parameters: Object): Observable<Object>;
	post(serverApi: ThServerApi, parameters: Object): Observable<Object>;
}
export const IThHttp = new OpaqueToken("IThHttp");