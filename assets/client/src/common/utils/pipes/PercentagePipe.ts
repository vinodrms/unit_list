import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({
	name: 'percentage'
})

export class PercentagePipe implements PipeTransform {
	transform(value: number, args: any[]) : any {
		if(!value) {
			return "";
		}
		return (value * 100) + "%"; 
	}
}