import {Pipe, PipeTransform} from '@angular/core';
import {ThDateIntervalDO} from '../../../pages/internal/services/common/data-objects/th-dates/ThDateIntervalDO';
import {ThTranslation} from '../localization/ThTranslation';

@Pipe({
    name: 'thlongdateinterval'
})

export class ThLongDateIntervalPipe implements PipeTransform {
    constructor(private _thTranslation: ThTranslation) {
    }

    transform(thInterval: ThDateIntervalDO): any {
        if (thInterval != null && thInterval.start && thInterval.end) {
            return thInterval.start.getLongDisplayString(this._thTranslation) + " - " + thInterval.end.getLongDisplayString(this._thTranslation);
        }
        return "";
    }
}