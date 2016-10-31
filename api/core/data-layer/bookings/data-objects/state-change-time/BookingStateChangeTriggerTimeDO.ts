import { BaseDO } from '../../../common/base/BaseDO';
import { ThTimestampDO } from '../../../../utils/th-dates/data-objects/ThTimestampDO';
import { ThHourDO } from '../../../../utils/th-dates/data-objects/ThHourDO';

export enum BookingStateChangeTriggerType {
    ExactTimestamp,
    DependentOnCancellationHour,
    Never
}

export interface TriggerTimeParams {
    cancellationHour: ThHourDO;
    currentHotelTimestamp: ThTimestampDO;
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

    public isInThePast(triggerParams: TriggerTimeParams): boolean {
        if (this.type === BookingStateChangeTriggerType.Never) {
            return false;
        }
        var triggerUtcTimestamp = this.utcTimestamp;
        if (this.type === BookingStateChangeTriggerType.DependentOnCancellationHour) {
            triggerUtcTimestamp += triggerParams.cancellationHour.getMillis();
        }
        return triggerUtcTimestamp <= triggerParams.currentHotelTimestamp.getUtcTimestamp();
    }
    public getThTimestamp(triggerParams: TriggerTimeParams): ThTimestampDO {
        var thTimestamp = this.thTimestamp.buildPrototype();
        if (this.type === BookingStateChangeTriggerType.DependentOnCancellationHour) {
            thTimestamp.thHourDO = triggerParams.cancellationHour;
        }
        return thTimestamp;
    }
}