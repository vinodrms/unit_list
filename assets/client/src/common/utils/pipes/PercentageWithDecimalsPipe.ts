import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'percentageWithDecimals'
})

export class PercentageWithDecimalsPipe implements PipeTransform {
	transform(value: number): any {
		if (!_.isNumber(value)) {
			return "";
		}
		return (value * 100).toFixed(2) + "%";
	}
}