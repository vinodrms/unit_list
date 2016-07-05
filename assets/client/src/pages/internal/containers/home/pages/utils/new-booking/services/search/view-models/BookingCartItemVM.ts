import {ThUtils} from '../../../../../../../../../../common/utils/ThUtils';
import {ConfigCapacityDO} from '../../../../../../../../services/common/data-objects/bed-config/ConfigCapacityDO';
import {PriceProductDO} from '../../../../../../../../services/price-products/data-objects/PriceProductDO';
import {TransientBookingItem} from '../../data-objects/TransientBookingItem';
import {ThDateIntervalDO} from '../../../../../../../../services/common/data-objects/th-dates/ThDateIntervalDO';
import {CurrencyDO} from '../../../../../../../../services/common/data-objects/currency/CurrencyDO';
import {CustomerDO} from '../../../../../../../../services/customers/data-objects/CustomerDO';
import {HotelPaymentMethodsDO} from '../../../../../../../../services/settings/data-objects/HotelPaymentMethodsDO';
import {InvoicePaymentMethodType} from '../../../../../../../../services/invoices/data-objects/payers/InvoicePaymentMethodDO';

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
    validationColumnFontName: string;
    validationColumnClassName: string;

    transientBookingItem: TransientBookingItem;
    canChangeDefaultBilledCustomer: boolean;

    priceProduct: PriceProductDO;
    ccy: CurrencyDO;
    customerList: CustomerDO[];
    allowedPaymentMethods: HotelPaymentMethodsDO;

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
    public replaceCustomer(oldCustomer: CustomerDO, newCustomer: CustomerDO) {
        if (this.containsCustomer(newCustomer)) { return; }
        var index = _.findIndex(this.customerList, (customer: CustomerDO) => { return customer.id === oldCustomer.id });
        if (index >= 0 && index < this.customerList.length) {
            this.customerList[index] = newCustomer;
        }
        this.updateBookingCustomers();
    }
    private containsCustomer(customer: CustomerDO): boolean {
        var thUtils = new ThUtils();
        var foundCustomer = this.getCustomerById(customer.id);
        return !thUtils.isUndefinedOrNull(foundCustomer);
    }

    private updateBookingCustomers() {
        this.transientBookingItem.customerIdList = _.map(this.customerList, (customer: CustomerDO) => { return customer.id });
    }
}