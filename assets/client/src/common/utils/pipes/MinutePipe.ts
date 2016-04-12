import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({
	name: 'minute'
})

export class MinutePipe implements PipeTransform {
	transform(value: number, args: any[]) : any {
        var valueStr: string = '';
        if(value < 10) {
            valueStr += '0' + value; 
            return valueStr
        }
        return value;
	}
}