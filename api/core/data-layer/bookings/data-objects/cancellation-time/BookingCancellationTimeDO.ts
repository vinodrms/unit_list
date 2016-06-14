import {BaseDO} from '../../../common/base/BaseDO';
import {ThTimestamp} from '../../../../utils/th-dates/ThTimestamp';

export enum BookingCancellationTimeType {
    ExactTimestamp,
    DependentOnCancellationHour
}

export class BookingCancellationTimeDO extends BaseDO {
    type: BookingCancellationTimeType;
    thTimestamp: ThTimestamp;
    utcTimestamp: number;

    protected getPrimitivePropertyKeys(): string[] {
        return ["type", "utcTimestamp"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.thTimestamp = new ThTimestamp();
        this.thTimestamp.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "thTimestamp"));
    }
}