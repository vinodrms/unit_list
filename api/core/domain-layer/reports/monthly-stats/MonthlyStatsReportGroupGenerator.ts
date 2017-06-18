import { AppContext } from '../../../utils/AppContext';
import { SessionContext } from '../../../utils/SessionContext';
import { AReportGeneratorStrategy } from '../common/report-generator/AReportGeneratorStrategy';
import { IValidationStructure } from '../../../utils/th-validation/structure/core/IValidationStructure';
import { ObjectValidationStructure } from '../../../utils/th-validation/structure/ObjectValidationStructure';
import { IReportSectionGeneratorStrategy } from '../common/report-section-generator/IReportSectionGeneratorStrategy';
import { ReportGroupMeta } from '../common/result/ReportGroup';
import { PageOrientation } from '../../../services/pdf-reports/PageOrientation';
import { CommonValidationStructures } from "../../common/CommonValidations";
import { ThDateDO } from "../../../utils/th-dates/data-objects/ThDateDO";
import { ThError } from "../../../utils/th-responses/ThError";
import { HotelDO } from "../../../data-layer/hotel/data-objects/HotelDO";
import { HotelDetailsBuilder, HotelDetailsDO } from "../../hotel-details/utils/HotelDetailsBuilder";

export class MonthlyStatsReportGroupGenerator extends AReportGeneratorStrategy {
	private _date: ThDateDO;

	protected getParamsValidationStructure(): IValidationStructure {
		return new ObjectValidationStructure([
			{
				key: "date",
				validationStruct: CommonValidationStructures.getThDateDOValidationStructure()
			},
		]);
	}
	protected loadParameters(params: any) {
		this._date = new ThDateDO();
		this._date.buildFromObject(params.date);
	}

	protected loadDependentDataCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
		let hotelRepo = this._appContext.getRepositoryFactory().getHotelRepository();
		hotelRepo.getHotelById(this._sessionContext.sessionDO.hotel.id)
			.then((hotelDO: HotelDO) => {
				var hotelDetailsBuilder = new HotelDetailsBuilder(this._sessionContext, hotelDO);
			return hotelDetailsBuilder.build();
			})
			.then((details: HotelDetailsDO) => {
				
				resolve(true);
			}).catch(e => {
				reject(e);
			})
	}

	protected getMeta(): ReportGroupMeta {
		var dateKey: string = this._appContext.thTranslate.translate("Date");
		var displayParams = {};
		displayParams[dateKey] = this._date
		return {
			name: "Monthly Stats Report",
			pageOrientation: PageOrientation.Landscape,
			displayParams: displayParams
		}
	}
	protected getSectionGenerators(): IReportSectionGeneratorStrategy[] {
		return [];
	}
}