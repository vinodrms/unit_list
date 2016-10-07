import { BaseController } from './base/BaseController';
import { ThStatusCode } from '../core/utils/th-responses/ThResponse';
import { PriceProductYielding } from '../core/domain-layer/yield-manager/price-product-yielding/PriceProductYielding';
import { PriceProductDO } from '../core/data-layer/price-products/data-objects/PriceProductDO';
import { PriceProductReader } from '../core/domain-layer/yield-manager/price-product-reader/PriceProductReader';
import { PriceProductYieldResult } from '../core/domain-layer/yield-manager/price-product-reader/utils/PriceProductYieldItem';
import { KeyMetricReader } from '../core/domain-layer/yield-manager/key-metrics/KeyMetricReader';
import { KeyMetricsResult } from '../core/domain-layer/yield-manager/key-metrics/utils/KeyMetricsResult';
import { ReportMetadataDO, ReportType, FieldType } from '../core/data-layer/reports/data-objects/ReportMetadataDO';
import { AppContext } from '../core/utils/AppContext';


//TODO: use THtranslate
export class ReportsController extends BaseController {
	public getReportsList(req: Express.Request, res: Express.Response) {
		let appContext: AppContext = req.appContext;

		let reportsRepository = appContext.getRepositoryFactory().getReportsMetadataRepository();
		reportsRepository.getAllReportMetadata().then(results => {
			this.returnSuccesfulResponse(req, res, {
				reportsListResult: results
			});
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.ReportsMetadataListFetchError);
		});
	}

	public getReport(req: Express.Request, res: Express.Response) {
	}
}

//TODO: Add endpoints
var reportsControllerInstance = new ReportsController();
module.exports = {
	getReportsList: reportsControllerInstance.getReportsList.bind(reportsControllerInstance),
	getReport: reportsControllerInstance.getReport.bind(reportsControllerInstance),
}