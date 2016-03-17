import {OpaqueToken} from 'angular2/core';

export interface IThHttp {
	get(method: string, parameters: Object): Promise<Object>;
	post(method: string, parameters: Object): Promise<Object>;
}
export const IThHttp = new OpaqueToken("IThHttp");