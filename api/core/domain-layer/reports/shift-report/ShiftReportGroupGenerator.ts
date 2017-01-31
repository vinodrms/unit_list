import { AppContext } from '../../../utils/AppContext';
import { SessionContext } from '../../../utils/SessionContext';
import { IValidationStructure } from '../../../utils/th-validation/structure/core/IValidationStructure';
import { ObjectValidationStructure } from '../../../utils/th-validation/structure/ObjectValidationStructure';
import { BookingValidationStructures } from '../../bookings/validators/BookingValidationStructures';
import { AReportGeneratorStrategy } from '../common/report-generator/AReportGeneratorStrategy';
import { IReportSectionGeneratorStrategy } from '../common/report-section-generator/IReportSectionGeneratorStrategy';
import { ShiftReportParams } from './strategies/ShiftReportParams';
import { ThDateDO } from '../../../utils/th-dates/data-objects/ThDateDO';
import { ThHourDO } from '../../../utils/th-dates/data-objects/ThHourDO';
import { ThDateIntervalDO } from '../../../utils/th-dates/data-objects/ThDateIntervalDO';
import { ThTimestampDO } from '../../../utils/th-dates/data-objects/ThTimestampDO';
import { ReportGroupMeta } from '../common/result/ReportGroup';
import { ShiftReportPaymentMethodStrategy } from './strategies/ShiftReportPaymentMethodStrategy';
import { ShiftReportProductStrategy } from './strategies/ShiftReportProductStrategy';

export class ShiftReportGroupGenerator extends AReportGeneratorStrategy {
	private _params: ShiftReportParams;

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

	protected getMeta(): ReportGroupMeta {
		return {
			name: "Shift Report"
		}
	}
	protected getSectionGenerators(): IReportSectionGeneratorStrategy[] {
		return [
			new ShiftReportPaymentMethodStrategy(this._appContext, this._sessionContext, this._params),
			new ShiftReportProductStrategy(this._appContext, this._sessionContext, this._params)
		];
	}
}