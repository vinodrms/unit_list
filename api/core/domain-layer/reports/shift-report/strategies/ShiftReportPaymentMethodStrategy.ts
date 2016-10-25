import { ReportDO } from '../../../../data-layer/reports/data-objects/ReportDO';
import { ReportMetadataDO, FieldType } from '../../../../data-layer/reports/data-objects/ReportMetadataDO';
import { HotelOperationsArrivalsInfo } from '../../../../domain-layer/hotel-operations/dashboard/arrivals/utils/HotelOperationsArrivalsInfo';
import { ReportType } from '../../../../data-layer/reports/data-objects/ReportMetadataDO';
import { AReportGeneratorStrategy } from '../../AReportGeneratorStrategy';
import { ThError } from '../../../../utils/th-responses/ThError';
import { HotelOperationsArrivalsReader } from '../../../../domain-layer/hotel-operations/dashboard/arrivals/HotelOperationsArrivalsReader';

import { KeyMetricReader } from '../../../../domain-layer/yield-manager/key-metrics/KeyMetricReader';
import { YieldManagerPeriodDO } from '../../../../domain-layer/yield-manager/utils/YieldManagerPeriodDO';
import { KeyMetricsResult, KeyMetricsResultItem, KeyMetric, KeyMetricValueType, IKeyMetricValue, PriceKeyMetric, PercentageKeyMetric, InventoryKeyMetric } from '../../../../domain-layer/yield-manager/key-metrics/utils/KeyMetricsResult';
import { KeyMetricType } from '../../../../domain-layer/yield-manager/key-metrics/utils/KeyMetricType';

import { ThDateDO } from '../../../../utils/th-dates/data-objects/ThDateDO';
import { ThDateIntervalDO } from '../../../../utils/th-dates/data-objects/ThDateIntervalDO';
import { InvoiceDO, InvoicePaymentStatus } from '../../../../data-layer/invoices/data-objects/InvoiceDO';
import { InvoiceGroupDO } from '../../../../data-layer/invoices/data-objects/InvoiceGroupDO';

import { InvoiceGroupSearchResultRepoDO } from '../../../../data-layer/invoices/repositories/IInvoiceGroupsRepository';

export class ShiftReportPaymentMethodStrategy extends AReportGeneratorStrategy {
	protected _reportType: ReportType = ReportType.ShiftReportPaymentMethod;

	protected validParameters(params: Object) {
		return true;
	}

	protected buildReportData(reportMetadata): Promise<ReportDO> {
		return new Promise<ReportDO>((resolve: { (result: ReportDO): void }, reject: { (err: ThError): void }) => {
			var report = new ReportDO();
			report.metadata = reportMetadata;
			report.data = [];
			//TODO: Use date from parameters

			let dateInterval = ThDateIntervalDO.buildThDateIntervalDO(ThDateDO.buildThDateDO(2016, 9, 23), ThDateDO.buildThDateDO(2016, 9, 26));

			this.createPaymentMethodIdToNameMap().then((pmIdToNameMap) => {
				this.mergedPaymentMethodsDetailsDict(dateInterval).then((mpmDetailsDict) => {
					var totalTransaction = 0;
					var totalAmount = 0;
					Object.keys(mpmDetailsDict).forEach((pMethod) => {
						let pmName = pmIdToNameMap[pMethod];
						let transactions = mpmDetailsDict[pMethod].transactions;

						let amount = mpmDetailsDict[pMethod].amount;
						let row = [pmName, transactions, amount];

						totalTransaction+= transactions;
						totalAmount += amount;

						report.data.push(row);
					})
					report.data.push(['Total', totalTransaction, totalAmount]);
					resolve(report);
				})

			})
		});
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

	private getAggregatedPaidPayerList(ig: InvoiceGroupDO){
		let paidInvoicesL = [];
		ig.invoiceList.forEach((invoice) => {
			if(invoice.isPaid()){
				paidInvoicesL.push(invoice);
				invoice.payerList
			}
		});
		return _.reduce(paidInvoicesL, (result, invoice: InvoiceDO) => {
			return _.union(result, invoice.payerList);
		}, []);
	}
}

// results.invoiceGroupList.forEach((ig) =>{
// 	let invoiceL = ig.invoiceList;
// 	invoiceL.forEach((invoice) => {
// 		if (invoice.isPaid()){
// 			invoice.itemList.forEach((item) => {
// 				item.meta.getDisplayName
// 			})
// 		}
// 	})
// })
