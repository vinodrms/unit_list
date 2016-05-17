import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'thtrim'
})

export class ThTrimPipe implements PipeTransform {
    transform(displayValue: string, trimCount: number): any {
		if (!_.isString(displayValue)) {
			return displayValue;
		}
		if (!_.isNumber(trimCount)) {
			return displayValue;
		}
		return displayValue.substring(0, Math.min(trimCount, displayValue.length));
    }
}