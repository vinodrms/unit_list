import {ThDateIntervalDO} from '../../../../../utils/th-dates/data-objects/ThDateIntervalDO';
import {ConfigCapacityDO} from '../../../../../data-layer/common/data-objects/bed-config/ConfigCapacityDO';

export interface DeparturelItemInfo {
    customerId: string;
    customerName?: string;

    bookingId?: string;
    groupBookingId?: string;
    bookingInterval?: ThDateIntervalDO;
    bookingCapacity?: ConfigCapacityDO;
    roomCategoryId?: string;
    roomId?: string;

    invoiceGroupId?: string;
}

export class HotelOperationsDeparturesInfo {
    departureInfoList: DeparturelItemInfo[];

    constructor() {
        this.departureInfoList = [];
    }
}