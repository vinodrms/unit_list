import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'price'
})

export class PricePipe implements PipeTransform {
	transform(value: number): any {
		if (!value) {
			return value;
		}
		return value.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 2});
	}
}