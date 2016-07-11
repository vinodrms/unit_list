import {Pipe, PipeTransform} from '@angular/core';
import {ThTimestampDO} from '../../../pages/internal/services/common/data-objects/th-dates/ThTimestampDO';

@Pipe({
    name: 'thtimestamp'
})

export class ThTimestampPipe implements PipeTransform {
    transform(thTimestamp: ThTimestampDO): any {
        if (thTimestamp != null && thTimestamp.toString) {
            return thTimestamp.toString();
        }
        return "";
    }
}