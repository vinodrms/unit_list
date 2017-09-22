import _ = require('underscore');
import { AReportSectionGeneratorStrategy } from "../../common/report-section-generator/AReportSectionGeneratorStrategy";
import { ReportSectionHeader, ReportSectionMeta } from "../../common/result/ReportSection";
import { ThError } from "../../../../utils/th-responses/ThError";
import { AppContext } from "../../../../utils/AppContext";
import { SessionContext } from "../../../../utils/SessionContext";
import { CustomerSearchResultRepoDO, CustomerMetaRepoDO } from "../../../../data-layer/customers/repositories/ICustomerRepository";
import { CustomerDO } from "../../../../data-layer/customers/data-objects/CustomerDO";
import { BaseCorporateDetailsDO } from "../../../../data-layer/customers/data-objects/customer-details/corporate/BaseCorporateDetailsDO";
import { InvoiceDO } from "../../../../data-layer/invoices/data-objects/InvoiceDO";
import { InvoicePayerDO } from '../../../../data-layer/invoices/data-objects/payer/InvoicePayerDO';
import { InvoicePaymentMethodType } from '../../../../data-layer/invoices/data-objects/payer/InvoicePaymentMethodDO';

export class ShiftReportPaidByAgreementSectionGenerator extends AReportSectionGeneratorStrategy {

    constructor(appContext: AppContext, sessionContext: SessionContext, globalSummary: Object, private _paidInvoiceList: InvoiceDO[]) {
        super(appContext, sessionContext, globalSummary);
    }

    protected getHeader(): ReportSectionHeader {
        return {
            display: true,
            values: [
                "Payment method",
                "Transactions",
                "Amount"
            ]
        };
    }

    protected getMeta(): ReportSectionMeta {
        return {
            title: "Paid by agreement breakdown"
        }
    }

    protected getGlobalSummary(): Object {
        return {}
    }

    protected getDataCore(resolve: (result: any[][]) => void, reject: (err: ThError) => void) {
        let data = [];

        let allInvoicePayers: InvoicePayerDO[] = [];
        this._paidInvoiceList.forEach(invoice => {
            allInvoicePayers = allInvoicePayers.concat(invoice.payerList);
        });

        let payByAgreementCustomerIdMap = {};
        _.forEach(allInvoicePayers, (invoicePayer: InvoicePayerDO) => {
            invoicePayer.paymentList.forEach(payment => {
                if (payment.paymentMethod.type === InvoicePaymentMethodType.PayInvoiceByAgreement) {
                    if (_.isUndefined(payByAgreementCustomerIdMap[invoicePayer.customerId])) {
                        payByAgreementCustomerIdMap[invoicePayer.customerId] = {
                            amount: invoicePayer.totalAmount,
                            transactions: 1
                        };
                    }
                    else {
                        payByAgreementCustomerIdMap[invoicePayer.customerId]["amount"] += invoicePayer.totalAmount;
                        payByAgreementCustomerIdMap[invoicePayer.customerId]["transactions"] += 1;
                    }
                }
            });
        });

        this.convertCustomerIdMapToCustomerMap(payByAgreementCustomerIdMap).then((payByAgreementCustomerNameMap: Object) => {
            _.forEach(Object.keys(payByAgreementCustomerNameMap), (companyLabel: string) => {
                let paymentsDetails = payByAgreementCustomerNameMap[companyLabel];
                let row = [companyLabel, paymentsDetails.transactions, paymentsDetails.amount];

                data.push(row);
            })
            resolve(data);
        }).catch((e) => { reject(e) });
    }

    private convertCustomerIdMapToCustomerMap(payByAgreementCustomerIdMap: Object): Promise<any> {
        return new Promise<any>((resolve: { (result: any): void }, reject: { (err: ThError): void }) => {
            this.convertCustomerIdMapToCustomerMapCore(resolve, reject, payByAgreementCustomerIdMap);
        });
    }

    private convertCustomerIdMapToCustomerMapCore(resolve: { (result: any): void }, reject: { (err: ThError): void }, payByAgreementCustomerIdMap: Object) {
        let customersRepository = this._appContext.getRepositoryFactory().getCustomerRepository();
        customersRepository.getCustomerList(this.customerMetaRepoDO, { customerIdList: Object.keys(payByAgreementCustomerIdMap) }).then((result: CustomerSearchResultRepoDO) => {
            let customerList = result.customerList;

            let payByAgreementCustomerMap = {};
            _.forEach(Object.keys(payByAgreementCustomerIdMap), (customerId: string) => {
                let customerDO = _.find(customerList, (customerDO: CustomerDO) => { return customerDO.id === customerId });
                payByAgreementCustomerMap[this.getCustomerLabelFromCustomerDO(customerDO)] = payByAgreementCustomerIdMap[customerId];
            });

            resolve(payByAgreementCustomerMap);
        });
    }

    private getCustomerLabelFromCustomerDO(customerDO: CustomerDO) {
        var corporateDetails = new BaseCorporateDetailsDO();
        corporateDetails.buildFromObject(customerDO.customerDetails);

        return corporateDetails.getName()
            + '/' + this._appContext.thTranslate.translate('account no.') + ' '
            + corporateDetails.accountNo;
    }

    private get customerMetaRepoDO(): CustomerMetaRepoDO {
        return {
            hotelId: this._sessionContext.sessionDO.hotel.id
        }
    }
}
