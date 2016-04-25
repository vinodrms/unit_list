import {ThTranslation} from '../localization/ThTranslation';

export class NumberSuffixFormatter {
	constructor(private _thTranslation: ThTranslation) {
	}

	public getNumberSuffix(inputNumber: number) {
		return this._thTranslation.translate(this.getDefaultNumberSuffix(inputNumber));
	}
	private getDefaultNumberSuffix(inputNumber: number): string {
		switch (inputNumber) {
			case 1:
				return "st";
			case 2:
				return "nd";
			case 3:
				return "rd";
			default:
				return "th";
		}
	}
}