import {BaseDO} from '../../../../../../../common/base/BaseDO';
import {ConfigCapacityDO} from '../../../../common/data-objects/bed-config/ConfigCapacityDO';
import {ThDateIntervalDO} from '../../../../common/data-objects/th-dates/ThDateIntervalDO';

export enum DepartureItemBookingStatus {
    CanCheckOut,
    CanNotCheckOut
}

export class DepartureItemInfoDO extends BaseDO {
    customerId: string;
    customerName: string;

    bookingId: string;
    groupBookingId: string;
    bookingInterval: ThDateIntervalDO;
    bookingCapacity: ConfigCapacityDO;
    roomCategoryId: string;
    roomId: string;
    bookingItemStatus: DepartureItemBookingStatus;

    invoiceGroupId: string;
    invoicePrice: number;

    protected getPrimitivePropertyKeys(): string[] {
        return ["customerId", "customerName", "bookingId", "groupBookingId", "roomCategoryId", "roomId", "bookingItemStatus", "invoiceGroupId", "invoicePrice"];
    }
    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.bookingInterval = new ThDateIntervalDO();
        this.bookingInterval.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "bookingInterval"));

        this.bookingCapacity = new ConfigCapacityDO();
        this.bookingCapacity.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "bookingCapacity"));
    }
}