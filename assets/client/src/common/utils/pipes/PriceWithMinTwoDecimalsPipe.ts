import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'twodecimalsprice'
})

export class PriceWithMinTwoDecimalsPipe implements PipeTransform {
	transform(value: number): any {
		if (!value) {
			return value;
		}
		return value.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
	}
}