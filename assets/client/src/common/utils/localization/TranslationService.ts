import {Injectable, EventEmitter} from 'angular2/core';
import {ThUtils} from '../ThUtils';
import {ThCookie} from '../cookies/ThCookie';
import {DanishTranslations} from './locales/Danish';
import {EnglishTranslations} from './locales/English';

export enum Locales {
	English,
	Danish
}

var SupportedLocales: { [index: number]: string; } = {};
SupportedLocales[Locales.English] = "en";
SupportedLocales[Locales.Danish] = "dk";

@Injectable()
export class TranslationService {
	private static LanguageCookieName = "ThLocales";
	private static DefaultLocale = Locales.English;

	public onLangChange: EventEmitter<any> = new EventEmitter<any>();

	private _thUtils: ThUtils;
	private _locale: Locales;
	private _translationJson: Object = {};

	constructor() {
		this._thUtils = new ThUtils();
		this.updateDefaultLocale();
	}
	private updateDefaultLocale() {
		var cookieLang: string = ThCookie.getCookie(TranslationService.LanguageCookieName);
		if (this.updateLocaleStr(cookieLang)) {
			return;
		}
		var browserLang = this.getBrowserLangStr();
		if (!this.updateLocaleStr(browserLang)) {
			this.locale = TranslationService.DefaultLocale;
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
		ThCookie.setCookie(TranslationService.LanguageCookieName, SupportedLocales[this._locale]);
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

	public getTranslation(phrase: string): string {
		var translatedMessage = this._translationJson[phrase];
		if (this._thUtils.isUndefinedOrNull(translatedMessage)) {
			return phrase;
		}
		return translatedMessage;
	}
}