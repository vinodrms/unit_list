import _ = require('underscore');
import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { ThError } from '../../../../utils/th-responses/ThError';
import { AReportSectionGeneratorStrategy } from '../../common/report-section-generator/AReportSectionGeneratorStrategy';
import { CustomerSearchResultRepoDO } from '../../../../data-layer/customers/repositories/ICustomerRepository';
import { CustomerDO } from '../../../../data-layer/customers/data-objects/CustomerDO';
import { ReportSectionHeader, ReportSectionMeta } from '../../common/result/ReportSection';
import { BookingDO } from "../../../../data-layer/bookings/data-objects/BookingDO";
import { BookingSearchResultRepoDO } from "../../../../data-layer/bookings/repositories/IBookingRepository";
import { PaymentMethodDO } from "../../../../data-layer/common/data-objects/payment-method/PaymentMethodDO";
import { InvoicePaymentMethodsUtils } from '../../../invoices/utils/InvoicePaymentMethodsUtils';
import { InvoiceDO } from '../../../../data-layer/invoices/data-objects/InvoiceDO';
import { ThDateUtils } from '../../../../utils/th-dates/ThDateUtils';
import { HotelDO } from '../../../../data-layer/hotel/data-objects/HotelDO';
import { InvoicePayerDO } from '../../../../data-layer/invoices/data-objects/payer/InvoicePayerDO';
import { InvoicePaymentMethodDO } from '../../../../data-layer/invoices/data-objects/payer/InvoicePaymentMethodDO';

export class ShiftReportPaidInvoicesSectionGenerator extends AReportSectionGeneratorStrategy {

    private _indexedCustomersById: { [id: string]: CustomerDO };
    private _indexedBookingById: { [id: string]: BookingDO };
    private _invoicePaymentMethodsUtils: InvoicePaymentMethodsUtils;

    constructor(appContext: AppContext, sessionContext: SessionContext, globalSummary: Object,
        private _allInvoiceList: InvoiceDO[],
        private _paidInvoiceList: InvoiceDO[],
        private _hotel: HotelDO) {
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

            this._paidInvoiceList.forEach((invoice: InvoiceDO) => {
                var priceToPay = 0.0, priceToPayPlusTransactionFee = 0.0;
                invoice.payerList.forEach(payer => {
                    priceToPay += payer.totalAmount;
                    priceToPayPlusTransactionFee += payer.totalAmountPlusTransactionFee;
                });
                var transactionFee = priceToPayPlusTransactionFee - priceToPay;

                priceToPay = this._thUtils.roundNumberToTwoDecimals(priceToPay);
                priceToPayPlusTransactionFee = this._thUtils.roundNumberToTwoDecimals(priceToPayPlusTransactionFee);
                transactionFee = this._thUtils.roundNumberToTwoDecimals(transactionFee);

                let payerString = this.getPayerString(invoice);
                var bookingRef = '';
                let bookingRefs: string[] = [];
                invoice.indexedBookingIdList.forEach((bookingId: string) => {
                    bookingRefs.push(this._indexedBookingById[bookingId].displayedReservationNumber);
                });
                bookingRef = bookingRefs.join(", ");

                let paidTimestampStr = '';
                if (_.isNumber(invoice.paidTimestamp)) {
                    let dateUtils = new ThDateUtils();
                    paidTimestampStr = dateUtils.convertTimestampToLocalThTimestamp(invoice.paidTimestamp, this._hotel.timezone).toString();
                }

                let invoiceRefDisplayString = invoice.reference;

                if (invoice.isReinstatement()) {
                    invoiceRefDisplayString += ' ' + this._appContext.thTranslate.translate('reinstatement');
                }

                let paymentMethodString = (invoice.isPaid()) ? this.getPaymentMethodString(invoice.payerList) : "";

                let row = [invoiceRefDisplayString, payerString, priceToPay, transactionFee, priceToPayPlusTransactionFee, bookingRef, paidTimestampStr, paymentMethodString];

                data.push(row);

                totalPriceToPay += priceToPay;
                totalPriceToPayPlusTransactionFee += priceToPayPlusTransactionFee;
                totalTransactionFee += transactionFee;
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
        let invoicePaymentMethodList: InvoicePaymentMethodDO[] = [];
        invoicePayerList.forEach(payer => {
            payer.paymentList.forEach(payment => {
                invoicePaymentMethodList.push(payment.paymentMethod);
            });
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

        this._paidInvoiceList.forEach((invoice: InvoiceDO) => {
            bookingIdList = bookingIdList.concat(invoice.indexedBookingIdList);
        });

        return bookingIdList;
    }

    private getCustomerIdList(): string[] {
        let customerIdList: string[] = [];
        this._paidInvoiceList.forEach((invoice: InvoiceDO) => {
            customerIdList = customerIdList.concat(_.map(invoice.payerList, (payer: InvoicePayerDO) => {
                return payer.customerId;
            }));
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
