import { BaseController } from './base/BaseController';
import { ThStatusCode } from '../core/utils/th-responses/ThResponse';
import { ReportDO } from '../core/data-layer/reports/data-objects/ReportDO';
import { ReportGeneratorFactory } from '../core/domain-layer/reports/ReportGeneratorFactory';
import { AppContext } from '../core/utils/AppContext';

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
		let reportType = req.body.type;
		let reportParams = req.body.params;

		let reportGeneratorFactory = new ReportGeneratorFactory(req.appContext);
		let reportGenerator = reportGeneratorFactory.getGeneratorStrategy(reportType);
		reportGenerator.generate(reportParams).then((results : ReportDO) => {
			this.returnSuccesfulResponse(req, res, {
				report : results
			});
		}).catch((err: any) =>{
			this.returnErrorResponse(req, res, err, ThStatusCode.ReportFetchError);
		})
	}
}

//TODO: Add endpoints
var reportsControllerInstance = new ReportsController();
module.exports = {
	getReportsList: reportsControllerInstance.getReportsList.bind(reportsControllerInstance),
	getReport: reportsControllerInstance.getReport.bind(reportsControllerInstance),
}