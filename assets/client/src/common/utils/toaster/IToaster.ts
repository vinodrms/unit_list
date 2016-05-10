import {OpaqueToken, ViewContainerRef} from '@angular/core';

export interface IToaster {
	bootstrap(viewContainerRef: ViewContainerRef);
	error(message: string, title?: string);
	success(message: string, title?: string);
	info(message: string, title?: string);
}
export const IToaster = new OpaqueToken("IToaster");