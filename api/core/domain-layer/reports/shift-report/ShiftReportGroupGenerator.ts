import { AppContext } from '../../../utils/AppContext';
import { SessionContext } from '../../../utils/SessionContext';
import { ThError } from '../../../utils/th-responses/ThError';
import { InvoiceGroupSearchResultRepoDO } from '../../../data-layer/invoices/repositories/IInvoiceGroupsRepository';
import { InvoiceGroupDO } from '../../../data-layer/invoices/data-objects/InvoiceGroupDO';
import { InvoiceDO, InvoicePaymentStatus } from '../../../data-layer/invoices/data-objects/InvoiceDO';
import { IValidationStructure } from '../../../utils/th-validation/structure/core/IValidationStructure';
import { ObjectValidationStructure } from '../../../utils/th-validation/structure/ObjectValidationStructure';
import { BookingValidationStructures } from '../../bookings/validators/BookingValidationStructures';
import { AReportGeneratorStrategy } from '../common/report-generator/AReportGeneratorStrategy';
import { IReportSectionGeneratorStrategy } from '../common/report-section-generator/IReportSectionGeneratorStrategy';
import { ShiftReportParams } from './ShiftReportParams';
import { ThDateDO } from '../../../utils/th-dates/data-objects/ThDateDO';
import { ThHourDO } from '../../../utils/th-dates/data-objects/ThHourDO';
import { ThDateIntervalDO } from '../../../utils/th-dates/data-objects/ThDateIntervalDO';
import { ThTimestampDO } from '../../../utils/th-dates/data-objects/ThTimestampDO';
import { ReportGroupMeta } from '../common/result/ReportGroup';
import { ShiftReportByPaymentMethodSectionGenerator } from './strategies/ShiftReportByPaymentMethodSectionGenerator';
import { ShiftReportByCategorySectionGenerator } from './strategies/ShiftReportByCategorySectionGenerator';
import { AddOnProductLoader, AddOnProductItemContainer } from '../../add-on-products/validators/AddOnProductLoader';

export class ShiftReportGroupGenerator extends AReportGeneratorStrategy {
	private _params: ShiftReportParams;
	private _paidInvoiceGroupList: InvoiceGroupDO[];
	private _aopContainer: AddOnProductItemContainer;

	constructor(appContext: AppContext, private _sessionContext: SessionContext) {
		super(appContext);
	}

	protected getParamsValidationStructure(): IValidationStructure {
		return new ObjectValidationStructure([
			{
				key: "startDate",
				validationStruct: BookingValidationStructures.getThDateDOValidationStructure()
			},
			{
				key: "endDate",
				validationStruct: BookingValidationStructures.getThDateDOValidationStructure()
			},
			{
				key: "startDateTime",
				validationStruct: BookingValidationStructures.getThHourDOValidationStructure()
			},
			{
				key: "endDateTime",
				validationStruct: BookingValidationStructures.getThHourDOValidationStructure()
			}
		]);
	}

	protected loadParameters(params: any) {
		var startDate = new ThDateDO();
		startDate.buildFromObject(params.startDate);
		var endDate = new ThDateDO();
		endDate.buildFromObject(params.endDate);

		let startHour = new ThHourDO();
		startHour.buildFromObject(params.startDateTime);
		let endHour = new ThHourDO();
		endHour.buildFromObject(params.endDateTime);

		this._params = {
			dateInterval: ThDateIntervalDO.buildThDateIntervalDO(startDate, endDate),
			startTime: ThTimestampDO.buildThTimestampDO(startDate, startHour),
			endTime: ThTimestampDO.buildThTimestampDO(endDate, endHour)
		}
	}

	protected loadDependentDataCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
		let igRepository = this._appContext.getRepositoryFactory().getInvoiceGroupsRepository();
		let igMeta = { hotelId: this._sessionContext.sessionDO.hotel.id };
		let searchCriteria = {
			invoicePaymentStatus: InvoicePaymentStatus.Paid,
			paidInterval: this._params.dateInterval
		};
		igRepository.getInvoiceGroupList(igMeta, searchCriteria)
			.then((result: InvoiceGroupSearchResultRepoDO) => {
				this._paidInvoiceGroupList = result.invoiceGroupList;
				this.filterPaidInvoicesWithinInterval();

				let aopLoader = new AddOnProductLoader(this._appContext, this._sessionContext);
				return aopLoader.loadAll();
			}).then((aopContainer: AddOnProductItemContainer) => {
				this._aopContainer = aopContainer;
				resolve(true);
			}).catch((e) => {
				reject(e);
			});
	}
	private filterPaidInvoicesWithinInterval() {
		this._paidInvoiceGroupList.forEach((ig) => {
			ig.invoiceList = _.filter(ig.invoiceList, (invoice: InvoiceDO) => {
				return invoice.isPaid() &&
					this.invoicePaidInTimeFrame(invoice, this._params.startTime, this._params.endTime);
			});
		});
	}
	private invoicePaidInTimeFrame(invoice: InvoiceDO, startTime: ThTimestampDO, endTime: ThTimestampDO) {
		return (invoice.paidDateTimeUtcTimestamp >= startTime.getUtcTimestamp() && invoice.paidDateTimeUtcTimestamp < endTime.getUtcTimestamp());
	}

	protected getMeta(): ReportGroupMeta {
		return {
			name: "Shift Report"
		}
	}
	protected getSectionGenerators(): IReportSectionGeneratorStrategy[] {
		return [
			new ShiftReportByPaymentMethodSectionGenerator(this._appContext, this._sessionContext, this._paidInvoiceGroupList, this._params),
			new ShiftReportByCategorySectionGenerator(this._appContext, this._sessionContext, this._paidInvoiceGroupList, this._aopContainer, this._params)
		];
	}
}