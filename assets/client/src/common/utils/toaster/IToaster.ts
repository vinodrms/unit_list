import {OpaqueToken, ElementRef} from 'angular2/core';

export interface IToaster {
	bootstrap(elementRef: ElementRef);
	error(message: string, title?: string);
	success(message: string, title?: string);
	info(message: string, title?: string);
}
export const IToaster = new OpaqueToken("IToaster");