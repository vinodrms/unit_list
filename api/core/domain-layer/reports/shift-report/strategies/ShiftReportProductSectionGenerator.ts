import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { ThError } from '../../../../utils/th-responses/ThError';
import { InvoicePaymentStatus } from '../../../../data-layer/invoices/data-objects/InvoiceDO';
import { InvoiceGroupDO } from '../../../../data-layer/invoices/data-objects/InvoiceGroupDO';
import { InvoiceItemDO, InvoiceItemType } from '../../../../data-layer/invoices/data-objects/items/InvoiceItemDO';
import { AReportSectionGeneratorStrategy } from '../../common/report-section-generator/AReportSectionGeneratorStrategy';
import { ShiftReportParams } from './ShiftReportParams';
import { ReportSectionHeader } from '../../common/result/ReportSection';

export class ShiftReportProductSectionGenerator extends AReportSectionGeneratorStrategy {

	constructor(appContext: AppContext, private _sessionContext: SessionContext,
		private _paidInvoiceGroupList: InvoiceGroupDO[], private _params: ShiftReportParams) {
		super(appContext);
	}

	protected getHeader(): ReportSectionHeader {
		return {
			display: true,
			values: [
				"Product",
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
			let amount = mpmDetailsDict[productName].amount;

			let row = [productName, transactions, amount];

			totalTransaction += transactions;
			totalAmount += amount;

			data.push(row);
		});
		data.push(['Total', totalTransaction, totalAmount]);
		resolve(data);
	}

	private getProductDetailsDict(): Object {
		let dic = {}
		this._paidInvoiceGroupList.forEach((ig) => {
			ig.invoiceList.forEach((invoice) => {
				invoice.itemList.forEach((item) => {
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
				});
			});
		});
		return dic;
	}

	private getDisplayNameForItem(item: InvoiceItemDO): string {
		// Price Products are aggregated with the `Rooms` key
		if (item.type == InvoiceItemType.Booking) {
			return this._appContext.thTranslate.translate("Rooms");
		}
		return item.meta.getDisplayName(this._appContext.thTranslate);
	}
	private getQuantityForItem(item: InvoiceItemDO): number {
		// we do not want to count the number of nights as separate items
		if (item.type == InvoiceItemType.Booking) {
			return 1;
		}
		return item.meta.getNumberOfItems();
	}
}
