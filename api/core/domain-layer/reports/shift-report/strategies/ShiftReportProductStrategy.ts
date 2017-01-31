import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { ThError } from '../../../../utils/th-responses/ThError';
import { ThDateIntervalDO } from '../../../../utils/th-dates/data-objects/ThDateIntervalDO';
import { InvoicePaymentStatus } from '../../../../data-layer/invoices/data-objects/InvoiceDO';
import { InvoiceItemDO, InvoiceItemType } from '../../../../data-layer/invoices/data-objects/items/InvoiceItemDO';
import { InvoiceGroupSearchResultRepoDO } from '../../../../data-layer/invoices/repositories/IInvoiceGroupsRepository';
import { ShiftReportUtils } from './ShiftReportUtils';
import { AReportSectionGeneratorStrategy } from '../../common/report-section-generator/AReportSectionGeneratorStrategy';
import { ShiftReportParams } from './ShiftReportParams';
import { ReportSectionHeader } from '../../common/result/ReportSection';

export class ShiftReportProductStrategy extends AReportSectionGeneratorStrategy {
	private _utils: ShiftReportUtils;

	constructor(appContext: AppContext, private _sessionContext: SessionContext, private _params: ShiftReportParams) {
		super(appContext);
		this._utils = new ShiftReportUtils(this._appContext, this._sessionContext);
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
		this.mergeProductDetailsDict(this._params.dateInterval).then((mpmDetailsDict) => {
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
		}).catch((e) => { reject(e) });
	}

	private mergeProductDetailsDict(dateInterval: ThDateIntervalDO): Promise<any> {
		let igRepository = this._appContext.getRepositoryFactory().getInvoiceGroupsRepository();

		let igMeta = { hotelId: this._sessionContext.sessionDO.hotel.id };
		let searchCriteria = {
			invoicePaymentStatus: InvoicePaymentStatus.Paid,
			paidInterval: dateInterval
		};

		return new Promise<any>((resolve: { (result: any): void }, reject: { (err: ThError): void }) => {
			let dic = {}
			igRepository.getInvoiceGroupList(igMeta, searchCriteria).then((results: InvoiceGroupSearchResultRepoDO) => {
				results.invoiceGroupList.forEach((ig) => {
					let invoiceL = ig.invoiceList;
					invoiceL.forEach((invoice) => {
						invoice.paidDateTimeUtcTimestamp
						if (invoice.isPaid() && this._utils.invoicePaidInTimeFrame(invoice, this._params.startTime, this._params.endTime)) {
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
							})
						}
					})
				})
				resolve(dic);
			});
		});
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
