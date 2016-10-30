import { ThTranslation } from '../../../utils/localization/ThTranslation';
import { ThUtils } from '../../../../core/utils/ThUtils';
import { HotelDO } from '../../../data-layer/hotel/data-objects/HotelDO';
import { CustomerDO } from '../../../data-layer/customers/data-objects/CustomerDO';
import { AddressDO } from '../../../data-layer/common/data-objects/address/AddressDO';
import { PaymentMethodDO } from '../../../data-layer/common/data-objects/payment-method/PaymentMethodDO';
import { InvoiceDO } from '../../../data-layer/invoices/data-objects/InvoiceDO';
import { InvoiceItemDO } from '../../../data-layer/invoices/data-objects/items/InvoiceItemDO';
import { InvoiceItemVM } from './InvoiceItemVM';
import { InvoicePaymentMethodType } from '../../../data-layer/invoices/data-objects/payers/InvoicePaymentMethodDO';
import { InvoiceAggregatedData } from '../aggregators/InvoiceAggregatedData';
import { BookingConfirmationVMContainer } from '../../bookings/booking-confirmations/BookingConfirmationVMContainer';

import _ = require('underscore');

export class InvoiceConfirmationVMContainer {
    private static DEFAULT_VALUE_IF_EMPTY: string = '';
    private static PAY_INVOICE_BY_AGREEMENT_STR: string = 'PAY INVOICE BY AGREEMENT';
    private _thUtils: ThUtils;

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

    itemLabel: string;
    qtyLabel: string;
    netUnitPriceLabel: string;
    vatLabel: string;
    subtotalLabel: string;
    itemVMList: InvoiceItemVM[];

    paymentMethodLabel: string;
    paymentMethodValue: string;

    subtotalValue: number;
    totalVat: number;
    totalLabel: string;
    totalValue: number;

    hotelVatLabel: string;
    hotelVatValue: string;

    constructor(private _thTranslation: ThTranslation) {
        this._thUtils = new ThUtils();
    }

    public buildFromInvoiceAggregatedDataContainer(invoiceAggregatedData: InvoiceAggregatedData) {
        this._invoiceAggregatedData = invoiceAggregatedData;

        this.invoiceReference = this._invoiceAggregatedData.invoice.invoiceReference;
        this.payerIndex = this._invoiceAggregatedData.payerIndexOnInvoice;
        this.ccySymbol = this._invoiceAggregatedData.ccySymbol;
        this.unitpalLogoSrcValue = BookingConfirmationVMContainer.UNITPAL_LOGO_SRC;

        this.initLogoSrcs();
        this.initHeaderLabelsAndValues();
        this.initHotelInfoLabelsAndValues();
        this.initPayerInfoLabelsAndValues();
        this.initItemsTableLabelsAndValues();
        this.initPaymentMethodLabelsAndValues();
        this.initTotalValues();
        this.initAdditionalFields();
        this.initHotelVatLabelAndValue();
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
        this.dateValue = this._invoice.paidDate.toString();
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
        var phone = this._payerCustomer.customerDetails.getPhone();
        if (_.isString(phone) && phone.length > 0) {
            this.payerContactValue += phone;
        }

        var email = this._payerCustomer.customerDetails.getEmail();
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
        if (_.isString(payer.additionalInvoiceDetails)) {
            this.additionalPayerDetails = payer.additionalInvoiceDetails;
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
            invoiceItemVM.buildFromInvoiceItemDO(itemDO, this._invoiceAggregatedData.vatList);
            this.itemVMList.push(invoiceItemVM);

            this.totalVat = this._thUtils.roundNumberToTwoDecimals(this.totalVat + invoiceItemVM.vat);
            this.subtotalValue = this._thUtils.roundNumberToTwoDecimals(this.subtotalValue + invoiceItemVM.subtotal);
        })
        if (this.itemVMList.length > 0) {
            this.itemVMList[this.itemVMList.length - 1].isLastOne = true;
        }
    }

    private initPaymentMethodLabelsAndValues() {
        this.paymentMethodLabel = this._thTranslation.translate('Payment Method');
        if (this._invoice.payerList[this.payerIndex].paymentMethod.type === InvoicePaymentMethodType.DefaultPaymentMethod) {
            this.paymentMethodValue = _.find(this._paymentMethodList, (pm: PaymentMethodDO) => {
                return pm.id === this._invoice.payerList[this.payerIndex].paymentMethod.value;
            }).name;
        }
        else {
            this.paymentMethodValue = this._thTranslation.translate(InvoiceConfirmationVMContainer.PAY_INVOICE_BY_AGREEMENT_STR);
        }
    }

    private initTotalValues() {
        this.totalLabel = this._thTranslation.translate('Total');
        this.totalValue = this._invoice.payerList[this.payerIndex].priceToPay;
    }

    private initAdditionalFields() {
        this.addFieldName1 = "";
        this.addFieldValue1 = "";
        if (this._invoiceAggregatedData.bookingAttachment.exists) {
            this.addFieldName1 = this._thTranslation.translate("Guest");
            this.addFieldValue1 = this._invoiceAggregatedData.bookingAttachment.guest.customerDetails.getName();
        }
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