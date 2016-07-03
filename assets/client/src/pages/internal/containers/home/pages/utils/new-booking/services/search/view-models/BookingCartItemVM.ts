import {ConfigCapacityDO} from '../../../../../../../../services/common/data-objects/bed-config/ConfigCapacityDO';
import {PriceProductDO} from '../../../../../../../../services/price-products/data-objects/PriceProductDO';
import {TransientBookingItem} from '../../data-objects/TransientBookingItem';
import {ThDateIntervalDO} from '../../../../../../../../services/common/data-objects/th-dates/ThDateIntervalDO';
import {CurrencyDO} from '../../../../../../../../services/common/data-objects/currency/CurrencyDO';
import {CustomerDO} from '../../../../../../../../services/customers/data-objects/CustomerDO';

export enum BookingCartItemVMType {
    NormalBooking,
    Total
}

export class BookingCartItemVM {
    itemType: BookingCartItemVMType;
    cartSequenceId: number;
    uniqueId: string;
    priceProductName: string;
    roomCategoryName: string;
    roomCapacity: ConfigCapacityDO;
    bookingCapacity: ConfigCapacityDO;
    bookingInterval: ThDateIntervalDO;
    noAvailableRooms: number;
    noAvailableAllotments: number;
    noAvailableAllotmentsString: string;
    totalPrice: number;
    totalPriceString: string;
    conditionsString: string;
    constraintsString: string;
    customerNameString: string;

    transientBookingItem: TransientBookingItem;
    canChangeDefaultBillableCustomer: boolean;

    priceProduct: PriceProductDO;
    ccy: CurrencyDO;
    customerList: CustomerDO[];

    public get billableCustomerIsConfigured(): boolean {
        return this.customerList.length > 0 && _.isString(this.transientBookingItem.defaultBillingDetails.customerId);
    }
}