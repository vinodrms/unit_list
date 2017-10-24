import * as _ from 'underscore';
import { BaseDO } from '../../../../../../../common/base/BaseDO';
import { ConfigCapacityDO } from '../../../../common/data-objects/bed-config/ConfigCapacityDO';
import { ThDateIntervalDO } from '../../../../common/data-objects/th-dates/ThDateIntervalDO';

export enum DepartureItemBookingStatus {
    CanCheckOut,
    CanNotCheckOut
}

export class DepartureItemCustomerInfoDO extends BaseDO {
    customerId: string;
    customerName: string;

    protected getPrimitivePropertyKeys(): string[] {
        return ["customerId", "customerName"];
    }
}

export class DepartureItemInfoDO extends BaseDO {
    customerId: string;
    customerName: string;
    corporateCustomerId: string;
    corporateCustomerName: string;

    guestCustomerInfoList?: DepartureItemCustomerInfoDO[];

    bookingId: string;
    groupBookingId: string;
    bookingInterval: ThDateIntervalDO;
    bookingCapacity: ConfigCapacityDO;
    roomCategoryId: string;
    roomId: string;
    bookingItemStatus: DepartureItemBookingStatus;

    invoiceGroupId: string;
    invoiceId: string;
    invoicePrice: number;

    bookingNotes: string;
    isBookingBilledToCompany: boolean;

    protected getPrimitivePropertyKeys(): string[] {
        return ["customerId", "customerName", "corporateCustomerId", "corporateCustomerName", "bookingId", "groupBookingId", "roomCategoryId", "roomId", "bookingItemStatus", "invoiceGroupId", "invoiceId", "invoicePrice", "bookingNotes", "isBookingBilledToCompany"];
    }
    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.guestCustomerInfoList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "guestCustomerInfoList"), (guestCustomerInfo: Object) => {
            let customerInfo = new DepartureItemCustomerInfoDO();
            customerInfo.buildFromObject(guestCustomerInfo);

            this.guestCustomerInfoList.push(customerInfo);
        });

        this.bookingInterval = new ThDateIntervalDO();
        this.bookingInterval.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "bookingInterval"));

        this.bookingCapacity = new ConfigCapacityDO();
        this.bookingCapacity.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "bookingCapacity"));
    }

    public hasCustomer(): boolean {
        return _.isString(this.customerId) && this.customerId.length > 0;
    }
}
