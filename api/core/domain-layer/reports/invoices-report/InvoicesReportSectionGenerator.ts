import { AReportSectionGeneratorStrategy } from "../common/report-section-generator/AReportSectionGeneratorStrategy";
import { AppContext } from "../../../utils/AppContext";
import { SessionContext } from "../../../utils/SessionContext";
import { ThDateDO } from "../../../utils/th-dates/data-objects/ThDateDO";
import { ReportSectionMeta, ReportSectionHeader } from "../common/result/ReportSection";
import { ThError } from "../../../utils/th-responses/ThError";
import { LazyLoadRepoDO } from "../../../data-layer/common/repo-data-objects/LazyLoadRepoDO";
import { ThDateIntervalDO } from "../../../utils/th-dates/data-objects/ThDateIntervalDO";
import { BookingSearchCriteriaRepoDO, BookingSearchResultRepoDO } from "../../../data-layer/bookings/repositories/IBookingRepository";
import { InvoiceGroupSearchCriteriaRepoDO, InvoiceGroupSearchResultRepoDO } from "../../../data-layer/invoices-deprecated/repositories/IInvoiceGroupsRepository";
import { InvoiceGroupDO } from "../../../data-layer/invoices-deprecated/data-objects/InvoiceGroupDO";
import { InvoiceDO } from "../../../data-layer/invoices-deprecated/data-objects/InvoiceDO";
import { CustomerSearchResultRepoDO } from "../../../data-layer/customers/repositories/ICustomerRepository";
import { CustomerDO } from "../../../data-layer/customers/data-objects/CustomerDO";
import { ThUtils } from "../../../utils/ThUtils";
import { PaymentMethodDO } from "../../../data-layer/common/data-objects/payment-method/PaymentMethodDO";
import { InvoicePayerDO } from "../../../data-layer/invoices-deprecated/data-objects/payers/InvoicePayerDO";
import { InvoicePaymentMethodDO, InvoicePaymentMethodType } from "../../../data-layer/invoices-deprecated/data-objects/payers/InvoicePaymentMethodDO";
import { ShiftReportPaidInvoicesSectionGenerator } from "../shift-report/strategies/ShiftReportPaidInvoicesSectionGenerator";
import { BookingDO } from "../../../data-layer/bookings/data-objects/BookingDO";
import { ThDateIntervalUtils } from "../../../utils/th-dates/ThDateIntervalUtils";
import { InvoicePaymentMethodsUtils } from "../../invoices-deprecated/utils/InvoicePaymentMethodsUtils";

import _ = require("underscore");


export class InvoicesReportSectionGenerator extends AReportSectionGeneratorStrategy {
    private _totalAmount: number;
    private _customerMap: { [index: string]: CustomerDO };
    private _invoicePaymentMethodsUtils: InvoicePaymentMethodsUtils;
    private _bookingGuestCustomerMap: { [index: string]: CustomerDO };
    private _invoiceList: InvoiceDO[];
    private _bookingList: BookingDO[];

    constructor(appContext: AppContext, sessionContext: SessionContext, globalSummary: Object,
        private _customerIdList: string[], private _startDate: ThDateDO, private _endDate: ThDateDO) {
        super(appContext, sessionContext, globalSummary);

        this._totalAmount = 0;
        this._customerMap = {};
        this._bookingGuestCustomerMap = {};
    }

    protected getMeta(): ReportSectionMeta {
        return {
            title: "Paid invoices"
        }
    }

    protected getGlobalSummary(): Object {
        return {
            "Total Amount": this._totalAmount
        }
    }

    protected getHeader(): ReportSectionHeader {
        return {
            display: true,
            values: [
                "Invoice No",
                "Custome Name",
                "Amount",
                "Paid Date",
                "Booking Guest",
                "Payment Method",

            ]
        };
    }

    protected getDataCore(resolve: (result: any[][]) => void, reject: (err: ThError) => void) {
        let customerRepo = this._appContext.getRepositoryFactory().getCustomerRepository();

        let interval = new ThDateIntervalDO();
        interval.start = this._startDate;
        interval.end = this._endDate;

        this._appContext.getRepositoryFactory().getSettingsRepository().getPaymentMethods().then((result: PaymentMethodDO[]) => {
            this._invoicePaymentMethodsUtils = new InvoicePaymentMethodsUtils(result);

            return customerRepo.getCustomerList({ hotelId: this._sessionContext.sessionDO.hotel.id }, { customerIdList: this._customerIdList });
        }).then((result: CustomerSearchResultRepoDO) => {
            let invoicesRepo = this._appContext.getRepositoryFactory().getInvoiceGroupsRepository();

            let invoiceSearchCriteria: InvoiceGroupSearchCriteriaRepoDO = {
                customerIdList: this._customerIdList,
                paidInterval: interval
            }

            let customerList = [];
            customerList = result.customerList;
            _.forEach(customerList, (customer: CustomerDO) => {
                this._customerMap[customer.id] = customer;
            });

            return invoicesRepo.getInvoiceGroupList({ hotelId: this._sessionContext.sessionDO.hotel.id }, invoiceSearchCriteria);
        }).then((result: InvoiceGroupSearchResultRepoDO) => {
            let intervalUtils = new ThDateIntervalUtils([interval]);
            let invoiceGroupsList = result.invoiceGroupList;

            this._invoiceList = _.chain(invoiceGroupsList).map((invoiceGroup: InvoiceGroupDO) => {
                return invoiceGroup.invoiceList;
            }).flatten().filter((invoice: InvoiceDO) => {
                return intervalUtils.containsThDateDO(invoice.paidDate);
            }).value();

            let bookingIdList = _.filter(this._invoiceList, (invoice: InvoiceDO) => {
                return invoice.bookingId;
            }).map((invoice: InvoiceDO) => {
                return invoice.bookingId;
            });

            return this._appContext.getRepositoryFactory().getBookingRepository().getBookingList({ hotelId: this._sessionContext.sessionDO.hotel.id }, { bookingIdList: bookingIdList });
        }).then((value: BookingSearchResultRepoDO) => {
            this._bookingList = value.bookingList;
            let bookingsGuestCustomerIdList = _.map(this._bookingList, (booking: BookingDO) => { return booking.defaultBillingDetails.customerIdDisplayedAsGuest; });

            return customerRepo.getCustomerList({ hotelId: this._sessionContext.sessionDO.hotel.id }, { customerIdList: bookingsGuestCustomerIdList });
        }).then((result: CustomerSearchResultRepoDO) => {
            let bookingsGuestCustomerList = result.customerList;
            _.forEach(bookingsGuestCustomerList, (customer: CustomerDO) => {
                this._bookingGuestCustomerMap[customer.id] = customer;
            });
            let data: any[] = [];
            let rawData: any[] = [];

            _.forEach(this._invoiceList, (invoice: InvoiceDO) => {
                let payerCustomerIdList = _.filter(invoice.getPayerCustomerIdList(), (customerId: string) => {
                    return _.contains(this._customerIdList, customerId);
                });

                _.forEach(payerCustomerIdList, (customerId: string) => {
                    let customer = this._customerMap[customerId];
                    let row = [
                        invoice,
                        customer
                    ];
                    rawData.push(row);
                });
            });

            rawData = rawData.sort((a: any, b: any) => {
                let customer1: CustomerDO = a[1];
                let customer2: CustomerDO = b[1];
                if (customer1.customerDetails.getName() !== customer2.customerDetails.getName()) {
                    return customer1.customerDetails.getName() > customer2.customerDetails.getName() ? 1 : -1;
                }

                let invoice1: InvoiceDO = a[0];
                let invoice2: InvoiceDO = b[0];
                if (invoice1.paidDateTimeUtcTimestamp != invoice2.paidDateTimeUtcTimestamp) {
                    return invoice1.paidDateTimeUtcTimestamp > invoice2.paidDateTimeUtcTimestamp ? 1 : -1;
                }

                if (invoice1.invoiceReference !== invoice2.invoiceReference) {
                    return invoice1.invoiceReference > invoice2.invoiceReference ? 1 : -1;
                }

                return 0;
            });

            data = _.map(rawData, (row: any) => {
                let invoice: InvoiceDO = row[0];
                let customer: CustomerDO = row[1];
                let invoicePayerDO = _.find(invoice.payerList, (invoicePayer: InvoicePayerDO) => {
                    return invoicePayer.customerId === customer.id;
                });
                let bookingGuest = (invoice.bookingId) ? this.getBookingGuestNameForInvoice(invoice) : "";

                let paymentMethodString = "";
                if (!this._thUtils.isUndefinedOrNull(invoicePayerDO) && !this._thUtils.isUndefinedOrNull(invoicePayerDO.paymentMethod)) {
                    let pmName = this._invoicePaymentMethodsUtils.getPaymentMethodName(invoicePayerDO.paymentMethod);
                    if (!this._thUtils.isUndefinedOrNull(pmName)) {
                        pmName = this._appContext.thTranslate.translate(pmName);
                    }
                    paymentMethodString = (pmName) ? pmName : "";
                }

                return [
                    invoice.invoiceReference,
                    customer.customerDetails.getName(),
                    invoice.getPricePaidByCustomerId(customer.id),
                    invoice.paidTimestamp.toString(),
                    bookingGuest,
                    paymentMethodString
                ];
            });

            _.forEach(data, (row) => {
                this._totalAmount += row[2];
            });
            let thUtils = new ThUtils();
            this._totalAmount = thUtils.roundNumberToTwoDecimals(this._totalAmount);

            resolve(data);
        }).catch(e => {
            reject(e);
        })
    }

    private getBookingGuestNameForInvoice(invoice: InvoiceDO): string {
        var associatedBooking: BookingDO = _.find(this._bookingList, (booking: BookingDO) => {
            return invoice.bookingId === booking.id;
        });
        if (associatedBooking && associatedBooking.displayCustomerId) {
            return this._bookingGuestCustomerMap[associatedBooking.defaultBillingDetails.customerIdDisplayedAsGuest].customerDetails.getName();
        } else {
            return "";
        }
    }
}
