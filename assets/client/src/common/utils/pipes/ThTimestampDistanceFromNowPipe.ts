import {Pipe, PipeTransform} from '@angular/core';
import {ThTimestampDO} from '../../../pages/internal/services/common/data-objects/th-dates/ThTimestampDO';

@Pipe({
    name: 'thtimestampdistancefromnow'
})

export class ThTimestampDistanceFromNowPipe implements PipeTransform {
    transform(thTimestamp: ThTimestampDO): any {
        if (thTimestamp != null && thTimestamp.getTimeDistanceFromNowString) {
            return thTimestamp.getTimeDistanceFromNowString();
        }
        return "";
    }
}