import {OpaqueToken, ViewContainerRef} from '@angular/core';
import {ModuleLoaderService} from '../module-loader/ModuleLoaderService';

export interface IToaster {
	bootstrap(viewContainerRef: ViewContainerRef, moduleLoaderService: ModuleLoaderService);
	error(message: string, title?: string);
	success(message: string, title?: string);
	info(message: string, title?: string);
}
export const IToaster = new OpaqueToken("IToaster");