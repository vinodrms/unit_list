import {OpaqueToken} from '@angular/core';

export interface IThCookie {
	getCookie(name: string): string;
	setCookie(name: string, value: string, expires?: number, path?: string, domain?: string);
	deleteCookie(name: string, path?: string, domain?: string);
}
export const IThCookie = new OpaqueToken("IThCookie");