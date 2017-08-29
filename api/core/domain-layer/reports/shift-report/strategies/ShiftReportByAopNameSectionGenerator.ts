import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { ThError } from '../../../../utils/th-responses/ThError';
import { InvoicePaymentStatus } from '../../../../data-layer/invoices-deprecated/data-objects/InvoiceDO';
import { InvoiceGroupDO } from '../../../../data-layer/invoices-deprecated/data-objects/InvoiceGroupDO';
import { InvoiceItemDO, InvoiceItemType, InvoiceItemAccountingType } from '../../../../data-layer/invoices-deprecated/data-objects/items/InvoiceItemDO';
import { TaxDO } from '../../../../data-layer/taxes/data-objects/TaxDO';
import { InvoiceItemVM } from '../../../invoices-deprecated/invoice-confirmations/InvoiceItemVM';
import { AReportSectionGeneratorStrategy } from '../../common/report-section-generator/AReportSectionGeneratorStrategy';
import { ReportSectionHeader, ReportSectionMeta } from '../../common/result/ReportSection';
import { AddOnProductItemContainer } from '../../../add-on-products/validators/AddOnProductLoader';

export class ShiftReportByAopNameSectionGenerator extends AReportSectionGeneratorStrategy {

    constructor(appContext: AppContext, sessionContext: SessionContext, globalSummary: Object,
        private _paidInvoiceGroupList: InvoiceGroupDO[]) {
        super(appContext, sessionContext, globalSummary);
    }

    protected getHeader(): ReportSectionHeader {
        return {
            display: true,
            values: [
                "Add On Product",
                "Transactions",
                "Net Price",
                "VAT",
                "Subtotal"
            ]
        };
    }

    protected getMeta(): ReportSectionMeta {
        return {
            title: "Add On Product Transactions"
        }
    }

    protected getGlobalSummary(): Object {
		return {}
	}

    protected getDataCore(resolve: { (result: any[][]): void }, reject: { (err: ThError): void }) {
        let mpmDetailsDict = this.getProductDetailsDict();
        var totalTransaction = 0;
        var totalNet = 0, totalVat = 0, total = 0;
        var data = [];
        Object.keys(mpmDetailsDict).forEach((aopId) => {
            let transactions = mpmDetailsDict[aopId].transactions;
            let itemNet = this._thUtils.roundNumberToTwoDecimals(mpmDetailsDict[aopId].itemNet);
            let itemVat = this._thUtils.roundNumberToTwoDecimals(mpmDetailsDict[aopId].itemVat);
            let itemTotal = this._thUtils.roundNumberToTwoDecimals(mpmDetailsDict[aopId].itemTotal);
            let displayName = mpmDetailsDict[aopId].displayName;

            let row = [displayName, transactions, itemNet, itemVat, itemTotal];

            totalTransaction += transactions;
            totalNet += itemNet;
            totalVat += itemVat;
            total += itemTotal;

            data.push(row);
        });
        // sort by display name
        data.sort((row1: string[], row2: string[]) => {
            return row1[0].localeCompare(row2[0]);
        });

        totalNet = this._thUtils.roundNumberToTwoDecimals(totalNet);
        totalVat = this._thUtils.roundNumberToTwoDecimals(totalVat);
        total = this._thUtils.roundNumberToTwoDecimals(total);
        data.push([this._appContext.thTranslate.translate('Total'), totalTransaction, totalNet, totalVat, total]);
        resolve(data);
    }

    private getProductDetailsDict(): Object {
        let dic = {}
        this._paidInvoiceGroupList.forEach((ig) => {
            ig.invoiceList.forEach((invoice) => {
                invoice.itemList.forEach((item) => {
                    if (item.type == InvoiceItemType.AddOnProduct) {
                        let displayName = this.getDisplayNameForItem(item);
                        let price = item.meta.getTotalPrice();
                        let transactions = this.getQuantityForItem(item);
                        let aopId = item.id;

                        let itemVM = new InvoiceItemVM(this._appContext.thTranslate);
                        itemVM.buildFromInvoiceItemDO(item, ig.vatTaxListSnapshot);

                        let itemNet = itemVM.subtotal;
                        let itemVat = itemVM.vat;
                        let itemTotal = itemNet + itemVat;

                        if (!dic[aopId]) {
                            dic[aopId] = {
                                transactions: transactions,
                                itemNet: itemNet,
                                itemVat: itemVat,
                                itemTotal: itemTotal,
                                displayName: displayName
                            }
                        }
                        else {
                            dic[aopId].transactions += transactions;
                            dic[aopId].itemNet += itemNet;
                            dic[aopId].itemVat += itemVat;
                            dic[aopId].itemTotal += itemTotal;
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
        let qtyFactor = item.accountingType === InvoiceItemAccountingType.Credit? -1 : 1;
        return item.meta.getNumberOfItems() * qtyFactor;
    }
}
