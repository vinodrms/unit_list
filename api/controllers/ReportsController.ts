import { BaseController } from './base/BaseController';
import { ThStatusCode } from '../core/utils/th-responses/ThResponse';
import { ReportDO } from '../core/data-layer/reports/data-objects/ReportDO';
import { ReportGroupDO } from '../core/domain-layer/reports/ReportGroupDO';
import { ReportGroupGeneratorFactory, ReportGroupType } from '../core/domain-layer/reports/ReportGroupGeneratorFactory';
import { AppContext } from '../core/utils/AppContext';

import { ThError } from '../core/utils/th-responses/ThError';
import { ThLogger, ThLogLevel } from '../core/utils/logging/ThLogger';
import { ServiceFactory } from '../core/services/ServiceFactory';

import path = require("path");
import fs = require("fs");

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
		// let rgType = req.body.type;
		// let rgParams = req.body.params;
		let rgType = ReportGroupType.KeyMetrics;
		let rgParams = {};

		let rgGeneratorFactory = new ReportGroupGeneratorFactory(req.appContext, req.sessionContext);
		let rgGenerator = rgGeneratorFactory.getGeneratorStrategy(rgType);
		rgGenerator.generate(rgParams).then((results: ReportGroupDO) => {
			let csvString = results.buildCSVString();
			let fileService = (<AppContext>req.appContext).getServiceFactory().getFileService();
			fileService.createFile(process.cwd() + '\\temp', null, 'csv', csvString).then((fullFilePath:string) => {
				(<any>res).download(fullFilePath, (err) => {
					if (err) {
					} else {
						fileService.deleteFile(fullFilePath);
					}
				});
			})
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.ReportFetchError);
		})
	}
}

//TODO: Add endpoints
let reportsControllerInstance = new ReportsController();
module.exports = {
	getReportsList: reportsControllerInstance.getReportsList.bind(reportsControllerInstance),
	getReport: reportsControllerInstance.getReport.bind(reportsControllerInstance),
}