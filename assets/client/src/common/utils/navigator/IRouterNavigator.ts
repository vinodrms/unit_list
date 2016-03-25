import {OpaqueToken} from 'angular2/core';

export interface IRouterNavigator {
	navigateTo(componentStackPath: string, params?: Object);
}
export const IRouterNavigator = new OpaqueToken("IRouterNavigator");