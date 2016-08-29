import {BaseDO} from '../../../../../../common/base/BaseDO';
import {ThTimestampDO} from '../../../common/data-objects/th-dates/ThTimestampDO';

export enum BookingStateChangeTriggerType {
    ExactTimestamp,
    DependentOnCancellationHour,
    Never
}

export class BookingStateChangeTriggerTimeDO extends BaseDO {
    type: BookingStateChangeTriggerType;
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

    public isDependentOnCancellationHour(): boolean {
        return this.type === BookingStateChangeTriggerType.DependentOnCancellationHour;
    }
}