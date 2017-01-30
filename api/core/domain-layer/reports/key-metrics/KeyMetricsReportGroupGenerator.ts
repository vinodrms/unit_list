import { AppContext } from '../../../utils/AppContext';
import { SessionContext } from '../../../utils/SessionContext';
import { ThError } from '../../../utils/th-responses/ThError';
import { AReportGeneratorStrategy } from '../common/report-generator/AReportGeneratorStrategy';
import { IReportItemGenerator } from '../common/report-item-generator/IReportItemGenerator';
import { IValidationStructure } from '../../../utils/th-validation/structure/core/IValidationStructure';
import { ObjectValidationStructure } from '../../../utils/th-validation/structure/ObjectValidationStructure';
import { BookingValidationStructures } from '../../bookings/validators/BookingValidationStructures';
import { ThDateDO } from '../../../utils/th-dates/data-objects/ThDateDO';
import { ThDateIntervalDO } from '../../../utils/th-dates/data-objects/ThDateIntervalDO';
import { ReportGroupMeta } from '../common/result/ReportGroup';
import { DailyKeyMetricsReportItemGenerator } from './strategies/DailyKeyMetricsReportItemGenerator';

export class KeyMetricsReportGroupGenerator extends AReportGeneratorStrategy {
	private _dateInterval: ThDateIntervalDO;

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
			}
		]);
	}

	protected loadParameters(params: any) {
		var startDate = new ThDateDO();
		startDate.buildFromObject(params.startDate);
		var endDate = new ThDateDO();
		endDate.buildFromObject(params.endDate);
		this._dateInterval = ThDateIntervalDO.buildThDateIntervalDO(startDate, endDate);
	}

	protected getMeta(): ReportGroupMeta {
		return {
			name: "Key Metrics"
		}
	}
	protected getGenerators(): IReportItemGenerator[] {
		return [
			new DailyKeyMetricsReportItemGenerator(this._appContext, this._sessionContext, this._dateInterval)
		];
	}
}