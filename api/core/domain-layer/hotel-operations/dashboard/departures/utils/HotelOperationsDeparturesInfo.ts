import { ThDateDO } from '../../../../../utils/th-dates/data-objects/ThDateDO';
import { ThDateIntervalDO } from '../../../../../utils/th-dates/data-objects/ThDateIntervalDO';
import { ConfigCapacityDO } from '../../../../../data-layer/common/data-objects/bed-config/ConfigCapacityDO';
import { BaseDO } from "../../../../../data-layer/common/base/BaseDO";

export enum DeparturelItemBookingStatus {
    CanCheckOut,
    CanNotCheckOut
}

export class DepartureItemCustomerInfo extends BaseDO {
    customerId: string;
    customerName: string;

    protected getPrimitivePropertyKeys(): string[] {
        return ["customerId", "customerName"];
    }
}

export interface DeparturelItemInfo {
    customerId: string;
    customerName?: string;
    corporateCustomerId?: string;
    corporateCustomerName?: string;

    guestCustomerInfoList?: DepartureItemCustomerInfo[];

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
    billedCustomerId?: string;
    isBookingBilledToCompany?: boolean;
}

export class HotelOperationsDeparturesInfo {
    departureInfoList: DeparturelItemInfo[];
    referenceDate: ThDateDO;
    totalDeparturesForReferenceDate: number;

    constructor() {
        this.departureInfoList = [];
        this.totalDeparturesForReferenceDate = 0;
    }
}
