import {ThDateIntervalDO} from '../../../../../utils/th-dates/data-objects/ThDateIntervalDO';
import {ConfigCapacityDO} from '../../../../../data-layer/common/data-objects/bed-config/ConfigCapacityDO';
import {ThDateDO} from '../../../../../utils/th-dates/data-objects/ThDateDO';

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
    customerName?: string;

    bookingId: string;
    groupBookingId: string;
    bookingInterval: ThDateIntervalDO;
    bookingCapacity: ConfigCapacityDO;
}

export class HotelOperationsArrivalsInfo {
    arrivalInfoList: ArrivalItemInfo[];
    referenceDate: ThDateDO;

    constructor() {
        this.arrivalInfoList = [];
    }
}