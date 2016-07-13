import {ThTimestampDO} from '../../../utils/th-dates/data-objects/ThTimestampDO';
import {BookingDO} from '../../../data-layer/bookings/data-objects/BookingDO';

export interface IBookingStatusChangerProcess {
    changeStatuses(referenceTimestamp: ThTimestampDO): Promise<BookingDO[]>;
}