import {OpaqueToken} from '@angular/core';

export interface IThLocalStorage {
	set(key: string, value: any): void;
    get(key: string): any;
    remove(key: string): void;
}
export const IThLocalStorage = new OpaqueToken("IThLocalStorage");