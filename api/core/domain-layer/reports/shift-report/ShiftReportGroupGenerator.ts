import { AppContext } from '../../../utils/AppContext';
import { SessionContext } from '../../../utils/SessionContext';
import { ThError } from '../../../utils/th-responses/ThError';
import { InvoiceGroupSearchResultRepoDO } from '../../../data-layer/invoices-deprecated/repositories/IInvoiceGroupsRepository';
import { InvoiceGroupDO } from '../../../data-layer/invoices-deprecated/data-objects/InvoiceGroupDO';
import { InvoiceDO, InvoicePaymentStatus } from '../../../data-layer/invoices-deprecated/data-objects/InvoiceDO';
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
import { AddOnProductLoader, AddOnProductItemContainer } from '../../add-on-products/validators/AddOnProductLoader';
import { ShiftReportByPaymentMethodSectionGenerator } from './strategies/ShiftReportByPaymentMethodSectionGenerator';
import { ShiftReportByCategorySectionGenerator } from './strategies/ShiftReportByCategorySectionGenerator';
import { ShiftReportByAopNameSectionGenerator } from './strategies/ShiftReportByAopNameSectionGenerator';
import { ShiftReportPaidInvoicesSectionGenerator } from './strategies/ShiftReportPaidInvoicesSectionGenerator';
import { CommonValidationStructures } from "../../common/CommonValidations";
import { ShiftReportPaidByAgreementSectionGenerator } from "./strategies/ShiftReportPaidByAgreementSectionGenerator";
import { ShiftReportLossAcceptedByManagementInvoicesSectionGenerator } from "./strategies/ShiftReportLossAcceptedByManagementInvoicesSectionGenerator";

import _ = require("underscore");

export class ShiftReportGroupGenerator extends AReportGeneratorStrategy {
	private _shiftReportParams: ShiftReportParams;
	private _allInvoiceGroupList: InvoiceGroupDO[];
	private _paidInvoiceGroupList: InvoiceGroupDO[];
	private _lossAcceptedByManagementInvoiceGroupList: InvoiceGroupDO[];
	private _aopContainer: AddOnProductItemContainer;

	protected getParamsValidationStructure(): IValidationStructure {
		return new ObjectValidationStructure([
			{
				key: "startDate",
				validationStruct: CommonValidationStructures.getThDateDOValidationStructure()
			},
			{
				key: "endDate",
				validationStruct: CommonValidationStructures.getThDateDOValidationStructure()
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

		this._shiftReportParams = {
			dateInterval: ThDateIntervalDO.buildThDateIntervalDO(startDate, endDate),
			startTime: ThTimestampDO.buildThTimestampDO(startDate, startHour),
			endTime: ThTimestampDO.buildThTimestampDO(endDate, endHour)
		}
	}

	protected loadDependentDataCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
		let igRepository = this._appContext.getRepositoryFactory().getInvoiceGroupsRepositoryDeprecated();
		let igMeta = { hotelId: this._sessionContext.sessionDO.hotel.id };
		let searchCriteria = {
			paidInterval: this._shiftReportParams.dateInterval
		};
		igRepository.getInvoiceGroupList(igMeta, searchCriteria)
			.then((result: InvoiceGroupSearchResultRepoDO) => {
				let invoiceGroupList = result.invoiceGroupList;
				this._allInvoiceGroupList = invoiceGroupList;
				this._paidInvoiceGroupList = this.getFilteredInvoiceGroupList(invoiceGroupList, (invoice: InvoiceDO) => { return invoice.isPaid(); });
				this._lossAcceptedByManagementInvoiceGroupList = this.getFilteredInvoiceGroupList(invoiceGroupList, (invoice: InvoiceDO) => { return invoice.isLossAcceptedByManagement(); });

				let aopLoader = new AddOnProductLoader(this._appContext, this._sessionContext);
				return aopLoader.loadAll();
			}).then((aopContainer: AddOnProductItemContainer) => {
				this._aopContainer = aopContainer;
				resolve(true);
			}).catch((e) => {
				reject(e);
			});
	}

	private getFilteredInvoiceGroupList(invoiceGroupList: InvoiceGroupDO[], checkInvoice: { (invoice: InvoiceDO): boolean }): InvoiceGroupDO[] {
		var filteredInvoiceGroupList: InvoiceGroupDO[] = [];
		invoiceGroupList.forEach((ig) => {
			let filteredInvoiceList = _.filter(ig.invoiceList, (invoice: InvoiceDO) => {
				return checkInvoice(invoice) &&
					this.invoicePaidInTimeFrame(invoice, this._shiftReportParams.startTime, this._shiftReportParams.endTime);
			});
			if (filteredInvoiceList.length > 0) {
				let igCopy = new InvoiceGroupDO();
				igCopy.buildFromObject(ig);
				igCopy.invoiceList = filteredInvoiceList;
				filteredInvoiceGroupList.push(igCopy);
			}
		});
		return filteredInvoiceGroupList;
	}

	private invoicePaidInTimeFrame(invoice: InvoiceDO, startTime: ThTimestampDO, endTime: ThTimestampDO) {
		return (invoice.paidDateTimeUtcTimestamp >= startTime.getUtcTimestamp() && invoice.paidDateTimeUtcTimestamp < endTime.getUtcTimestamp());
	}

	protected getMeta(): ReportGroupMeta {
		var startNameKey: string = this._appContext.thTranslate.translate("Start Time");
		var endNameKey: string = this._appContext.thTranslate.translate("End Time");
		var displayParams = {};
		displayParams[startNameKey] = this._shiftReportParams.startTime;
		displayParams[endNameKey] = this._shiftReportParams.endTime;
		return {
			name: "Shift Report",
			displayParams: displayParams
		}
	}
	protected getSectionGenerators(): IReportSectionGeneratorStrategy[] {
		return [
			new ShiftReportByPaymentMethodSectionGenerator(this._appContext, this._sessionContext, this._globalSummary, this._paidInvoiceGroupList),
			new ShiftReportPaidByAgreementSectionGenerator(this._appContext, this._sessionContext, this._globalSummary, this._paidInvoiceGroupList),
			new ShiftReportPaidInvoicesSectionGenerator(this._appContext, this._sessionContext, this._globalSummary, this._allInvoiceGroupList, this._paidInvoiceGroupList),
			new ShiftReportByCategorySectionGenerator(this._appContext, this._sessionContext, this._globalSummary, this._paidInvoiceGroupList, this._aopContainer, {
				title: "Transactions Grouped by Category"
			}),
			new ShiftReportByAopNameSectionGenerator(this._appContext, this._sessionContext, this._globalSummary, this._paidInvoiceGroupList),
			new ShiftReportByCategorySectionGenerator(this._appContext, this._sessionContext, this._globalSummary, this._lossAcceptedByManagementInvoiceGroupList, this._aopContainer, {
				title: "Loss Accepted By Management Transactions Grouped by Category"
			}),
			new ShiftReportLossAcceptedByManagementInvoicesSectionGenerator(this._appContext, this._sessionContext, this._globalSummary, this._allInvoiceGroupList, this._lossAcceptedByManagementInvoiceGroupList)

		];
	}
}
