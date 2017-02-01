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

export class ShiftReportByCategorySectionGenerator extends AReportSectionGeneratorStrategy {
	private _thUtils: ThUtils;

	constructor(appContext: AppContext, private _sessionContext: SessionContext,
		private _paidInvoiceGroupList: InvoiceGroupDO[], private _aopContainer: AddOnProductItemContainer,
		private _params: ShiftReportParams) {
		super(appContext);
		this._thUtils = new ThUtils();
	}

	protected getHeader(): ReportSectionHeader {
		return {
			display: true,
			values: [
				"Product Category",
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
		Object.keys(mpmDetailsDict).forEach((productId) => {
			let transactions = mpmDetailsDict[productId].transactions;
			let amount = this._thUtils.roundNumberToTwoDecimals(mpmDetailsDict[productId].amount);
			let displayName = mpmDetailsDict[productId].displayName;

			let row = [displayName, transactions, amount];

			totalTransaction += transactions;
			totalAmount += amount;

			data.push(row);
		});
		totalAmount = this._thUtils.roundNumberToTwoDecimals(totalAmount);
		data.push([this._appContext.thTranslate.translate('Total'), totalTransaction, totalAmount]);
		resolve(data);
	}

	private getProductDetailsDict(): Object {
		let dic = {}
		this._paidInvoiceGroupList.forEach((ig) => {
			ig.invoiceList.forEach((invoice) => {
				invoice.itemList.forEach((item) => {
					let details = this.getDisplayNameAndIdForItem(item);
					let price = item.meta.getUnitPrice() * item.meta.getNumberOfItems();
					let transactions = this.getQuantityForItem(item);
					if (!dic[details.id]) {
						dic[details.id] = {
							transactions: transactions,
							amount: price,
							displayName: details.displayName
						}
					}
					else {
						dic[details.id].transactions += transactions;
						dic[details.id].amount += price
					}
				});
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
	private getQuantityForItem(item: InvoiceItemDO): number {
		// we do not want to count the number of nights as separate rooms
		if (item.type == InvoiceItemType.Booking) {
			return 1;
		}
		return item.meta.getNumberOfItems();
	}
}
