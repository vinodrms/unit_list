import { AppContext } from '../../../utils/AppContext';
import { SessionContext } from '../../../utils/SessionContext';
import { AReportGeneratorStrategy } from '../common/report-generator/AReportGeneratorStrategy';
import { IReportItemGenerator } from '../common/report-item-generator/IReportItemGenerator';
import { IValidationStructure } from '../../../utils/th-validation/structure/core/IValidationStructure';
import { ObjectValidationStructure } from '../../../utils/th-validation/structure/ObjectValidationStructure';
import { ReportGroupMeta } from '../common/result/ReportGroup';
import { GuestsArrivingReportItemGeneratorStrategy } from './strategies/GuestsArrivingReportItemGeneratorStrategy';
import { GuestsInHouseReportItemGeneratorStrategy } from './strategies/GuestsInHouseReportItemGeneratorStrategy';
import { GuestsDepartingReportItemGeneratorStrategy } from './strategies/GuestsDepartingReportItemGeneratorStrategy';

export class BackUpReportGroupGenerator extends AReportGeneratorStrategy {

	constructor(appContext: AppContext, private _sessionContext: SessionContext) {
		super(appContext);
	}

	protected getParamsValidationStructure(): IValidationStructure {
		return new ObjectValidationStructure([]);
	}
	protected loadParameters(params: any) { }

	protected getMeta(): ReportGroupMeta {
		return {
			name: "BackUp Report"
		}
	}
	protected getGenerators(): IReportItemGenerator[] {
		return [
			new GuestsArrivingReportItemGeneratorStrategy(this._appContext, this._sessionContext),
			new GuestsInHouseReportItemGeneratorStrategy(this._appContext, this._sessionContext),
			new GuestsDepartingReportItemGeneratorStrategy(this._appContext, this._sessionContext),
		];
	}
}