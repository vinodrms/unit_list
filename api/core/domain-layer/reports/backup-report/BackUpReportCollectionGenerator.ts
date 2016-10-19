import { AppContext } from '../../../utils/AppContext';
import { SessionContext } from '../../../utils/SessionContext';
import { ReportDO } from '../../../data-layer/reports/data-objects/ReportDO';
import { ReportGroupDO } from '../ReportGroupDO';
import { ReportMetadataDO } from '../../../data-layer/reports/data-objects/ReportMetadataDO';
import { ReportType } from '../../../data-layer/reports/data-objects/ReportMetadataDO';
import { IReportGeneratorStrategy, IReportGroupGeneratorStrategy } from './../CommonInterfaces';
import { ThError } from '../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../utils/th-responses/ThResponse';
import { ThLogger, ThLogLevel } from '../../../utils/logging/ThLogger';
import { ThUtils } from '../../../utils/ThUtils';
import { ReportArrivalsReader } from '../backup-report/arrivals/ReportArrivalsReader';
import { ReportArrivalItemInfo } from '../backup-report/arrivals/utils/ReportArrivalsInfo'
import { ReportGeneratorFactory } from '../ReportGeneratorFactory';

export class BackUpReportCollectionGenerator implements IReportGroupGeneratorStrategy {
	constructor(protected _appContext: AppContext, protected _sessionContext: SessionContext) {
	}

	private validParameters(params: Object) {
		return true;
	}

	public generate(params: Object): Promise<ReportGroupDO> {
		return new Promise<ReportGroupDO>((resolve: { (result: ReportGroupDO): void }, reject: { (err: ThError): void }) => {
			let reportGeneratorFactory = new ReportGeneratorFactory(this._appContext, this._sessionContext);
			if (this.validParameters(params)) {
				let arrivalsReportGenerator = reportGeneratorFactory.getGeneratorStrategy(ReportType.GuestsArriving);
				let inHouseReportGenerator = reportGeneratorFactory.getGeneratorStrategy(ReportType.GuestsInHouse);

				let arrivalsReport = null;
				let inHouseReport = null;
				let depatureReport = null;

				let p1 = arrivalsReportGenerator.generate({})
				.then((report: ReportDO) => {
					arrivalsReport = report;
				})
				let p2 = inHouseReportGenerator.generate({})
				.then((report: ReportDO) => {
					inHouseReport = report;
				})

				Promise.all([p1, p2]).then(() => {
					var rg = new ReportGroupDO();
					rg.name = "Backup";
					rg.reportsList = [arrivalsReport, inHouseReport, arrivalsReport];
					resolve(rg);
				})
			}
			else {
				let thError = new ThError(ThStatusCode.PriceProductValidatorEmptyRoomCategoryList, null);
				ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Invalid Report Parameters: ", JSON.stringify(params), thError);
				reject(thError);
			}
		});
	}
}