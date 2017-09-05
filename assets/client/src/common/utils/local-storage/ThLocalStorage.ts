import { IThLocalStorage } from "./IThLocalStorage";

export class ThLocalStorage implements IThLocalStorage {
    private readonly localStorage;

    set(key: string, value: any): void {
        localStorage.setItem(key, value)
    }
    get(key: string) {
        return localStorage.getItem(key);
    }
    remove(key: string): void {
        localStorage.removeItem(key);
    }
}