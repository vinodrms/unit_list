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

import _ = require('underscore');

export class ShiftReportPaidInvoicesSectionGenerator extends AReportSectionGeneratorStrategy {
    private _indexedCustomersById: { [id: string]: CustomerDO };

    constructor(appContext: AppContext, private _sessionContext: SessionContext,
        private _paidInvoiceGroupList: InvoiceGroupDO[]) {
        super(appContext);
    }

    protected getHeader(): ReportSectionHeader {
        return {
            display: true,
            values: [
                "Invoice Reference",
                "Customer",
                "Subtotal"
            ]
        };
    }
    protected getMeta(): ReportSectionMeta {
        return {
            title: "Paid Invoices"
        }
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
            var data = [];
            var totalAmount = 0;
            this._paidInvoiceGroupList.forEach((invoiceGroup: InvoiceGroupDO) => {
                invoiceGroup.invoiceList.forEach((invoice: InvoiceDO) => {
                    var invoicePrice = _.reduce(invoice.payerList, (sum: number, payer: InvoicePayerDO) => {
                        return sum + payer.priceToPay;
                    }, 0);
                    totalAmount += invoicePrice;
                    invoicePrice = this._thUtils.roundNumberToTwoDecimals(invoicePrice);
                    let payerString = this.getPayerString(invoice);
                    let row = [invoice.invoiceReference, payerString, invoicePrice];
                    data.push(row);
                });
            });
            totalAmount = this._thUtils.roundNumberToTwoDecimals(totalAmount);
            data.push([this._appContext.thTranslate.translate('Total'), "", totalAmount]);
            resolve(data);
        }).catch((e) => {
            reject(e);
        });
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