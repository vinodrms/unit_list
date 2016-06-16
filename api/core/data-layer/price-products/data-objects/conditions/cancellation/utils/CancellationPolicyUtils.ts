import {ThDateDO} from '../../../../../../utils/th-dates/data-objects/ThDateDO';
import {ThHourDO} from '../../../../../../utils/th-dates/data-objects/ThHourDO';
import {ThTimestampDO} from '../../../../../../utils/th-dates/data-objects/ThTimestampDO';
import {BookingCancellationTimeDO, BookingCancellationTimeType} from '../../../../../bookings/data-objects/cancellation-time/BookingCancellationTimeDO';

export class CancellationPolicyUtils {
    public generateBookingCancellationTimeDO(cancellationTimeType: BookingCancellationTimeType, thDateDO: ThDateDO, thHour: ThHourDO): BookingCancellationTimeDO {
        var cancellationTime = new BookingCancellationTimeDO();
        cancellationTime.type = cancellationTimeType;
        cancellationTime.thTimestamp = new ThTimestampDO();
        cancellationTime.thTimestamp.thDateDO = thDateDO;
        cancellationTime.thTimestamp.thHourDO = thHour;
        cancellationTime.utcTimestamp = cancellationTime.thTimestamp.getUtcTimestamp();
        return cancellationTime;
    }
}