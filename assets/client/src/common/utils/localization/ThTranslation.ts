import {Injectable, Inject, EventEmitter} from '@angular/core';
import {ThUtils} from '../ThUtils';
import {ThCookie} from '../cookies/ThCookie';
import {DanishTranslations} from './locales/Danish';
import {EnglishTranslations} from './locales/English';
import {IThCookie} from '../cookies/IThCookie';

export enum Locales {
	English,
	Danish
}

var SupportedLocales: { [index: number]: string; } = {};
SupportedLocales[Locales.English] = "en";
SupportedLocales[Locales.Danish] = "dk";

@Injectable()
export class ThTranslation {
	private static TemplateVariableRegex: RegExp = /%\s?([^{}\s]*)\s?%/g;
	private static LanguageCookieName = "ThLocales";
	private static DefaultLocale = Locales.English;

	public onLangChange: EventEmitter<any> = new EventEmitter<any>();

	private _thUtils: ThUtils;
	private _locale: Locales;
	private _translationJson: Object = {};

	constructor( @Inject(IThCookie) private _thCookie: IThCookie) {
		this._thUtils = new ThUtils();
		this.updateDefaultLocale();
	}
	private updateDefaultLocale() {
		var cookieLang: string = this._thCookie.getCookie(ThTranslation.LanguageCookieName);
		if (this.updateLocaleStr(cookieLang)) {
			return;
		}
		var browserLang = this.getBrowserLangStr();
		if (!this.updateLocaleStr(browserLang)) {
			this.locale = ThTranslation.DefaultLocale;
		}
	}
	private getBrowserLangStr(): string {
		return navigator.language.split('-')[0].toLowerCase();
	}
	private updateLocaleStr(localeStr: string): boolean {
		if (this._thUtils.isUndefinedOrNull(localeStr)) {
			return false;
		}
		for (var locale in Locales) {
			var parsedLocale = parseInt(locale);
			if (!this._thUtils.isUndefinedOrNull(SupportedLocales[parsedLocale]) && SupportedLocales[parsedLocale] === localeStr) {
				this.locale = parsedLocale;
				return true;
			}
		}
		return false;
	}

	public get locale(): Locales {
		return this._locale;
	}
	public set locale(locale: Locales) {
		if (locale === this._locale) {
			return;
		}
		this._locale = locale;
		this._thCookie.setCookie(ThTranslation.LanguageCookieName, SupportedLocales[this._locale]);
		this.updateTranslationJson();
		this.onLangChange.emit({});
	}
	private updateTranslationJson() {
		switch (this._locale) {
			case Locales.English:
				this._translationJson = EnglishTranslations;
				break;
			case Locales.Danish:
				this._translationJson = DanishTranslations;
				break;
			default:
				this._translationJson = EnglishTranslations;
				break;
		}
	}

	public translate(phrase: string, parameters?: Object): string {
		var translatedPhrase = this.getFromTranslationObject(phrase);
		return this.applyTemplateRegexToParams(translatedPhrase, parameters);
	}
	private getFromTranslationObject(phrase: string): string {
		var translatedMessage = this._translationJson[phrase];
		if (this._thUtils.isUndefinedOrNull(translatedMessage)) {
			return phrase;
		}
		return translatedMessage;
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
	public getLocaleString(): string {
		return SupportedLocales[this._locale];
	}
}