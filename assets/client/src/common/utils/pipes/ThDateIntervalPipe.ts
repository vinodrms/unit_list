import {Pipe, PipeTransform} from '@angular/core';
import {ThDateIntervalDO} from '../../../pages/internal/services/common/data-objects/th-dates/ThDateIntervalDO';
import {ThTranslation} from '../localization/ThTranslation';

@Pipe({
    name: 'thdateinterval'
})

export class ThDateIntervalPipe implements PipeTransform {
	constructor(private _thTranslation: ThTranslation) {
	}

    transform(thInterval: ThDateIntervalDO): any {
		if (thInterval != null && thInterval.getShortDisplayString) {
			return thInterval.getShortDisplayString(this._thTranslation);
		}
		return "";
    }
}