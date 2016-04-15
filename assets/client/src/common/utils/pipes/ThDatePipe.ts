import {Pipe, PipeTransform} from 'angular2/core';
import {ThDateDO} from '../../../pages/internal/services/common/data-objects/th-dates/ThDateDO';

@Pipe({
    name: 'thdate'
})

export class ThDatePipe implements PipeTransform {
    transform(thDate: ThDateDO, args: any[]): any {
		if (thDate != null && thDate.toString) {
			return thDate.toString();
		}
		return "";
    }
}