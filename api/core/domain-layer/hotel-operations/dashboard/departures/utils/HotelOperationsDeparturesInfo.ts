import {ThDateDO} from '../../../../../utils/th-dates/data-objects/ThDateDO';
import {ThDateIntervalDO} from '../../../../../utils/th-dates/data-objects/ThDateIntervalDO';
import {ConfigCapacityDO} from '../../../../../data-layer/common/data-objects/bed-config/ConfigCapacityDO';

export enum DeparturelItemBookingStatus {
    CanCheckOut,
    CanNotCheckOut
}

export interface DeparturelItemInfo {
    customerId: string;
    customerName?: string;
    corporateCustomerId?: string;
    corporateCustomerName?: string;

    bookingId?: string;
    groupBookingId?: string;
    bookingInterval?: ThDateIntervalDO;
    bookingCapacity?: ConfigCapacityDO;
    roomCategoryId?: string;
    roomId?: string;
    bookingItemStatus: DeparturelItemBookingStatus;

    invoiceGroupId?: string;
    invoiceId?: string;
    invoicePrice?: number;
    bookingNotes?: string;
}

export class HotelOperationsDeparturesInfo {
    departureInfoList: DeparturelItemInfo[];
    referenceDate: ThDateDO;

    constructor() {
        this.departureInfoList = [];
    }
}