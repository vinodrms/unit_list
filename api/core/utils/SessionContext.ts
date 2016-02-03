import {Locales} from './localization/Translation';

export class SessionContext {
	constructor(private _locale : Locales) {
	}
	public getLocale() : Locales {
		return this._locale;
	}
}