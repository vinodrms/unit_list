import {BaseDO} from '../../../../../../../common/base/BaseDO';
import {ConfigCapacityDO} from '../../../../common/data-objects/bed-config/ConfigCapacityDO';
import {ThDateIntervalDO} from '../../../../common/data-objects/th-dates/ThDateIntervalDO';

export enum ArrivalItemStatus {
    NoShow,
    NoPaymentGuarantee,
    CanCheckIn
}

export class ArrivalItemInfoDO extends BaseDO {
    itemStatus: ArrivalItemStatus;
    roomCategoryId: string;
    reservedRoomId: string;

    customerId: string;
    customerName: string;
    corporateCustomerId: string;
    corporateCustomerName: string;

    bookingId: string;
    groupBookingId: string;
    bookingInterval: ThDateIntervalDO;
    bookingCapacity: ConfigCapacityDO;
    bookingNotes: string;

    protected getPrimitivePropertyKeys(): string[] {
        return ["itemStatus", "roomCategoryId", "reservedRoomId", "customerId", "customerName", "corporateCustomerId","corporateCustomerName", "bookingId", "groupBookingId", "bookingNotes"];
    }
    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.bookingInterval = new ThDateIntervalDO();
        this.bookingInterval.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "bookingInterval"));

        this.bookingCapacity = new ConfigCapacityDO();
        this.bookingCapacity.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "bookingCapacity"));
    }
}