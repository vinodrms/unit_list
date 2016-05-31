import {Pipe, PipeTransform} from '@angular/core';
import {ThTimestamp} from '../../../pages/internal/services/common/data-objects/th-dates/ThTimestamp';

@Pipe({
    name: 'thtimestampdistancefromnow'
})

export class ThTimestampDistanceFromNowPipe implements PipeTransform {
    transform(thTimestamp: ThTimestamp): any {
        if (thTimestamp != null && thTimestamp.getTimeDistanceFromNowString) {
            return thTimestamp.getTimeDistanceFromNowString();
        }
        return "";
    }
}