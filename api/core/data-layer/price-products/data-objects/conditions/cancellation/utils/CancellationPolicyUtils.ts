import { ThDateUtils } from '../../../../../../utils/th-dates/ThDateUtils';
import { ThDateDO } from '../../../../../../utils/th-dates/data-objects/ThDateDO';
import { ThHourDO } from '../../../../../../utils/th-dates/data-objects/ThHourDO';
import { ThTimestampDO } from '../../../../../../utils/th-dates/data-objects/ThTimestampDO';
import { BookingStateChangeTriggerTimeDO, BookingStateChangeTriggerType } from '../../../../../bookings/data-objects/state-change-time/BookingStateChangeTriggerTimeDO';

export class CancellationPolicyUtils {
    thDateUtils: ThDateUtils;

    constructor() {
        this.thDateUtils = new ThDateUtils();
    }

    public generateStateChangeTriggerTimeDO(cancellationTimeType: BookingStateChangeTriggerType, thDateDO: ThDateDO, thHour: ThHourDO): BookingStateChangeTriggerTimeDO {
        var cancellationTime = new BookingStateChangeTriggerTimeDO();
        cancellationTime.type = cancellationTimeType;
        cancellationTime.thTimestamp = new ThTimestampDO();
        cancellationTime.thTimestamp.thDateDO = thDateDO;
        cancellationTime.thTimestamp.thHourDO = thHour;
        cancellationTime.utcTimestamp = cancellationTime.thTimestamp.getUtcTimestamp();
        return cancellationTime;
    }

    public generateMidnightStateChangeTriggerTimeDO(arrivalDate: ThDateDO): BookingStateChangeTriggerTimeDO {
        var thDate = this.thDateUtils.addDaysToThDateDO(arrivalDate.buildPrototype(), 1);
        return this.generateStateChangeTriggerTimeDO(BookingStateChangeTriggerType.ExactTimestamp, thDate, ThHourDO.buildThHourDO(0, 0));
    }
}
