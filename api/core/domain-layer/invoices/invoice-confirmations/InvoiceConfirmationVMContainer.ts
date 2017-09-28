import { ThTranslation } from '../../../utils/localization/ThTranslation';
import { ThUtils } from '../../../../core/utils/ThUtils';
import { HotelDO } from '../../../data-layer/hotel/data-objects/HotelDO';
import { CustomerDO } from '../../../data-layer/customers/data-objects/CustomerDO';
import { AddressDO } from '../../../data-layer/common/data-objects/address/AddressDO';
import { PaymentMethodDO } from '../../../data-layer/common/data-objects/payment-method/PaymentMethodDO';
import { InvoiceAggregatedData } from '../aggregators/InvoiceAggregatedData';
import { BookingConfirmationVMContainer } from '../../bookings/booking-confirmations/BookingConfirmationVMContainer';
import { BookingPriceDO } from "../../../data-layer/bookings/data-objects/price/BookingPriceDO";
import { PricePerDayDO } from "../../../data-layer/bookings/data-objects/price/PricePerDayDO";
import { TransactionFeeDO, TransactionFeeType } from "../../../data-layer/common/data-objects/payment-method/TransactionFeeDO";
import { InvoiceItemVM } from "./InvoiceItemVM";
import { InvoiceItemDO, InvoiceItemType } from "../../../data-layer/invoices/data-objects/items/InvoiceItemDO";
import { AddOnProductInvoiceItemMetaDO } from "../../../data-layer/invoices/data-objects/items/add-on-products/AddOnProductInvoiceItemMetaDO";
import { InvoicePaymentStatus, InvoiceDO, InvoiceAccountingType } from "../../../data-layer/invoices/data-objects/InvoiceDO";
import { InvoicePaymentMethodType } from "../../../data-layer/invoices/data-objects/payer/InvoicePaymentMethodDO";
import { InvoicePayerDO } from "../../../data-layer/invoices/data-objects/payer/InvoicePayerDO";
import { ThDateUtils } from "../../../utils/th-dates/ThDateUtils";
import { InvoicePaymentDO } from "../../../data-layer/invoices/data-objects/payer/InvoicePaymentDO";
import { BookingDO } from "../../../data-layer/bookings/data-objects/BookingDO";
import { RoomDO } from "../../../data-layer/rooms/data-objects/RoomDO";

import _ = require('underscore');


export class InvoiceConfirmationVMContainer {
    private static DEFAULT_VALUE_IF_EMPTY: string = '';
    private static PAY_INVOICE_BY_AGREEMENT_STR: string = 'PAY INVOICE BY AGREEMENT';
    private static LOSS_ACCEPTED_BY_MANAGEMENT_STR: string = 'LOSS ACCEPTED BY MANAGEMENT';

    private _thUtils: ThUtils;
    private _thDateUtils: ThDateUtils;

    private _invoiceAggregatedData: InvoiceAggregatedData;

    hotelLogoSrcValue: string;
    invoiceReference: string;
    payerIndex: number;
    ccySymbol: string;
    unitpalLogoSrcValue: string;

    invoiceLabel: string;
    dateLabel: string;
    dateValue: string;

    addFieldName1: string;
    addFieldValue1: string;

    fromLabel: string;
    hotelNameValue: string;
    hotelAddressFirstLineValue: string;
    hotelAddressSecondLineValue: string;
    hotelPhoneValue: string;
    hotelPhoneLabel: string;
    hotelEmailValue: string;
    hotelEmailLabel: string;
    hotelWebsite: string;
    additionalInvoiceDetails: string;

    toLabel: string;
    payerNameValue: string;
    payerAddressFirstLineValue: string;
    payerAddressSecondLineValue: string;
    payerContactLabel: string;
    payerContactValue: string;
    payerVatCodeLabel: string;
    payerVatCodeValue: string;
    payerGovernmentCodeLabel: string;
    payerGovernmentCodeValue: string;
    additionalPayerDetails: string;
    notesFromBooking: string;

    itemLabel: string;
    qtyLabel: string;
    netUnitPriceLabel: string;
    vatLabel: string;
    subtotalLabel: string;
    itemVMList: InvoiceItemVM[];

    paymentMethodLabel: string;
    paymentMethodValues: string[];
    transactionFeeLabel: string;
    transactionFeeValues: string[];
    subtotalPerPaymentMethod: number[];

    subtotalValue: number;
    subtotalValueFormatted: string;
    totalVat: number;
    totalVatFormatted: string;
    totalLabel: string;
    totalValue: number;
    totalValueFormatted: string;

    hotelVatLabel: string;
    hotelVatValue: string;

    externalBookingReferenceLabel: string;
    externalBookingReferenceValues: string[];
    bookingReferenceLabel: string;
    bookingReferenceValues: string[];
    roomNameLabel: string;
    roomNameValues: string[];

    constructor(private _thTranslation: ThTranslation) {
        this._thUtils = new ThUtils();
        this._thDateUtils = new ThDateUtils();
    }

    public buildFromInvoiceAggregatedDataContainer(invoiceAggregatedData: InvoiceAggregatedData) {
        this._invoiceAggregatedData = invoiceAggregatedData;

        this.invoiceReference = this._invoiceAggregatedData.invoice.reference;
        this.payerIndex = this._invoiceAggregatedData.payerIndexOnInvoice;
        this.ccySymbol = this._invoiceAggregatedData.ccySymbol;
        this.unitpalLogoSrcValue = BookingConfirmationVMContainer.UNITPAL_LOGO_SRC;

        this.initLogoSrcs();
        this.initHeaderLabelsAndValues();
        this.initHotelInfoLabelsAndValues();
        this.initPayerInfoLabelsAndValues();
        this.initNotesFromBooking();
        this.initItemsTableLabelsAndValues();
        this.initPaymentMethodLabelsAndValues();
        this.initTotalValues();
        this.initAdditionalFields();
        this.initHotelVatLabelAndValue();
        this.initBookingInformationLabelsAndValues();
    }
    private initBookingInformationLabelsAndValues() {
        this.bookingReferenceLabel = this._thTranslation.translate('Booking Reference');
        this.externalBookingReferenceLabel = this._thTranslation.translate('External Booking Reference');
        this.roomNameLabel = this._thTranslation.translate("Room");
        this.externalBookingReferenceValues = [];
        this.bookingReferenceValues = [];

        if (!this._thUtils.isUndefinedOrNull(this._invoiceAggregatedData.bookingAttachments.bookings)
            && this._invoiceAggregatedData.bookingAttachments.bookings.length > 0) {
            let bookings = this._invoiceAggregatedData.bookingAttachments.bookings;
            _.forEach(bookings, (booking: BookingDO) => {
                if (booking.externalBookingReference) {
                    this.externalBookingReferenceValues.push(booking.externalBookingReference);
                }
            });
            _.forEach(bookings, (booking: BookingDO) => {
                if (booking.bookingReference) {
                    this.bookingReferenceValues.push(booking.displayedReservationNumber);
                }
            });
        }
        this.roomNameValues = [];
        if (!this._thUtils.isUndefinedOrNull(this._invoiceAggregatedData.bookingAttachments.rooms)
            && this._invoiceAggregatedData.bookingAttachments.rooms.length > 0) {
            this.roomNameValues = _.map(this._invoiceAggregatedData.bookingAttachments.rooms, (room: RoomDO) => { return room.name; });
        }
    }
    private initLogoSrcs() {
        if (!this._thUtils.isUndefinedOrNull(this._invoiceAggregatedData.hotel.logoUrl)) {
            this.hotelLogoSrcValue = this._invoiceAggregatedData.hotel.logoUrl;
        }
        else {
            this.hotelLogoSrcValue = BookingConfirmationVMContainer.HOTEL_LOGO_PLACEHOLDER_SRC;
        }
        this.unitpalLogoSrcValue = BookingConfirmationVMContainer.UNITPAL_LOGO_SRC;
    }

    private initHeaderLabelsAndValues() {
        this.invoiceLabel = this._thTranslation.translate('Invoice');
        this.dateLabel = this._thTranslation.translate('Date');
        let thTimestamp = this._thDateUtils.convertTimestampToLocalThTimestamp(this._invoice.paidTimestamp, this._invoiceAggregatedData.hotel.timezone);
        this.dateValue = thTimestamp.thDateDO.toString();
    }

    private initHotelInfoLabelsAndValues() {
        this.fromLabel = this._thTranslation.translate('From');
        this.hotelNameValue = this.formatValue(this._hotel.contactDetails.name);
        this.hotelAddressFirstLineValue = this.getFormattedAddressFirstLine(this._hotel.contactDetails.address);
        this.hotelAddressSecondLineValue = this.getFormattedAddressSecondLine(this._hotel.contactDetails.address);
        this.hotelPhoneLabel = this._thTranslation.translate("Phone");
        this.hotelPhoneValue = this._hotel.contactDetails.phone;
        this.hotelEmailLabel = this._thTranslation.translate("Email");
        this.hotelEmailValue = this._hotel.contactDetails.email;

        this.hotelWebsite = "";
        if (_.isString(this._hotel.contactDetails.websiteUrl) && this._hotel.contactDetails.websiteUrl.length > 0) {
            this.hotelWebsite = this._hotel.contactDetails.websiteUrl;
        }
        this.additionalInvoiceDetails = "";
        if (_.isString(this._hotel.additionalInvoiceDetails) && this._hotel.additionalInvoiceDetails.length > 0) {
            this.additionalInvoiceDetails = this._hotel.additionalInvoiceDetails;
        }
    }

    private initPayerInfoLabelsAndValues() {
        this.toLabel = this._thTranslation.translate('To');
        this.payerNameValue = this.formatValue(this._payerCustomer.customerDetails.getName());
        this.payerAddressFirstLineValue = this.getFormattedAddressFirstLine(this._payerCustomer.customerDetails.getAddress());
        this.payerAddressSecondLineValue = this.getFormattedAddressSecondLine(this._payerCustomer.customerDetails.getAddress());
        this.payerContactLabel = this._thTranslation.translate('Contact');
        this.payerContactValue = "";
        var phone = (this._payerCustomer.customerDetails.getContactDetailsList() && this._payerCustomer.customerDetails.getContactDetailsList().length > 0) ?
            this._payerCustomer.customerDetails.getContactDetailsList()[0].phone : "";
        if (_.isString(phone) && phone.length > 0) {
            this.payerContactValue += phone;
        }

        var email = (this._payerCustomer.customerDetails.getContactDetailsList() && this._payerCustomer.customerDetails.getContactDetailsList().length > 0) ?
            this._payerCustomer.customerDetails.getContactDetailsList()[0].email : "";
        if (_.isString(email) && email.length > 0) {
            this.payerContactValue += (this.payerContactValue.length > 0) ? " / " : "";
            this.payerContactValue += email;
        }
        this.payerVatCodeLabel = this._thTranslation.translate('VAT');
        this.payerVatCodeValue = this._payerCustomer.customerDetails.getVatCode();
        if (!_.isString(this.payerVatCodeValue)) {
            this.payerVatCodeValue = "";
        }
        this.payerGovernmentCodeLabel = this._thTranslation.translate('Government Code');
        this.payerGovernmentCodeValue = this._payerCustomer.customerDetails.getGovernmentCode();
        if (!_.isString(this.payerGovernmentCodeValue)) {
            this.payerGovernmentCodeValue = "";
        }
        this.additionalPayerDetails = "";
        var payer = this._invoice.payerList[this.payerIndex];
        // if (_.isString(payer.additionalInvoiceDetails)) {
        //      this.additionalPayerDetails = payer.additionalInvoiceDetails;
        //  }
    }

    private initNotesFromBooking() {
        this.notesFromBooking = "";
        if (_.isString(this._invoice.notesFromBooking) && this._invoice.notesFromBooking) {
            this.notesFromBooking = this._invoice.notesFromBooking;
        }
    }

    private initItemsTableLabelsAndValues() {
        this.itemLabel = this._thTranslation.translate('Item');
        this.qtyLabel = this._thTranslation.translate('Qty');
        this.netUnitPriceLabel = this._thTranslation.translate('Net Unit Price');
        this.vatLabel = this._thTranslation.translate('VAT');
        this.subtotalLabel = this._thTranslation.translate('Net Subtotal');

        this.itemVMList = [];
        this.totalVat = 0;
        this.subtotalValue = 0;
        _.forEach(this._invoice.itemList, (itemDO: InvoiceItemDO) => {
            var invoiceItemVM = new InvoiceItemVM(this._thTranslation);
            invoiceItemVM.buildFromInvoiceItemDO(itemDO, this._invoiceAggregatedData.vatList, this._invoice.accountingType);

            if (this.displayBookingDateBreakdown(itemDO)) {
                let bookingInvoiceItems = this.getBookingDateBreakdownItems(itemDO, this._invoice.accountingType);
                this.itemVMList = this.itemVMList.concat(bookingInvoiceItems);
            }
            else {
                this.itemVMList.push(invoiceItemVM);
            }
        });

        this.totalVat = this._thUtils.roundNumberToTwoDecimals(this.totalVat + _.reduce(this.itemVMList, function (sum, itemVM: InvoiceItemVM) { return sum + itemVM.vat; }, 0));
        this.subtotalValue = this._thUtils.roundNumberToTwoDecimals(this.subtotalValue + _.reduce(this.itemVMList, function (sum, itemVM: InvoiceItemVM) { return sum + itemVM.subtotal; }, 0));

        _.each(this.invoicePayer.paymentList, (payment: InvoicePaymentDO, index: number) => {
            if (this.hasTransactionFee(payment)) {
                let transactionFeeInvoiceItemVM = this.getTransactonFeeInvoiceItem(payment);
                this.itemVMList.push(transactionFeeInvoiceItemVM);

                this.totalVat = this._thUtils.roundNumberToTwoDecimals(this.totalVat + transactionFeeInvoiceItemVM.vat);
                this.subtotalValue = this._thUtils.roundNumberToTwoDecimals(this.subtotalValue + transactionFeeInvoiceItemVM.subtotal);
                this.totalValue = this._thUtils.roundNumberToTwoDecimals(this.subtotalValue + transactionFeeInvoiceItemVM.subtotal);
            }
        });


        if (this.itemVMList.length > 0) {
            this.itemVMList[this.itemVMList.length - 1].isLastOne = true;
        }

        this.subtotalValueFormatted = this._thUtils.formatNumberToTwoDecimals(this.subtotalValue);
        this.totalVatFormatted = this._thUtils.formatNumberToTwoDecimals(this.totalVat);
    }
    private getTransactonFeeInvoiceItem(payment: InvoicePaymentDO): InvoiceItemVM {
        let transactionFee = this._thUtils.roundNumberToTwoDecimals(payment.amountPlusTransactionFee - payment.amount);
        var invoiceItemVM = new InvoiceItemVM(this._thTranslation);
        invoiceItemVM.qty = 1;
        invoiceItemVM.name = this._thTranslation.translate("Transaction fee");

        let vatValue = 0;
        invoiceItemVM.vat = this._thUtils.roundNumberToTwoDecimals(transactionFee - (transactionFee / (1 + vatValue)));
        invoiceItemVM.netUnitPrice = this._thUtils.roundNumberToTwoDecimals(transactionFee - invoiceItemVM.vat);
        invoiceItemVM.subtotal = invoiceItemVM.netUnitPrice;
        invoiceItemVM.vatPercentage = this._thUtils.roundNumberToTwoDecimals(vatValue * 100);

        invoiceItemVM.formatPrices();
        return invoiceItemVM;
    }
    private displayBookingDateBreakdown(invoiceItemDO: InvoiceItemDO): boolean {
        if (!(invoiceItemDO.type === InvoiceItemType.Booking)) {
            return false;
        }
        let bookingPrice: BookingPriceDO = <BookingPriceDO>invoiceItemDO.meta;
        return !bookingPrice.isPenalty();
    }
    private getBookingDateBreakdownItems(itemDO: InvoiceItemDO, accountingType: InvoiceAccountingType): InvoiceItemVM[] {
        let bookingPrice: BookingPriceDO = <BookingPriceDO>itemDO.meta;

        let invoiceItemVMList: InvoiceItemVM[] = [];
        bookingPrice.roomPricePerNightList.forEach((pricePerDay: PricePerDayDO) => {
            let aopItemMeta = new AddOnProductInvoiceItemMetaDO();
            aopItemMeta.aopDisplayName = this._thTranslation.translate("Accomodation for %date%", { date: pricePerDay.thDate.toString() });
            aopItemMeta.numberOfItems = 1;
            aopItemMeta.pricePerItem = pricePerDay.price;
            aopItemMeta.vatId = bookingPrice.vatId;

            let item = new InvoiceItemDO();
            item.type = InvoiceItemType.AddOnProduct;
            item.meta = aopItemMeta;

            var invoiceItemVM = new InvoiceItemVM(this._thTranslation);
            invoiceItemVM.buildFromInvoiceItemDO(item, this._invoiceAggregatedData.vatList, accountingType);

            invoiceItemVMList.push(invoiceItemVM);
        });
        return invoiceItemVMList;
    }

    private initPaymentMethodLabelsAndValues() {
        this.paymentMethodLabel = this._thTranslation.translate('Payment Method');
        this.transactionFeeLabel = this._thTranslation.translate("transaction fee");
        this.transactionFeeValues = [];
        _.each(this.invoicePayer.paymentList, (payment: InvoicePaymentDO, index: number) => {
            this.transactionFeeValues[index] = (this.transactionFeeIsFlat(payment) ? this.getTransactionFee(payment).amount : this.getTransactionFee(payment).amount * 100).toString();
        });

        this.paymentMethodValues = [];
        this.subtotalPerPaymentMethod = [];
        if (this._invoice.paymentStatus === InvoicePaymentStatus.LossAcceptedByManagement) {
            this.paymentMethodValues[0] = this._thTranslation.translate(InvoiceConfirmationVMContainer.LOSS_ACCEPTED_BY_MANAGEMENT_STR);
            return;
        }
        _.each(this.invoicePayer.paymentList, (payment: InvoicePaymentDO, index: number) => {
            if (payment.paymentMethod.type === InvoicePaymentMethodType.DefaultPaymentMethod) {
                this.paymentMethodValues[index] = _.find(this._paymentMethodList, (pm: PaymentMethodDO) => {
                    return pm.id === payment.paymentMethod.value;
                }).name;
            }
            else {
                this.paymentMethodValues[index] = this._thTranslation.translate(InvoiceConfirmationVMContainer.PAY_INVOICE_BY_AGREEMENT_STR);
            }
            this.subtotalPerPaymentMethod[index] = this._thUtils.roundNumberToTwoDecimals(payment.amount);
        });
    }

    public get invoicePayer(): InvoicePayerDO {
        return this._invoice.payerList[this.payerIndex];
    }

    public getTransactionFee(payment: InvoicePaymentDO): TransactionFeeDO {
        return payment.transactionFeeSnapshot;
    }

    public hasTransactionFee(payment: InvoicePaymentDO): boolean {
        return payment.shouldApplyTransactionFee && this.getTransactionFee(payment).amount > 0;
    }

    public transactionFeeIsFlat(payment: InvoicePaymentDO): boolean {
        return this.getTransactionFee(payment).type === TransactionFeeType.Fixed;
    }

    private initTotalValues() {
        this.totalLabel = this._thTranslation.translate('Total');
        this.totalValue = this._thUtils.roundNumberToTwoDecimals(this.invoicePayer.totalAmountPlusTransactionFee);
        this.totalValueFormatted = this._thUtils.formatNumberToTwoDecimals(this.totalValue);
    }

    private initAdditionalFields() {
        this.addFieldName1 = "";
        this.addFieldValue1 = "";
        if (this._invoiceAggregatedData.bookingAttachments.exists) {
            this.addFieldName1 = this._thTranslation.translate("Guests");
            this.addFieldValue1 = this.getGuestListString();
        }
    }

    private getGuestListString(): string {
        var guestListString: string = "";
        _.forEach(this._invoiceAggregatedData.bookingAttachments.guests, (customer: CustomerDO, index: number) => {
            guestListString += customer.customerDetails.getName();
            if (index < this._invoiceAggregatedData.bookingAttachments.guests.length - 1) {
                guestListString += ", ";
            }
        });
        return guestListString;
    }

    private initHotelVatLabelAndValue() {
        this.hotelVatLabel = this._thTranslation.translate('VAT');
        this.hotelVatValue = this._invoiceAggregatedData.hotel.contactDetails.vatCode;
    }

    private get _invoice(): InvoiceDO {
        return this._invoiceAggregatedData.invoice;
    }
    private get _payerCustomer(): CustomerDO {
        return this._invoiceAggregatedData.payerCustomer;
    }
    private get _paymentMethodList(): PaymentMethodDO[] {
        return this._invoiceAggregatedData.paymentMethodList;
    }
    private get _hotel(): HotelDO {
        return this._invoiceAggregatedData.hotel;
    }
    private getFormattedAddressFirstLine(addressDO: AddressDO): string {
        return this.formatValue(addressDO.streetAddress);
    }
    private getFormattedAddressSecondLine(addressDO: AddressDO): string {
        var formattedSecondLine = '';
        if (!this._thUtils.isUndefinedOrNull(addressDO.city)) {
            formattedSecondLine += addressDO.city;
        }
        if (!this._thUtils.isUndefinedOrNull(addressDO.postalCode)) {
            if (formattedSecondLine.length > 0) {
                formattedSecondLine += ', ';
            }
            formattedSecondLine += addressDO.postalCode;
        }
        if (!this._thUtils.isUndefinedOrNull(addressDO.country) && !this._thUtils.isUndefinedOrNull(addressDO.country.name)) {
            if (formattedSecondLine.length > 0) {
                formattedSecondLine += ', ';
            }
            formattedSecondLine += addressDO.country.name;
        }
        return this.formatValue(formattedSecondLine);
    }
    private formatValue(value: string): string {
        if (!this._thUtils.isUndefinedOrNull(value) && value != '') {
            return value;
        }
        return InvoiceConfirmationVMContainer.DEFAULT_VALUE_IF_EMPTY;
    }
}
