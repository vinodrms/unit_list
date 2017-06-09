import { ThDateDO } from "../../../utils/th-dates/data-objects/ThDateDO";
import { AReportGeneratorStrategy } from "../common/report-generator/AReportGeneratorStrategy";
import { IValidationStructure } from "../../../utils/th-validation/structure/core/IValidationStructure";
import { ObjectValidationStructure } from "../../../utils/th-validation/structure/ObjectValidationStructure";
import { CommonValidationStructures } from "../../common/CommonValidations";
import { ArrayValidationStructure } from "../../../utils/th-validation/structure/ArrayValidationStructure";
import { StringValidationRule } from "../../../utils/th-validation/rules/StringValidationRule";
import { PrimitiveValidationStructure } from "../../../utils/th-validation/structure/PrimitiveValidationStructure";
import { ThError } from "../../../utils/th-responses/ThError";
import { ReportGroupMeta } from "../common/result/ReportGroup";
import { PageOrientation } from "../../../services/pdf-reports/PageOrientation";
import { CustomerDO } from "../../../data-layer/customers/data-objects/CustomerDO";
import { IReportSectionGeneratorStrategy } from "../common/report-section-generator/IReportSectionGeneratorStrategy";

export class InvoicesReportGroupGenerator extends AReportGeneratorStrategy {
	private _startDate: ThDateDO;
	private _endDate: ThDateDO;
	private _customerIdList: string[];
	private _customerList: CustomerDO[];

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
				key: "customerIdList",
				validationStruct: new ArrayValidationStructure(new PrimitiveValidationStructure(new StringValidationRule()))
			}
		]);
	}

	protected loadParameters(params: any) {
		this._startDate = new ThDateDO();
		this._startDate.buildFromObject(params.startDate);
		this._endDate = new ThDateDO();
		this._endDate.buildFromObject(params.endDate);
		this._customerIdList = params.customerIdList;
	}

	protected loadDependentDataCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
		let customersRepo = this._appContext.getRepositoryFactory().getCustomerRepository();
		customersRepo.getCustomerList({ hotelId: this._sessionContext.sessionDO.hotel.id }, { customerIdList: this._customerIdList })
			.then(result => {
				this._customerList = result.customerList;
				resolve(true);
			}).catch(e => {
				reject(e);
			})
	}

	protected getMeta(): ReportGroupMeta {
		var startDateKey: string = this._appContext.thTranslate.translate("Start Date");
		var endDateKey: string = this._appContext.thTranslate.translate("End Date");
		var customerListKey: string = this._appContext.thTranslate.translate("Customers");

		var displayParams = {};
		displayParams[startDateKey] = this._startDate;
		displayParams[endDateKey] = this._endDate;

		displayParams[customerListKey] = '';
		this._customerList.forEach((customer: CustomerDO, index) => {
            displayParams[customerListKey] += customer.customerDetails.getName();
            displayParams[customerListKey] += (index != (this._customerList.length -1)) ? ", ": "";
        });

		return {
			name: "Invoices Report",
			pageOrientation: PageOrientation.Landscape,
			displayParams: displayParams
		}
	}

	protected getSectionGenerators(): IReportSectionGeneratorStrategy[] {
		return [];
	}
}