import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
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
import { InvoiceItemDO, InvoiceItemType } from '../../../../data-layer/invoices/data-objects/items/InvoiceItemDO';
import { InvoiceGroupDO } from '../../../../data-layer/invoices/data-objects/InvoiceGroupDO';

import { InvoiceGroupSearchResultRepoDO } from '../../../../data-layer/invoices/repositories/IInvoiceGroupsRepository';

import { ShiftReportUtils } from './ShiftReportUtils';

export class ShiftReportProductStrategy extends AReportGeneratorStrategy {
	protected _reportType: ReportType = ReportType.ShiftReportProduct;
	private _utils: ShiftReportUtils;

	constructor(protected _appContext: AppContext, protected _sessionContext: SessionContext) {
		super(_appContext, _sessionContext);
		this._utils = new ShiftReportUtils(_appContext, _sessionContext);
	}
	
	protected validParameters(params: Object) {
		return true;
	}

	protected buildReportData(reportMetadata): Promise<ReportDO> {
		return new Promise<ReportDO>((resolve: { (result: ReportDO): void }, reject: { (err: ThError): void }) => {
			var report = new ReportDO();
			report.metadata = reportMetadata;
			report.data = [];
			//TODO: Use date from parameters

			let dateInterval = this._params.dateInterval;

			this.mergeProductDetailsDict(dateInterval).then((mpmDetailsDict) => {
				var totalTransaction = 0;
				var totalAmount = 0;
				Object.keys(mpmDetailsDict).forEach((productName) => {
					let transactions = mpmDetailsDict[productName].transactions;
					let amount = mpmDetailsDict[productName].amount;

					let row = [productName, transactions, amount];

					totalTransaction += transactions;
					totalAmount += amount;

					report.data.push(row);
				})
				report.data.push(['Total', totalTransaction, totalAmount]);
				resolve(report);
			})
		});
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
								if (!dic[name]) {
									dic[name] = {
										transactions: 1,
										amount: price
									}
								}
								else {
									dic[name].transactions++;
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
		if (item.type == InvoiceItemType.Booking) {
			return "Bookings"
		}
		else {
			return item.meta.getDisplayName(this._appContext.thTranslate);
		}
	}
}
