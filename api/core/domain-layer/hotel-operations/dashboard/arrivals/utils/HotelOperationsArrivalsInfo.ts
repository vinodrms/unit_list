import { ThDateIntervalDO } from '../../../../../utils/th-dates/data-objects/ThDateIntervalDO';
import { ConfigCapacityDO } from '../../../../../data-layer/common/data-objects/bed-config/ConfigCapacityDO';
import { ThDateDO } from '../../../../../utils/th-dates/data-objects/ThDateDO';
import { BookingConfirmationStatus } from '../../../../../data-layer/bookings/data-objects/BookingDO';
import { ThTimestampDO } from '../../../../../utils/th-dates/data-objects/ThTimestampDO';

export enum ArrivalItemStatus {
    NoShow,
    NoPaymentGuarantee,
    CanCheckIn
}

export interface ArrivalItemInfo {
    itemStatus: ArrivalItemStatus;
    roomCategoryId: string;
    reservedRoomId: string;

    customerId: string;
    corporateCustomerId?: string;
    customerName?: string;
    corporateCustomerName?: string;

    bookingId: string;
    groupBookingId: string;
    bookingInterval: ThDateIntervalDO;
    bookingCapacity: ConfigCapacityDO;
    bookingStatus: BookingConfirmationStatus;
    bookingStatusDisplayString: string;
    totalBookingPrice: number;
    showCancellationTimestamp: boolean;
    cancellationTimestamp: ThTimestampDO;
    cancellationTimestampDisplayString: string;
    bookingNotes: string;
}

export class HotelOperationsArrivalsInfo {
    arrivalInfoList: ArrivalItemInfo[];
    referenceDate: ThDateDO;

    constructor() {
        this.arrivalInfoList = [];
    }
}