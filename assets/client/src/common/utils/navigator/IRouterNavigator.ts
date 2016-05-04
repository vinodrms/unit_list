import {OpaqueToken} from '@angular/core';

export interface IRouterNavigator {
	navigateTo(componentStackPath: string, params?: Object);
}
export const IRouterNavigator = new OpaqueToken("IRouterNavigator");