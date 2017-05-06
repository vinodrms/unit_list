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

import _ = require('underscore');

export class ShiftReportPaidInvoicesSectionGenerator extends AReportSectionGeneratorStrategy {
    private _indexedCustomersById: { [id: string]: CustomerDO };
    private _indexedBookingById: { [id: string]: BookingDO };
    
    constructor(appContext: AppContext, sessionContext: SessionContext,
        private _paidInvoiceGroupList: InvoiceGroupDO[],
        private _sectionMeta: ReportSectionMeta) {
        super(appContext, sessionContext);
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
                "Paid/Lost by Management at"
            ]
        };
    }
    protected getMeta(): ReportSectionMeta {
        return this._sectionMeta;
    }

    protected getDataCore(resolve: { (result: any[][]): void }, reject: { (err: ThError): void }) {
        let bookingRepo = this._appContext.getRepositoryFactory().getBookingRepository();
        let bookingIdList = this.getBookingIdList();

        let customerRepo = this._appContext.getRepositoryFactory().getCustomerRepository();
        let customerIdList = this.getCustomerIdList();
        customerRepo.getCustomerList({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
            customerIdList: customerIdList
        }).then((custSearchResult: CustomerSearchResultRepoDO) => {
            this._indexedCustomersById = _.indexBy(custSearchResult.customerList, (customer: CustomerDO) => {
                return customer.id
            });

            return bookingRepo.getBookingList({ hotelId: this._sessionContext.sessionDO.hotel.id }, {bookingIdList: bookingIdList});
        }).then((bookingsResult: BookingSearchResultRepoDO) => {
            this._indexedBookingById = _.indexBy(bookingsResult.bookingList, (booking: BookingDO) => {
                return booking.id;
            });

            var data = [];
            var totalPriceToPay = 0.0, totalPriceToPayPlusTransactionFee = 0.0, totalTransactionFee = 0.0;
            var bookingRef;

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
                    if(!this._thUtils.isUndefinedOrNull(invoice.bookingId)) {
                        bookingRef = this._indexedBookingById[invoice.bookingId].displayedReservationNumber;
                    }

                    let paidTimestampStr = !invoice.paidTimestamp.isValid()? '' : invoice.paidTimestamp.toString();

                    let row = [invoice.invoiceReference, payerString, priceToPay, transactionFee, priceToPayPlusTransactionFee, bookingRef, paidTimestampStr];
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