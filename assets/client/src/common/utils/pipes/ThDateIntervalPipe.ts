import {Pipe, PipeTransform} from '@angular/core';
import {ThDateIntervalDO} from '../../../pages/internal/services/common/data-objects/th-dates/ThDateIntervalDO';

@Pipe({
    name: 'thdateinterval'
})

export class ThDateIntervalPipe implements PipeTransform {
    transform(thInterval: ThDateIntervalDO): any {
		if (thInterval != null && thInterval.toString) {
			return thInterval.toString();
		}
		return "";
    }
}