export enum Locales {
	English,
	Romanian,
	Danish
}

var SupportedLocales :  { [index: number]: string; } = { };
SupportedLocales[Locales.English] = "en";
SupportedLocales[Locales.Romanian] = "ro";
SupportedLocales[Locales.Danish] = "dk";

export class Translation {
	constructor(private _locale:  Locales) {
	}
	public getTranslation(phrase : string) : string {
		return sails.__({
  			phrase: phrase,
  			locale: SupportedLocales[this._locale]
		});
	}
}