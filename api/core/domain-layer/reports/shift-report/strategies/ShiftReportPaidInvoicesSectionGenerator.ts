import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { ThError } from '../../../../utils/th-responses/ThError';
import { AReportSectionGeneratorStrategy } from '../../common/report-section-generator/AReportSectionGeneratorStrategy';
import { InvoiceDO } from '../../../../data-layer/invoices/data-objects/InvoiceDO';
import { InvoicePayerDO } from '../../../../data-layer/invoices/data-objects/payers/InvoicePayerDO';
import { InvoiceGroupDO } from '../../../../data-layer/invoices/data-objects/InvoiceGroupDO';
import { CustomerSearchResultRepoDO } from '../../../../data-layer/customers/repositories/ICustomerRepository';
import { CustomerDO } from '../../../../data-layer/customers/data-objects/CustomerDO';
import { ReportSectionHeader, ReportSectionMeta } from '../../common/result/ReportSection';
import { BookingDO } from "../../../../data-layer/bookings/data-objects/BookingDO";
import { BookingSearchResultRepoDO } from "../../../../data-layer/bookings/repositories/IBookingRepository";
import { PaymentMethodDO } from "../../../../data-layer/common/data-objects/payment-method/PaymentMethodDO";
import { InvoicePaymentMethodDO, InvoicePaymentMethodType } from "../../../../data-layer/invoices/data-objects/payers/InvoicePaymentMethodDO";
import { InvoicePaymentMethodsUtils } from "../../../invoices/utils/InvoicePaymentMethodsUtils";

import _ = require('underscore');

export class ShiftReportPaidInvoicesSectionGenerator extends AReportSectionGeneratorStrategy {

    private _indexedCustomersById: { [id: string]: CustomerDO };
    private _indexedBookingById: { [id: string]: BookingDO };
    private _invoicePaymentMethodsUtils: InvoicePaymentMethodsUtils;

    constructor(appContext: AppContext, sessionContext: SessionContext, globalSummary: Object,
        private _allInvoiceGroupList: InvoiceGroupDO[],
        private _paidInvoiceGroupList: InvoiceGroupDO[]) {
        super(appContext, sessionContext, globalSummary);
    }

    protected getHeader(): ReportSectionHeader {
        return {
            display: true,
            values: [
                "Invoice Reference",
                "Customer",
                "Amount",
                "Transaction Fee",
                "Total",
                "Reservation number",
                "Paid at",
                "Payment method"
            ]
        };
    }
    protected getMeta(): ReportSectionMeta {
        return {
		    title: "Paid Invoices"
		}
    }

    protected getGlobalSummary(): Object {
        return {}
    }

    protected getDataCore(resolve: { (result: any[][]): void }, reject: { (err: ThError): void }) {
        debugger
        this._appContext.getRepositoryFactory().getSettingsRepository().getPaymentMethods().then((result: PaymentMethodDO[]) => {
            this._invoicePaymentMethodsUtils = new InvoicePaymentMethodsUtils(result);

            let customerRepo = this._appContext.getRepositoryFactory().getCustomerRepository();
            let customerIdList = this.getCustomerIdList();
            return customerRepo.getCustomerList({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                customerIdList: customerIdList
            });
        }).then((custSearchResult: CustomerSearchResultRepoDO) => {
            this._indexedCustomersById = _.indexBy(custSearchResult.customerList, (customer: CustomerDO) => {
                return customer.id
            });

            let bookingRepo = this._appContext.getRepositoryFactory().getBookingRepository();
            let bookingIdList = this.getBookingIdList();

            return bookingRepo.getBookingList({ hotelId: this._sessionContext.sessionDO.hotel.id }, { bookingIdList: bookingIdList });
        }).then((bookingsResult: BookingSearchResultRepoDO) => {
            this._indexedBookingById = _.indexBy(bookingsResult.bookingList, (booking: BookingDO) => {
                return booking.id;
            });

            var data = [];
            var totalPriceToPay = 0.0, totalPriceToPayPlusTransactionFee = 0.0, totalTransactionFee = 0.0;

            this._paidInvoiceGroupList.forEach((invoiceGroup: InvoiceGroupDO) => {
                invoiceGroup.invoiceList.forEach((invoice: InvoiceDO) => {
                    var priceToPay = 0.0, priceToPayPlusTransactionFee = 0.0;
                    invoice.payerList.forEach(payer => {
                        priceToPay += payer.priceToPay;
                        priceToPayPlusTransactionFee += payer.priceToPayPlusTransactionFee;
                    });
                    var transactionFee = priceToPayPlusTransactionFee - priceToPay;

                    priceToPay = this._thUtils.roundNumberToTwoDecimals(priceToPay);
                    priceToPayPlusTransactionFee = this._thUtils.roundNumberToTwoDecimals(priceToPayPlusTransactionFee);
                    transactionFee = this._thUtils.roundNumberToTwoDecimals(transactionFee);

                    let payerString = this.getPayerString(invoice);
                    var bookingRef = '';
                    if (!this._thUtils.isUndefinedOrNull(invoice.bookingId)) {
                        bookingRef = this._indexedBookingById[invoice.bookingId].displayedReservationNumber;
                    }

                    let paidTimestampStr = !invoice.paidTimestamp.isValid() ? '' : invoice.paidTimestamp.toString();

                    let invoiceRefDisplayString = invoice.invoiceReference;

                    if (invoice.isReinstatement()) {
                        let unfilteredInvoiceGroup = _.find(this._allInvoiceGroupList, (group: InvoiceGroupDO) => {
                            return group.id === invoiceGroup.id;
                        });
                        let reinstatedInvoiceRef = unfilteredInvoiceGroup.getReinstatedInvoiceReference(invoice.id);
                        invoiceRefDisplayString += ' ' + this._appContext.thTranslate.translate('(reinstatement of %reinstatedInvoiceRef%)', {
                            reinstatedInvoiceRef: reinstatedInvoiceRef
                        });
                    }

                    let paymentMethodString = (invoice.isPaid) ? this.getPaymentMethodString(invoice.payerList) : "";

                    let row = [invoiceRefDisplayString, payerString, priceToPay, transactionFee, priceToPayPlusTransactionFee, bookingRef, paidTimestampStr, paymentMethodString];

                    data.push(row);

                    totalPriceToPay += priceToPay;
                    totalPriceToPayPlusTransactionFee += priceToPayPlusTransactionFee;
                    totalTransactionFee += transactionFee;
                });
            });
            // sort by invoice reference
            data.sort((row1: string[], row2: string[]) => {
                return row1[0].localeCompare(row2[0]);
            });

            totalPriceToPay = this._thUtils.roundNumberToTwoDecimals(totalPriceToPay);
            totalPriceToPayPlusTransactionFee = this._thUtils.roundNumberToTwoDecimals(totalPriceToPayPlusTransactionFee);
            totalTransactionFee = this._thUtils.roundNumberToTwoDecimals(totalTransactionFee);

            data.push([this._appContext.thTranslate.translate('Total'), "", totalPriceToPay, totalTransactionFee, totalPriceToPayPlusTransactionFee]);
            resolve(data);
        }).catch((e) => {
            reject(e);
        });
    }

    private getPaymentMethodString(invoicePayerList: InvoicePayerDO[]): string {
        let invoicePaymentMethodList: InvoicePaymentMethodDO = _.map(invoicePayerList, (invoicePayer: InvoicePayerDO) => {
            return invoicePayer.paymentMethod;
        });

        return _.reduce(invoicePaymentMethodList, (paymentMethodString: string, invoicePaymentMethod: InvoicePaymentMethodDO) => {
            let pmName = this._invoicePaymentMethodsUtils.getPaymentMethodName(invoicePaymentMethod);
            pmName = this._appContext.thTranslate.translate(pmName);

            if (!this._thUtils.isUndefinedOrNull(pmName)) {
                return paymentMethodString + (paymentMethodString.length > 0 ? ", " : "") + pmName;
            }

            return paymentMethodString;
        }, "");
    }

    private getBookingIdList(): string[] {
        let bookingIdList = [];

        this._paidInvoiceGroupList.forEach((invoiceGroup: InvoiceGroupDO) => {
            invoiceGroup.invoiceList.forEach((invoice: InvoiceDO) => {
                if (_.isString(invoice.bookingId) && !_.contains(bookingIdList, invoice.bookingId)) {
                    bookingIdList.push(invoice.bookingId);
                }
            });
        });

        return bookingIdList;
    }

    private getCustomerIdList(): string[] {
        let customerIdList: string[] = [];
        this._paidInvoiceGroupList.forEach((invoiceGroup: InvoiceGroupDO) => {
            invoiceGroup.invoiceList.forEach((invoice: InvoiceDO) => {
                customerIdList = customerIdList.concat(_.map(invoice.payerList, (payer: InvoicePayerDO) => {
                    return payer.customerId;
                }));
            });
        });
        return _.uniq(customerIdList);
    }
    private getPayerString(invoice: InvoiceDO): string {
        return _.reduce(invoice.payerList, (payerString: string, payer: InvoicePayerDO) => {
            let customer = this._indexedCustomersById[payer.customerId];
            if (!this._thUtils.isUndefinedOrNull(customer)) {
                return payerString + (payerString.length > 0 ? ", " : "") + customer.customerDetails.getName();
            }
            return payerString;
        }, "");
    }
}