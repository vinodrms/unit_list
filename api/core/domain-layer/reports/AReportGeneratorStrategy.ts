import { AppContext } from '../../utils/AppContext';
import { SessionContext } from '../../utils/SessionContext';
import { ReportDO } from '../../data-layer/reports/data-objects/ReportDO';
import { ReportType } from '../../data-layer/reports/data-objects/ReportMetadataDO';
import { IReportGeneratorStrategy } from './CommonInterfaces';
import { ThError } from '../../utils/th-responses/ThError';
import { ThStatusCode } from '../../utils/th-responses/ThResponse';
import { ThLogger, ThLogLevel } from '../../utils/logging/ThLogger';
import { ThUtils } from '../../utils/ThUtils';

export class AReportGeneratorStrategy implements IReportGeneratorStrategy {
	protected _reportType: ReportType;
	protected _thUtils: ThUtils;

	constructor(protected _appContext: AppContext, protected _sessionContext: SessionContext) {
		this._thUtils = new ThUtils();
	}

	public generate(params: Object): Promise<ReportDO> {
		return new Promise<ReportDO>((resolve: { (result: ReportDO): void }, reject: { (err: ThError): void }) => {
			if (this.validParameters(params)) {
				let reportsRepository = this._appContext.getRepositoryFactory().getReportsMetadataRepository();
				reportsRepository.getReportMetadata(this._reportType).then(reportMetadata => {
					this.buildReportData(reportMetadata).then(resolve, reject);
				})
			}
			else {
				var thError = new ThError(ThStatusCode.PriceProductValidatorEmptyRoomCategoryList, null);
				ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Invalid Report Parameters: ", JSON.stringify(params), thError);
				reject(thError);
			}
		});
	}

	protected validParameters(params: Object): boolean {
		throw Error("Method not implemented");
	}

	protected buildReportData(reportMetadata): Promise<ReportDO> {
		throw Error("Method not implemented");
	}
}

