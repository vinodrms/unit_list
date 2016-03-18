import {Observable} from 'rxjs/Observable';
import {OpaqueToken} from 'angular2/core';

export interface IThHttp {
	get(method: string, parameters: Object): Observable<Object>;
	post(method: string, parameters: Object): Observable<Object>;
}
export const IThHttp = new OpaqueToken("IThHttp");