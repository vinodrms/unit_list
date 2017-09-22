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
import { InvoiceDO } from '../../../../data-layer/invoices/data-objects/InvoiceDO';
import { ThDateUtils } from '../../../../utils/th-dates/ThDateUtils';
import { HotelDO } from '../../../../data-layer/hotel/data-objects/HotelDO';
import { InvoicePayerDO } from '../../../../data-layer/invoices/data-objects/payer/InvoicePayerDO';

export class ShiftReportLossAcceptedByManagementInvoicesSectionGenerator extends AReportSectionGeneratorStrategy {

    private _indexedCustomersById: { [id: string]: CustomerDO };
    private _indexedBookingById: { [id: string]: BookingDO };

    constructor(appContext: AppContext, sessionContext: SessionContext, globalSummary: Object,
        private _allInvoiceList: InvoiceDO[],
        private _lostByManagementInvoiceList: InvoiceDO[],
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
                "Reservation number",
                "Lost by Management at"
            ]
        };
    }
    protected getMeta(): ReportSectionMeta {
        return {
            title: "Loss Accepted By Management Invoices"
        }
    }

    protected getGlobalSummary(): Object {
        return {}
    }

    protected getDataCore(resolve: { (result: any[][]): void }, reject: { (err: ThError): void }) {
        let customerRepo = this._appContext.getRepositoryFactory().getCustomerRepository();
        let customerIdList = this.getCustomerIdList();
        customerRepo.getCustomerList({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
            customerIdList: customerIdList
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
            var totalAmountLost = 0.0;

            this._lostByManagementInvoiceList.forEach((invoice: InvoiceDO) => {
                var amountLost = 0.0;
                invoice.payerList.forEach(payer => {
                    amountLost += payer.totalAmount;
                });

                amountLost = this._thUtils.roundNumberToTwoDecimals(amountLost);

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

                let row = [invoiceRefDisplayString, payerString, amountLost, bookingRef, paidTimestampStr];

                data.push(row);

                totalAmountLost += amountLost;

            });
            // sort by invoice reference
            data.sort((row1: string[], row2: string[]) => {
                return row1[0].localeCompare(row2[0]);
            });

            totalAmountLost = this._thUtils.roundNumberToTwoDecimals(totalAmountLost);

            data.push([this._appContext.thTranslate.translate('Total'), "", totalAmountLost]);
            resolve(data);
        }).catch((e) => {
            reject(e);
        });
    }

    private getBookingIdList(): string[] {
        let bookingIdList = [];

        this._lostByManagementInvoiceList.forEach((invoice: InvoiceDO) => {
            bookingIdList = bookingIdList.concat(invoice.indexedBookingIdList);
        });

        return bookingIdList;
    }

    private getCustomerIdList(): string[] {
        let customerIdList: string[] = [];
        this._lostByManagementInvoiceList.forEach((invoice: InvoiceDO) => {
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
