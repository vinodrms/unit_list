import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { ThError } from '../../../../utils/th-responses/ThError';
import { ThDateIntervalDO } from '../../../../utils/th-dates/data-objects/ThDateIntervalDO';
import { InvoiceDO, InvoicePaymentStatus } from '../../../../data-layer/invoices/data-objects/InvoiceDO';
import { InvoiceGroupDO } from '../../../../data-layer/invoices/data-objects/InvoiceGroupDO';
import { InvoiceGroupSearchResultRepoDO } from '../../../../data-layer/invoices/repositories/IInvoiceGroupsRepository';
import { ShiftReportUtils } from './ShiftReportUtils';
import { AReportSectionGeneratorStrategy } from '../../common/report-section-generator/AReportSectionGeneratorStrategy';
import { ShiftReportParams } from './ShiftReportParams';
import { ReportSectionHeader } from '../../common/result/ReportSection';

export class ShiftReportPaymentMethodStrategy extends AReportSectionGeneratorStrategy {
	private _utils: ShiftReportUtils;

	constructor(appContext: AppContext, private _sessionContext: SessionContext, private _params: ShiftReportParams) {
		super(appContext);
		this._utils = new ShiftReportUtils(this._appContext, this._sessionContext);
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

	protected getDataCore(resolve: { (result: any[][]): void }, reject: { (err: ThError): void }) {
		this.createPaymentMethodIdToNameMap().then((pmIdToNameMap) => {
			this.mergedPaymentMethodsDetailsDict(this._params.dateInterval).then((mpmDetailsDict) => {
				var totalTransaction = 0;
				var totalAmount = 0;
				var data: any[] = [];
				Object.keys(mpmDetailsDict).forEach((pMethod) => {
					let pmName = pmIdToNameMap[pMethod];
					let transactions = mpmDetailsDict[pMethod].transactions;

					let amount = mpmDetailsDict[pMethod].amount;
					let row = [pmName, transactions, amount];

					totalTransaction += transactions;
					totalAmount += amount;

					data.push(row);
				});
				data.push(['Total', totalTransaction, totalAmount]);
				resolve(data);
			}).catch((e) => { reject(e) });
		}).catch((e) => { reject(e) });
	}

	private createPaymentMethodIdToNameMap(): Promise<any> {
		return new Promise<any>((resolve: { (result: any): void }, reject: { (err: ThError): void }) => {
			let settingsRepository = this._appContext.getRepositoryFactory().getSettingsRepository();
			settingsRepository.getPaymentMethods().then((paymentMethodL) => {
				let pmIdToNameMap = {}
				paymentMethodL.forEach((pm) => { pmIdToNameMap[pm.id] = pm.name });
				resolve(pmIdToNameMap);
			});
		});
	}

	private mergedPaymentMethodsDetailsDict(dateInterval: ThDateIntervalDO): Promise<any> {
		let igRepository = this._appContext.getRepositoryFactory().getInvoiceGroupsRepository();

		let igMeta = { hotelId: this._sessionContext.sessionDO.hotel.id };
		let searchCriteria = {
			invoicePaymentStatus: InvoicePaymentStatus.Paid,
			paidInterval: dateInterval
		};

		return new Promise<any>((resolve: { (result: any): void }, reject: { (err: ThError): void }) => {
			igRepository.getInvoiceGroupList(igMeta, searchCriteria).then((results: InvoiceGroupSearchResultRepoDO) => {
				let dic = {};
				results.invoiceGroupList.forEach((ig) => {
					let ipayerL = this.getAggregatedPaidPayerList(ig);
					ipayerL.forEach((ipayer) => {
						let pMethod = ipayer.paymentMethod.value;
						let pPrice = ipayer.priceToPay;
						if (!dic[pMethod]) {
							dic[pMethod] = {
								transactions: 1,
								amount: pPrice
							}
						}
						else {
							dic[pMethod].transactions++;
							dic[pMethod].amount += pPrice;
						}
					})
				})
				resolve(dic);
			});
		});
	}

	private getAggregatedPaidPayerList(ig: InvoiceGroupDO) {
		let paidInvoicesL = [];
		ig.invoiceList.forEach((invoice) => {
			if (invoice.isPaid() && this._utils.invoicePaidInTimeFrame(invoice, this._params.startTime, this._params.endTime)) {
				paidInvoicesL.push(invoice);
				invoice.payerList
			}
		});
		return _.reduce(paidInvoicesL, (result, invoice: InvoiceDO) => {
			return _.union(result, invoice.payerList);
		}, []);
	}
}