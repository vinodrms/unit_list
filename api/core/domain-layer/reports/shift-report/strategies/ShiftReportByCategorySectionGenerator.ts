import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { ThError } from '../../../../utils/th-responses/ThError';
import { TaxDO } from '../../../../data-layer/taxes/data-objects/TaxDO';
import { AReportSectionGeneratorStrategy } from '../../common/report-section-generator/AReportSectionGeneratorStrategy';
import { ReportSectionHeader, ReportSectionMeta } from '../../common/result/ReportSection';
import { AddOnProductItemContainer } from '../../../add-on-products/validators/AddOnProductLoader';
import { InvoiceDO, InvoicePaymentStatus } from '../../../../data-layer/invoices/data-objects/InvoiceDO';
import { InvoiceItemDO, InvoiceItemType } from '../../../../data-layer/invoices/data-objects/items/InvoiceItemDO';
import { InvoiceItemVM } from '../../../invoices/invoice-confirmations/InvoiceItemVM';

export class ShiftReportByCategorySectionGenerator extends AReportSectionGeneratorStrategy {

    constructor(appContext: AppContext, sessionContext: SessionContext, globalSummary: Object,
        private _paidInvoiceList: InvoiceDO[], private _aopContainer: AddOnProductItemContainer,
        private _sectionMeta: ReportSectionMeta) {
        super(appContext, sessionContext, globalSummary);
    }

    protected getHeader(): ReportSectionHeader {
        return {
            display: true,
            values: [
                "Product Category",
                "Transactions",
                "Net Price",
                "VAT",
                "Subtotal"
            ]
        };
    }

    protected getMeta(): ReportSectionMeta {
        return this._sectionMeta;
    }

    protected getGlobalSummary(): Object {
        return {}
    }

    protected getDataCore(resolve: { (result: any[][]): void }, reject: { (err: ThError): void }) {
        let mpmDetailsDict = this.getProductDetailsDict();
        var totalTransaction = 0;
        var totalNet = 0, totalVat = 0, total = 0;
        var data = [];
        Object.keys(mpmDetailsDict).forEach((productId) => {
            let transactions = Math.abs(mpmDetailsDict[productId].transactions);
            let itemNet = this._thUtils.roundNumberToTwoDecimals(mpmDetailsDict[productId].itemNet);
            let itemVat = this._thUtils.roundNumberToTwoDecimals(mpmDetailsDict[productId].itemVat);
            let itemTotal = this._thUtils.roundNumberToTwoDecimals(mpmDetailsDict[productId].itemTotal);
            let displayName = mpmDetailsDict[productId].displayName;

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
        this._paidInvoiceList.forEach((invoice) => {
            invoice.itemList.forEach((item) => {
                let details = this.getDisplayNameAndIdForItem(item);
                let price = item.meta.getTotalPrice();

                let itemVM = new InvoiceItemVM(this._appContext.thTranslate);
                itemVM.buildFromInvoiceItemDO(item, invoice.vatTaxListSnapshot);

                let itemNet = itemVM.subtotal;
                let itemVat = itemVM.vat;
                let itemTotal = itemNet + itemVat;

                let transactions = this.getQuantityForItem(item, invoice);
                if (!dic[details.id]) {
                    dic[details.id] = {
                        transactions: transactions,
                        itemNet: itemNet,
                        itemVat: itemVat,
                        itemTotal: itemTotal,
                        displayName: details.displayName
                    }
                }
                else {
                    dic[details.id].transactions += transactions;
                    dic[details.id].itemNet += itemNet;
                    dic[details.id].itemVat += itemVat;
                    dic[details.id].itemTotal += itemTotal;
                }
            });
        });
        return dic;
    }

    private getDisplayNameAndIdForItem(item: InvoiceItemDO): { displayName: string, id: string } {
        // Price Products are aggregated with the `Rooms` key
        if (item.type == InvoiceItemType.Booking) {
            return {
                displayName: this._appContext.thTranslate.translate("Rooms"),
                id: (InvoiceItemType.Booking + "")
            };
        }
        if (item.type == InvoiceItemType.InvoiceFee) {
            return {
                displayName: this._appContext.thTranslate.translate("Invoice Fee"),
                id: (InvoiceItemType.InvoiceFee + "")
            };
        }
        if (item.type == InvoiceItemType.RoomCommission) {
            return {
                displayName: this._appContext.thTranslate.translate("Deducted Room Commission"),
                id: (InvoiceItemType.RoomCommission + "")
            };
        }
        // fallback to add on products
        let aopItem = this._aopContainer.getAddOnProductItemById(item.id);
        if (this._thUtils.isUndefinedOrNull(aopItem, "category")) {
            return {
                displayName: this._appContext.thTranslate.translate("No Category"),
                id: ""
            }
        }
        return {
            displayName: this._appContext.thTranslate.translate(aopItem.category.name),
            id: aopItem.category.id
        };
    }
    private getQuantityForItem(item: InvoiceItemDO, invoice: InvoiceDO): number {
        let qtyFactor = invoice.getAccountingFactor();

        // we do not want to count the number of nights as separate rooms
        if (item.type == InvoiceItemType.Booking) {
            return qtyFactor;
        }
        return item.meta.getNumberOfItems() * qtyFactor;
    }
}
