import {Pipe, PipeTransform} from '@angular/core';
import {ThTimestamp} from '../../../pages/internal/services/common/data-objects/th-dates/ThTimestamp';

@Pipe({
    name: 'thtimestamp'
})

export class ThTimestampPipe implements PipeTransform {
    transform(thTimestamp: ThTimestamp): any {
        if (thTimestamp != null && thTimestamp.toString) {
            return thTimestamp.toString();
        }
        return "";
    }
}