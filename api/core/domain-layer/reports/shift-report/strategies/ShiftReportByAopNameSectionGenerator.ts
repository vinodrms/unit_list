import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { ThError } from '../../../../utils/th-responses/ThError';
import { ThUtils } from '../../../../utils/ThUtils';
import { InvoicePaymentStatus } from '../../../../data-layer/invoices/data-objects/InvoiceDO';
import { InvoiceGroupDO } from '../../../../data-layer/invoices/data-objects/InvoiceGroupDO';
import { InvoiceItemDO, InvoiceItemType } from '../../../../data-layer/invoices/data-objects/items/InvoiceItemDO';
import { AReportSectionGeneratorStrategy } from '../../common/report-section-generator/AReportSectionGeneratorStrategy';
import { ShiftReportParams } from '../ShiftReportParams';
import { ReportSectionHeader } from '../../common/result/ReportSection';
import { AddOnProductItemContainer } from '../../../add-on-products/validators/AddOnProductLoader';

export class ShiftReportByAopNameSectionGenerator extends AReportSectionGeneratorStrategy {
    private _thUtils: ThUtils;

    constructor(appContext: AppContext, private _sessionContext: SessionContext,
        private _paidInvoiceGroupList: InvoiceGroupDO[], private _params: ShiftReportParams) {
        super(appContext);
        this._thUtils = new ThUtils();
    }

    protected getHeader(): ReportSectionHeader {
        return {
            display: true,
            values: [
                "Add On Product",
                "Transactions",
                "Amount"
            ]
        };
    }

    protected getDataCore(resolve: { (result: any[][]): void }, reject: { (err: ThError): void }) {
        let mpmDetailsDict = this.getProductDetailsDict();
        var totalTransaction = 0;
        var totalAmount = 0;
        var data = [];
        Object.keys(mpmDetailsDict).forEach((productName) => {
            let transactions = mpmDetailsDict[productName].transactions;
            let amount = this._thUtils.roundNumberToTwoDecimals(mpmDetailsDict[productName].amount);

            let row = [productName, transactions, amount];

            totalTransaction += transactions;
            totalAmount += amount;

            data.push(row);
        });
        totalAmount = this._thUtils.roundNumberToTwoDecimals(totalAmount);
        data.push(['Total', totalTransaction, totalAmount]);
        resolve(data);
    }

    private getProductDetailsDict(): Object {
        let dic = {}
        this._paidInvoiceGroupList.forEach((ig) => {
            ig.invoiceList.forEach((invoice) => {
                invoice.itemList.forEach((item) => {
                    if (item.type == InvoiceItemType.AddOnProduct) {
                        let name = this.getDisplayNameForItem(item);
                        let price = item.meta.getUnitPrice() * item.meta.getNumberOfItems();
                        let transactions = this.getQuantityForItem(item);
                        if (!dic[name]) {
                            dic[name] = {
                                transactions: transactions,
                                amount: price
                            }
                        }
                        else {
                            dic[name].transactions += transactions;
                            dic[name].amount += price
                        }
                    }
                });
            });
        });
        return dic;
    }

    private getDisplayNameForItem(item: InvoiceItemDO): string {
        return item.meta.getDisplayName(this._appContext.thTranslate);
    }
    private getQuantityForItem(item: InvoiceItemDO): number {
        return item.meta.getNumberOfItems();
    }
}
