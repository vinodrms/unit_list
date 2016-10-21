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

export class KeyMetricsReportGroupGenerator implements IReportGroupGeneratorStrategy {
	constructor(protected _appContext: AppContext, protected _sessionContext: SessionContext) {
	}

	private validParameters(params: Object) {
		return true;
	}

	public generate(params: Object): Promise<ReportGroupDO> {
		return new Promise<ReportGroupDO>((resolve: { (result: ReportGroupDO): void }, reject: { (err: ThError): void }) => {
			let reportGeneratorFactory = new ReportGeneratorFactory(this._appContext, this._sessionContext);
			if (this.validParameters(params)) {
				let keyMetricsReportGenerator = reportGeneratorFactory.getGeneratorStrategy(ReportType.KeyMetricsDaily);

				let keyMetricsReport = null;

				let pMetrics = keyMetricsReportGenerator.generate({})
				.then((report: ReportDO) => {
					keyMetricsReport = report;
				})

				Promise.all([pMetrics]).then(() => {
					var rg = new ReportGroupDO();
					rg.name = "Key Metrics";
					rg.reportsList = [keyMetricsReport];
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