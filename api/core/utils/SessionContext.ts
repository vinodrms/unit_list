import {Locales} from './localization/Translation';

export class SessionContext {
	locale: Locales;
	// TODO: make a structure for the logged user
	user: any;

	constructor(locale: Locales) {
	}


}