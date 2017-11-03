import _ = require("underscore");
import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { ThError } from '../../../../utils/th-responses/ThError';
import { AReportSectionGeneratorStrategy } from '../../common/report-section-generator/AReportSectionGeneratorStrategy';
import { ReportSectionHeader, ReportSectionMeta } from '../../common/result/ReportSection';
import { InvoiceDO } from '../../../../data-layer/invoices/data-objects/InvoiceDO';
import { InvoicePaymentMethodType } from '../../../../data-layer/invoices/data-objects/payer/InvoicePaymentMethodDO';
import { InvoicePayerDO } from '../../../../data-layer/invoices/data-objects/payer/InvoicePayerDO';

export class ShiftReportByPaymentMethodSectionGenerator extends AReportSectionGeneratorStrategy {

    constructor(appContext: AppContext, sessionContext: SessionContext, globalSummary: Object,
        private _paidInvoiceList: InvoiceDO[]) {
        super(appContext, sessionContext, globalSummary);
    }

    protected getHeader(): ReportSectionHeader {
        return {
            display: true,
            values: [
                "Payment method",
                "Transactions",
                "Amount (fee included)",
                "Amount (without fee)",
                "Transaction fee"
            ]
        };
    }

    protected getMeta(): ReportSectionMeta {
        return {
            title: "Transactions Grouped by Payment Method"
        }
    }

    protected getGlobalSummary(): Object {
        return {}
    }

    protected getDataCore(resolve: { (result: any[][]): void }, reject: { (err: ThError): void }) {
        this.createPaymentMethodIdToNameMap().then((pmIdToNameMap) => {
            let mpmDetailsDict = this.getPaymentMethodsDetailsDict();
            var totalTransaction = 0;
            var totalAmountWithoutFee = 0;
            var totalAmountWithFee = 0;
            var totalFees = 0;

            var data: any[] = [];
            Object.keys(mpmDetailsDict).forEach((pMethod) => {
                let pmName = pmIdToNameMap[pMethod];
                let transactions = mpmDetailsDict[pMethod].transactions;

                let amountWithoutFee = this._thUtils.roundNumberToTwoDecimals(mpmDetailsDict[pMethod].amountWithoutFee);
                let amountWithFee = this._thUtils.roundNumberToTwoDecimals(mpmDetailsDict[pMethod].amountWithFee);
                let fee = this._thUtils.roundNumberToTwoDecimals(amountWithFee - amountWithoutFee);

                let row = [pmName, transactions, amountWithFee, amountWithoutFee, fee];

                totalTransaction += transactions;
                totalAmountWithoutFee += amountWithoutFee;
                totalAmountWithFee += amountWithFee;
                totalFees += fee;

                data.push(row);
            });
            totalAmountWithoutFee = this._thUtils.roundNumberToTwoDecimals(totalAmountWithoutFee);
            totalAmountWithFee = this._thUtils.roundNumberToTwoDecimals(totalAmountWithFee);
            totalFees = this._thUtils.roundNumberToTwoDecimals(totalFees);

            data.push([this._appContext.thTranslate.translate('Total'), totalTransaction, totalAmountWithFee, totalAmountWithoutFee, totalFees]);
            resolve(data);
        }).catch((e) => { reject(e) });
    }

    private createPaymentMethodIdToNameMap(): Promise<any> {
        return new Promise<any>((resolve: { (result: any): void }, reject: { (err: ThError): void }) => {
            let settingsRepository = this._appContext.getRepositoryFactory().getSettingsRepository();
            settingsRepository.getPaymentMethods().then((paymentMethodL) => {
                let pmIdToNameMap = {}
                paymentMethodL.forEach((pm) => { pmIdToNameMap[pm.id] = this._appContext.thTranslate.translate(pm.name) });
                pmIdToNameMap[InvoicePaymentMethodType.PayInvoiceByAgreement + ""] = this._appContext.thTranslate.translate("Paid By Agreement");
                resolve(pmIdToNameMap);
            });
        });
    }

    private getPaymentMethodsDetailsDict(): Object {
        let dic = {};
        this._paidInvoiceList.forEach((invoice) => {
            invoice.payerList.forEach((ipayer: InvoicePayerDO) => {
                ipayer.paymentList.forEach(payment => {
                    let pMethod = payment.paymentMethod.value;
                    if (payment.paymentMethod.type == InvoicePaymentMethodType.PayInvoiceByAgreement) {
                        pMethod = InvoicePaymentMethodType.PayInvoiceByAgreement + "";
                    }
                    let pPrice = payment.amount;
                    let pPriceWithFeesIncluded = payment.amountPlusTransactionFee;
                    if (!dic[pMethod]) {
                        dic[pMethod] = {
                            transactions: invoice.getAccountingFactor(),
                            amountWithoutFee: pPrice * invoice.getAccountingFactor(),
                            amountWithFee: pPriceWithFeesIncluded * invoice.getAccountingFactor()
                        }
                    }
                    else {
                        dic[pMethod].transactions += invoice.getAccountingFactor();
                        dic[pMethod].amountWithoutFee += pPrice * invoice.getAccountingFactor();
                        dic[pMethod].amountWithFee += pPriceWithFeesIncluded * invoice.getAccountingFactor();
                    }
                });
            })
        });
        return dic;
    }
}
