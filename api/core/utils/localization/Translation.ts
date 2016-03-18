import _ = require("underscore");

export enum Locales {
	English,
	Danish
}

var SupportedLocales: { [index: number]: string; } = {};
SupportedLocales[Locales.English] = "en";
SupportedLocales[Locales.Danish] = "dk";

export class Translation {
	public static DefaultLocale = Locales.English;

	constructor(private _locale: Locales) {
	}
	public getTranslation(phrase: string): string {
		return sails.__({
			phrase: phrase,
			locale: SupportedLocales[this._locale]
		});
	}

	public parseLocale(possibleLocale: any): Locales {
		if (_.isNumber(possibleLocale)) {
			var inputLocale: number = possibleLocale;
			for (var locale in Locales) {
				var parsedLocale = parseInt(locale);
				if (parsedLocale === possibleLocale) {
					return parsedLocale;
				}
			}
		}
		return this._locale;
	}
}