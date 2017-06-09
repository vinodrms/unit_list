import { AReportSectionGeneratorStrategy } from "../common/report-section-generator/AReportSectionGeneratorStrategy";
import { AppContext } from "../../../utils/AppContext";
import { SessionContext } from "../../../utils/SessionContext";
import { ThDateDO } from "../../../utils/th-dates/data-objects/ThDateDO";
import { ReportSectionMeta, ReportSectionHeader } from "../common/result/ReportSection";
import { ThError } from "../../../utils/th-responses/ThError";
import { LazyLoadRepoDO } from "../../../data-layer/common/repo-data-objects/LazyLoadRepoDO";
import { ThDateIntervalDO } from "../../../utils/th-dates/data-objects/ThDateIntervalDO";
import { BookingSearchCriteriaRepoDO } from "../../../data-layer/bookings/repositories/IBookingRepository";
import { InvoiceGroupSearchCriteriaRepoDO, InvoiceGroupSearchResultRepoDO } from "../../../data-layer/invoices/repositories/IInvoiceGroupsRepository";
import { InvoiceGroupDO } from "../../../data-layer/invoices/data-objects/InvoiceGroupDO";
import { InvoiceDO } from "../../../data-layer/invoices/data-objects/InvoiceDO";
import { CustomerSearchResultRepoDO } from "../../../data-layer/customers/repositories/ICustomerRepository";
import { CustomerDO } from "../../../data-layer/customers/data-objects/CustomerDO";
import { ThUtils } from "../../../utils/ThUtils";

export class InvoicesReportSectionGenerator extends AReportSectionGeneratorStrategy {
    private _totalAmount: number;
    private _customerMap: { [index: string]: CustomerDO };

    constructor(appContext: AppContext, sessionContext: SessionContext, globalSummary: Object,
        private _customerIdList: string[], private _startDate: ThDateDO, private _endDate: ThDateDO) {
        super(appContext, sessionContext, globalSummary);

        this._totalAmount = 0;
        this._customerMap = {};
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

            ]
        };
    }

    protected getDataCore(resolve: (result: any[][]) => void, reject: (err: ThError) => void) {
        let invoicesRepo = this._appContext.getRepositoryFactory().getInvoiceGroupsRepository();
        let customerRepo = this._appContext.getRepositoryFactory().getCustomerRepository();

        let interval = new ThDateIntervalDO();
        interval.start = this._startDate;
        interval.end = this._endDate;

        let invoiceSearchCriteria: InvoiceGroupSearchCriteriaRepoDO = {
            customerIdList: this._customerIdList,
            paidInterval: interval
        }

        let customerList = [];
        customerRepo.getCustomerList({ hotelId: this._sessionContext.sessionDO.hotel.id }, { customerIdList: this._customerIdList })
            .then((result: CustomerSearchResultRepoDO) => {
                customerList = result.customerList;
                _.forEach(customerList, (customer: CustomerDO) => {
                    this._customerMap[customer.id] = customer;
                });

                return invoicesRepo.getInvoiceGroupList({ hotelId: this._sessionContext.sessionDO.hotel.id }, invoiceSearchCriteria);
            }).then((result: InvoiceGroupSearchResultRepoDO) => {
                let invoiceGroupsList = result.invoiceGroupList;
                let invoiceList = _.chain(invoiceGroupsList).map((invoiceGroup: InvoiceGroupDO) => {
                    return invoiceGroup.invoiceList;
                }).flatten().value();

                let data: any[] = [];
                let rawData: any[] = [];

                _.forEach(invoiceList, (invoice: InvoiceDO) => {
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

                    return [
                        invoice.invoiceReference,
                        customer.customerDetails.getName(),
                        invoice.getPricePaidByCustomerId(customer.id),
                        invoice.paidTimestamp.toString()
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
}