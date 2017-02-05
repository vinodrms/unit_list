import { AppContext } from '../../../utils/AppContext';
import { SessionContext } from '../../../utils/SessionContext';
import { AReportGeneratorStrategy } from '../common/report-generator/AReportGeneratorStrategy';
import { IValidationStructure } from '../../../utils/th-validation/structure/core/IValidationStructure';
import { ObjectValidationStructure } from '../../../utils/th-validation/structure/ObjectValidationStructure';
import { IReportSectionGeneratorStrategy } from '../common/report-section-generator/IReportSectionGeneratorStrategy';
import { ReportGroupMeta } from '../common/result/ReportGroup';
import { GuestsArrivingReportSectionGeneratorStrategy } from './strategies/GuestsArrivingReportSectionGeneratorStrategy';
import { GuestsInHouseReportSectionGeneratorStrategy } from './strategies/GuestsInHouseReportSectionGeneratorStrategy';
import { GuestsDepartingReportSectionGeneratorStrategy } from './strategies/GuestsDepartingReportSectionGeneratorStrategy';

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
	protected getSectionGenerators(): IReportSectionGeneratorStrategy[] {
		return [
			new GuestsArrivingReportSectionGeneratorStrategy(this._appContext, this._sessionContext),
			new GuestsInHouseReportSectionGeneratorStrategy(this._appContext, this._sessionContext),
			new GuestsDepartingReportSectionGeneratorStrategy(this._appContext, this._sessionContext),
		];
	}
}