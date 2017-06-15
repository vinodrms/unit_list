import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'price'
})

export class PricePipe implements PipeTransform {
	private static MinimumFractionDigits: number = 2;
	private static MaximumFractionDigits: number = 2;

	transform(value: number, format: Object): any {
		if (!value) {
			return value;
		}

		let minimumFractionDigits = PricePipe.MinimumFractionDigits;
		let maximumFractionDigits = PricePipe.MaximumFractionDigits;

		if (_.isObject(format)) {
			if (_.isNumber(format['minimumFractionDigits'])) {
				minimumFractionDigits = format['minimumFractionDigits'];
			}
			if (_.isNumber(format['maximumFractionDigits'])) {
				maximumFractionDigits = format['maximumFractionDigits'];
			}
		}

		return value.toLocaleString('en-US', { minimumFractionDigits: minimumFractionDigits, maximumFractionDigits: maximumFractionDigits });
	}
}