import {ThUtils} from '../ThUtils';

import _ = require("underscore");

export enum Locales {
	English,
	Danish
}

var SupportedLocales: { [index: number]: string; } = {};
SupportedLocales[Locales.English] = "en";
SupportedLocales[Locales.Danish] = "dk";

declare var sails: any;

export class ThTranslation {
	private static TemplateVariableRegex: RegExp = /%([^{}\s]*)%/g;
	private _thUtils: ThUtils;

	public static DefaultLocale = Locales.English;

	constructor(private _locale: Locales) {
		this._thUtils = new ThUtils();
	}
	public translate(phrase: string, parameters?: Object): string {
		var translatedPhrase: string = sails.__({
			phrase: phrase,
			locale: SupportedLocales[this._locale]
		});
		if(this._thUtils.isUndefinedOrNull(translatedPhrase) || !_.isString(translatedPhrase)) {
			translatedPhrase = phrase;
		}
		return this.applyTemplateRegexToParams(translatedPhrase, parameters);
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

	private applyTemplateRegexToParams(phrase: string, parameters?: Object): string {
		if (this._thUtils.isUndefinedOrNull(parameters) && !_.isObject(parameters)) {
			return phrase;
		}
		if (!_.isString(phrase)) {
			return phrase;
		}
		return phrase.replace(ThTranslation.TemplateVariableRegex, (substring: string, actualKey: string) => {
			if (this._thUtils.isUndefinedOrNull(parameters, actualKey)) {
				return "";
			}
			return parameters[actualKey];
		});
	}
}