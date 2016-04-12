import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({
    name: 'hour'
})

export class HourPipe implements PipeTransform {
    transform(value: number, args: any[]): any {
        var valueStr: string = '';
        if(value < 10) {
            valueStr += '0' + value; 
            return valueStr
        }
        return value;
    }
}