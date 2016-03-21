import {OpaqueToken} from 'angular2/core';

export interface IRouterNavigator {
	navigateTo(componentName: string, params?: Object);
}
export const IRouterNavigator = new OpaqueToken("IRouterNavigator");