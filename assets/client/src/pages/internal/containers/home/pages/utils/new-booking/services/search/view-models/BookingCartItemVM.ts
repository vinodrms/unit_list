import { ThUtils } from '../../../../../../../../../../common/utils/ThUtils';
import { ConfigCapacityDO } from '../../../../../../../../services/common/data-objects/bed-config/ConfigCapacityDO';
import { PriceProductDO } from '../../../../../../../../services/price-products/data-objects/PriceProductDO';
import { TransientBookingItem } from '../../data-objects/TransientBookingItem';
import { ThDateIntervalDO } from '../../../../../../../../services/common/data-objects/th-dates/ThDateIntervalDO';
import { CurrencyDO } from '../../../../../../../../services/common/data-objects/currency/CurrencyDO';
import { CustomerDO } from '../../../../../../../../services/customers/data-objects/CustomerDO';
import { HotelPaymentMethodsDO } from '../../../../../../../../services/settings/data-objects/HotelPaymentMethodsDO';
import { InvoicePaymentMethodType, InvoicePaymentMethodDO } from '../../../../../../../../services/invoices-deprecated/data-objects/payers/InvoicePaymentMethodDO';
import { HotelAggregatedPaymentMethodsDO } from "../../../../../../../../services/settings/data-objects/HotelAggregatedPaymentMethodsDO";
import { BookingDO } from "../../../../../../../../services/bookings/data-objects/BookingDO";
import { RoomCategoryDO } from "../../../../../../../../services/room-categories/data-objects/RoomCategoryDO";
import { BookingVM } from "../../../../../../../../services/bookings/view-models/BookingVM";
import { HotelAggregatedInfo } from "../../../../../../../../services/hotel/utils/HotelAggregatedInfo";
import { DefaultBillingDetailsDO } from "../../../../../../../../services/bookings/data-objects/default-billing/DefaultBillingDetailsDO";
import { ThTranslation } from "../../../../../../../../../../common/utils/localization/ThTranslation";
import { PricePerDayDO } from "../../../../../../../../services/bookings/data-objects/price/PricePerDayDO";

import * as _ from "underscore";

export interface BillingValidationResult {
    valid: boolean;
    errorMessage?: string;
}

export enum BookingCartItemVMType {
    NormalBooking,
    Total
}

export class BookingCartItemVM {
    public static OkFontName: string = "Z";
    public static OkClassName: string = "green-color";
    public static BadFontName: string = "+";
    public static BadClassName: string = "red-color";

    itemType: BookingCartItemVMType;
    cartSequenceId: number;
    uniqueId: string;
    bookingId: string;
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
    commision: number;
    commisionString: string;
    otherPrice: number;
    otherPriceString: string;
    pricePerDayList: PricePerDayDO[];
    conditionsString: string;
    constraintsString: string;
    customerNameString: string;
    validationColumnFontName: string;
    validationColumnClassName: string;

    transientBookingItem: TransientBookingItem;
    initialCustomerId: string;

    priceProduct: PriceProductDO;
    ccy: CurrencyDO;
    customerList: CustomerDO[];
    allowedPaymentMethods: HotelAggregatedPaymentMethodsDO;

    private _thUtils: ThUtils;

    constructor() {
        this._thUtils = new ThUtils();
    }

    public checkValidity(): BillingValidationResult {
        if (this.customerList.length == 0) {
            return this.buildBillingValidationResult(false, "Select a customer for the booking");
        }
        if (!_.contains(this.transientBookingItem.customerIdList, this.transientBookingItem.defaultBillingDetails.customerId)) {
            return this.buildBillingValidationResult(false, "Select a customer to bill the invoice to");
        }
        if (!this.priceProduct.conditions.policy.hasCancellationPolicy()) {
            return this.buildBillingValidationResult(true);
        }
        if (!this.transientBookingItem.defaultBillingDetails.paymentGuarantee) {
            return this.buildBillingValidationResult(false, "You must add a payment guarantee and a payment method because the price product has cancellation conditions.");
        }
        if (this.transientBookingItem.defaultBillingDetails.paymentMethod.type === InvoicePaymentMethodType.PayInvoiceByAgreement) {
            var customer = this.getCustomerById(this.transientBookingItem.defaultBillingDetails.customerId);
            if (!customer.customerDetails.canPayInvoiceByAgreement()) {
                return this.buildBillingValidationResult(false, "The selected customer does not support to pay the invoice by agreement.");
            }
        }
        return this.buildBillingValidationResult(true);
    }

    private buildBillingValidationResult(valid: boolean, errorMessage?: string): BillingValidationResult {
        return {
            valid: valid,
            errorMessage: errorMessage
        }
    }

    public getCustomerById(customerId: string): CustomerDO {
        return _.find(this.customerList, (customer: CustomerDO) => { return customer.id === customerId });
    }

    public isNew(): boolean {
        return this._thUtils.isUndefinedOrNull(this.bookingId);
    }

    public updateValidationColumn() {
        if (this.checkValidity().valid) {
            this.validationColumnFontName = BookingCartItemVM.OkFontName;
            this.validationColumnClassName = BookingCartItemVM.OkClassName;
            return;
        }
        this.validationColumnFontName = BookingCartItemVM.BadFontName;
        this.validationColumnClassName = BookingCartItemVM.BadClassName;
    }

    public addCustomerIfNotExists(customer: CustomerDO) {
        if (this.containsCustomer(customer)) { return; }
        this.customerList.push(customer);
        this.updateBookingCustomers();
    }
    public replaceCustomerIfNewOneNotExists(oldCustomer: CustomerDO, newCustomer: CustomerDO) {
        if (this.containsCustomer(newCustomer)) { return; }
        this.replaceCustomer(oldCustomer, newCustomer);
    }

    public updateCustomerIfExists(customer: CustomerDO) {
        if (!this.containsCustomer(customer)) { return; }
        this.replaceCustomer(customer, customer);
    }
    private replaceCustomer(oldCustomer: CustomerDO, newCustomer: CustomerDO) {
        var index = _.findIndex(this.customerList, (customer: CustomerDO) => { return customer.id === oldCustomer.id });
        if (index >= 0 && index < this.customerList.length) {
            this.customerList[index] = newCustomer;
        }
        this.updateBookingCustomers();
    }
    private containsCustomer(customer: CustomerDO): boolean {
        var foundCustomer = this.getCustomerById(customer.id);
        return !this._thUtils.isUndefinedOrNull(foundCustomer);
    }
    public didSelectBilledToCustomer(): boolean {
        return !this._thUtils.isUndefinedOrNull(this.transientBookingItem.defaultBillingDetails.customerId)
            && this.customerList.length > 0;
    }
    public removeBilledToCustomer() {
        this.transientBookingItem.defaultBillingDetails.customerId = null;
    }

    private updateBookingCustomers() {
        this.transientBookingItem.customerIdList = _.map(this.customerList, (customer: CustomerDO) => { return customer.id });
    }

    public getNumberOfCompaniesOrTravelAgencies(): number {
        var count = 0;
        _.forEach(this.customerList, (customer: CustomerDO) => {
            if (customer.isCompanyOrTravelAgency()) {
                count++;
            }
        });
        return count;
    }

    public isInitialCustomer(customer: CustomerDO): boolean {
        return this.initialCustomerId === customer.id;
    }

}
