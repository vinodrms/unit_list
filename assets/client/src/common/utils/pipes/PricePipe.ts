import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({
	name: 'price'
})

export class PricePipe implements PipeTransform {
	transform(value: number): any {
		if (!value) {
			return value;
		}
		return value.toFixed(2);
	}
}