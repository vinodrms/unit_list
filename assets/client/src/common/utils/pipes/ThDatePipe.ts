import {Pipe, PipeTransform} from '@angular/core';
import {ThDateDO} from '../../../pages/internal/services/common/data-objects/th-dates/ThDateDO';

@Pipe({
    name: 'thdate'
})

export class ThDatePipe implements PipeTransform {
    transform(thDate: ThDateDO): any {
		if (thDate != null && thDate.toString) {
			return thDate.toString();
		}
		return "";
    }
}