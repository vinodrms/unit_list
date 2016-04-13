import {Pipe, PipeTransform} from 'angular2/core';
import {ThHourDO} from '../../../pages/internal/services/common/data-objects/th-dates/ThHourDO';

@Pipe({
    name: 'thhour'
})

export class ThHourPipe implements PipeTransform {
    transform(thHour: ThHourDO, args: any[]): any {
		if(!thHour) {
			return '';
		}
		return this.getNumberString(thHour.hour) + ":" + this.getNumberString(thHour.minute);
    }
	private getNumberString(hourOrMinute: number): string {
		if(hourOrMinute < 10) {
            return '0' + hourOrMinute; 
        }
		return hourOrMinute + '';
	}
}