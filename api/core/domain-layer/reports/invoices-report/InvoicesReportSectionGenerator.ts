import _ = require("underscore");
import { AReportSectionGeneratorStrategy } from "../common/report-section-generator/AReportSectionGeneratorStrategy";
import { AppContext } from "../../../utils/AppContext";
import { SessionContext } from "../../../utils/SessionContext";
import { ThDateDO } from "../../../utils/th-dates/data-objects/ThDateDO";
import { ReportSectionMeta, ReportSectionHeader } from "../common/result/ReportSection";
import { ThError } from "../../../utils/th-responses/ThError";
import { LazyLoadRepoDO } from "../../../data-layer/common/repo-data-objects/LazyLoadRepoDO";
import { ThDateIntervalDO } from "../../../utils/th-dates/data-objects/ThDateIntervalDO";
import { BookingSearchCriteriaRepoDO, BookingSearchResultRepoDO } from "../../../data-layer/bookings/repositories/IBookingRepository";
import { CustomerSearchResultRepoDO } from "../../../data-layer/customers/repositories/ICustomerRepository";
import { CustomerDO } from "../../../data-layer/customers/data-objects/CustomerDO";
import { ThUtils } from "../../../utils/ThUtils";
import { PaymentMethodDO } from "../../../data-layer/common/data-objects/payment-method/PaymentMethodDO";
import { ShiftReportPaidInvoicesSectionGenerator } from "../shift-report/strategies/ShiftReportPaidInvoicesSectionGenerator";
import { BookingDO } from "../../../data-layer/bookings/data-objects/BookingDO";
import { ThDateIntervalUtils } from "../../../utils/th-dates/ThDateIntervalUtils";
import { InvoicePaymentMethodsUtils } from "../../invoices/utils/InvoicePaymentMethodsUtils";
import { InvoiceDO } from "../../../data-layer/invoices/data-objects/InvoiceDO";
import { InvoiceSearchCriteriaRepoDO, InvoiceSearchResultRepoDO } from "../../../data-layer/invoices/repositories/IInvoiceRepository";
import { InvoicePayerDO } from "../../../data-layer/invoices/data-objects/payer/InvoicePayerDO";
import { ThDateUtils } from "../../../utils/th-dates/ThDateUtils";
import { HotelDO } from "../../../data-layer/hotel/data-objects/HotelDO";

export class InvoicesReportSectionGenerator extends AReportSectionGeneratorStrategy {
    private dateUtils: ThDateUtils;
    private totalAmount: number;
    private customerMap: { [index: string]: CustomerDO };
    private invoicePaymentMethodsUtils: InvoicePaymentMethodsUtils;
    private bookingGuestCustomerMap: { [index: string]: CustomerDO };
    private hotel: HotelDO;
    private invoiceList: InvoiceDO[];
    private bookingList: BookingDO[];

    constructor(appContext: AppContext, sessionContext: SessionContext, globalSummary: Object,
        private customerIdList: string[], private startDate: ThDateDO, private endDate: ThDateDO) {
        super(appContext, sessionContext, globalSummary);
        this.dateUtils = new ThDateUtils();
        this.totalAmount = 0;
        this.customerMap = {};
        this.bookingGuestCustomerMap = {};
    }

    protected getMeta(): ReportSectionMeta {
        return {
            title: "Paid invoices"
        }
    }

    protected getGlobalSummary(): Object {
        return {
            "Total Amount": this.totalAmount
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
        interval.start = this.startDate;
        interval.end = this.endDate;

        this._appContext.getRepositoryFactory().getHotelRepository().getHotelById(this._sessionContext.sessionDO.hotel.id)
            .then((hotel: HotelDO) => {
                this.hotel = hotel;
                return this._appContext.getRepositoryFactory().getSettingsRepository().getPaymentMethods()
            })
            .then((result: PaymentMethodDO[]) => {
                this.invoicePaymentMethodsUtils = new InvoicePaymentMethodsUtils(result);

                return customerRepo.getCustomerList({ hotelId: this._sessionContext.sessionDO.hotel.id }, { customerIdList: this.customerIdList });
            }).then((result: CustomerSearchResultRepoDO) => {
                let invoicesRepo = this._appContext.getRepositoryFactory().getInvoiceRepository();

                let invoiceSearchCriteria: InvoiceSearchCriteriaRepoDO = {
                    customerIdList: this.customerIdList,
                    paidInterval: interval
                }

                let customerList = [];
                customerList = result.customerList;
                _.forEach(customerList, (customer: CustomerDO) => {
                    this.customerMap[customer.id] = customer;
                });

                return invoicesRepo.getInvoiceList({ hotelId: this._sessionContext.sessionDO.hotel.id }, invoiceSearchCriteria);
            }).then((result: InvoiceSearchResultRepoDO) => {
                let intervalUtils = new ThDateIntervalUtils([interval]);
                this.invoiceList = result.invoiceList;

                let bookingIdList = [];
                this.invoiceList.forEach(invoice => {
                    bookingIdList = bookingIdList.concat(invoice.indexedBookingIdList);
                });

                return this._appContext.getRepositoryFactory().getBookingRepository().getBookingList({ hotelId: this._sessionContext.sessionDO.hotel.id }, { bookingIdList: bookingIdList });
            }).then((value: BookingSearchResultRepoDO) => {
                this.bookingList = value.bookingList;
                let bookingsGuestCustomerIdList = _.map(this.bookingList, (booking: BookingDO) => { return booking.defaultBillingDetails.customerIdDisplayedAsGuest; });

                return customerRepo.getCustomerList({ hotelId: this._sessionContext.sessionDO.hotel.id }, { customerIdList: bookingsGuestCustomerIdList });
            }).then((result: CustomerSearchResultRepoDO) => {
                let bookingsGuestCustomerList = result.customerList;
                _.forEach(bookingsGuestCustomerList, (customer: CustomerDO) => {
                    this.bookingGuestCustomerMap[customer.id] = customer;
                });
                let data: any[] = [];
                let rawData: any[] = [];

                _.forEach(this.invoiceList, (invoice: InvoiceDO) => {
                    let payerList = _.filter(invoice.payerList, (payer: InvoicePayerDO) => {
                        return _.contains(this.customerIdList, payer.customerId);
                    });
                    let payerCustomerIdList: string[] = _.map(payerList, (payer: InvoicePayerDO) => { return payer.customerId; });

                    _.forEach(payerCustomerIdList, (customerId: string) => {
                        let customer = this.customerMap[customerId];
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
                    if (invoice1.paidTimestamp != invoice2.paidTimestamp) {
                        return invoice1.paidTimestamp > invoice2.paidTimestamp ? 1 : -1;
                    }

                    if (invoice1.reference !== invoice2.reference) {
                        return invoice1.reference > invoice2.reference ? 1 : -1;
                    }

                    return 0;
                });

                data = _.map(rawData, (row: any) => {
                    let invoice: InvoiceDO = row[0];
                    let customer: CustomerDO = row[1];
                    let invoicePayerDO: InvoicePayerDO = _.find(invoice.payerList, (invoicePayer: InvoicePayerDO) => {
                        return invoicePayer.customerId === customer.id;
                    });
                    let bookingGuest = (invoice.indexedBookingIdList) ? this.getBookingGuestNamesForInvoice(invoice) : "";

                    let paymentMethodString = "";
                    invoicePayerDO.paymentList.forEach(payment => {
                        if (!this._thUtils.isUndefinedOrNull(payment.paymentMethod)) {
                            let pmName = this.invoicePaymentMethodsUtils.getPaymentMethodName(payment.paymentMethod);
                            if (!this._thUtils.isUndefinedOrNull(pmName)) {
                                pmName = this._appContext.thTranslate.translate(pmName);
                            }
                            paymentMethodString = (pmName) ? pmName : "";
                        }
                    });
                    let thTimestamp = this.dateUtils.convertTimestampToLocalThTimestamp(invoice.paidTimestamp, this.hotel.timezone);
                    return [
                        invoice.reference,
                        customer.customerDetails.getName(),
                        this.getPricePaidByCustomerId(invoice, customer.id),
                        thTimestamp.toString(),
                        bookingGuest,
                        paymentMethodString
                    ];
                });

                _.forEach(data, (row) => {
                    this.totalAmount += row[2];
                });
                let thUtils = new ThUtils();
                this.totalAmount = thUtils.roundNumberToTwoDecimals(this.totalAmount);

                resolve(data);
            }).catch(e => {
                reject(e);
            })
    }

    private getBookingGuestNamesForInvoice(invoice: InvoiceDO): string {
        var associatedBookings: BookingDO[] = _.filter(this.bookingList, (booking: BookingDO) => {
            return _.contains(invoice.indexedBookingIdList, booking.id);
        });
        if (associatedBookings && associatedBookings.length > 0) {
            let names: string[] = [];
            associatedBookings.forEach(booking => {
                if (booking.defaultBillingDetails && booking.defaultBillingDetails.customerIdDisplayedAsGuest) {
                    names.push(this.bookingGuestCustomerMap[booking.defaultBillingDetails.customerIdDisplayedAsGuest].customerDetails.getName())
                }
            });
            return names.join(", ");
        } else {
            return "";
        }
    }

    private getPricePaidByCustomerId(invoice: InvoiceDO, customerId: string): number {
        let payer: InvoicePayerDO = _.find(invoice.payerList, (payer: InvoicePayerDO) => { return payer.customerId === customerId; });
        if (this._thUtils.isUndefinedOrNull(payer)) {
            return 0.0;
        }
        return payer.totalAmount;
    }
}
