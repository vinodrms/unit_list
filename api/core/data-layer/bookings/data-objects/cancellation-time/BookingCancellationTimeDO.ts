import {BaseDO} from '../../../common/base/BaseDO';
import {ThTimestampDO} from '../../../../utils/th-dates/data-objects/ThTimestampDO';

export enum BookingCancellationTimeType {
    ExactTimestamp,
    DependentOnCancellationHour
}

export class BookingCancellationTimeDO extends BaseDO {
    type: BookingCancellationTimeType;
    thTimestamp: ThTimestampDO;
    utcTimestamp: number;

    protected getPrimitivePropertyKeys(): string[] {
        return ["type", "utcTimestamp"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.thTimestamp = new ThTimestampDO();
        this.thTimestamp.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "thTimestamp"));
    }
}