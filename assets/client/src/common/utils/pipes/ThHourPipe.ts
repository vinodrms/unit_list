import {Pipe, PipeTransform} from '@angular/core';
import {ThHourDO} from '../../../pages/internal/services/common/data-objects/th-dates/ThHourDO';

@Pipe({
    name: 'thhour'
})

export class ThHourPipe implements PipeTransform {
    transform(thHour: ThHourDO): any {
		if(thHour != null && thHour.toString) {
			return thHour.toString();
		}
		return "";
    }
}