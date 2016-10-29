import { BaseController } from './base/BaseController';
import { ThStatusCode } from '../core/utils/th-responses/ThResponse';
import { ReportDO } from '../core/data-layer/reports/data-objects/ReportDO';
import { ReportGroupDO } from '../core/domain-layer/reports/ReportGroupDO';
import { ReportGroupGeneratorFactory, ReportGroupType } from '../core/domain-layer/reports/ReportGroupGeneratorFactory';
import { AppContext } from '../core/utils/AppContext';

import { ThError } from '../core/utils/th-responses/ThError';
import { ThLogger, ThLogLevel } from '../core/utils/logging/ThLogger';
import { ServiceFactory } from '../core/services/ServiceFactory';

import { ThDateDO } from '../core/utils/th-dates/data-objects/ThDateDO';
import { ThHourDO } from '../core/utils/th-dates/data-objects/ThHourDO';
import { ThTimestampDO } from '../core/utils/th-dates/data-objects/ThTimestampDO';
import { ThDateIntervalDO } from '../core/utils/th-dates/data-objects/ThDateIntervalDO';


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
        var params = JSON.parse(req.query.params);

		let rgType = params.reportType;
		let startDate = new ThDateDO();
		startDate.buildFromObject(params.properties.startDate);
		let endDate = new ThDateDO();
		endDate.buildFromObject(params.properties.endDate);
		let startHour = new ThHourDO();
		startHour.buildFromObject(params.properties.startDateTime)
		let endHour = new ThHourDO();
		endHour.buildFromObject(params.properties.endDateTime)
		let startTimestamp = ThTimestampDO.buildThTimestampDO(startDate, startHour);
		let endTimestamp = ThTimestampDO.buildThTimestampDO(endDate, endHour);

		let rgParams = {
			dateInterval: ThDateIntervalDO.buildThDateIntervalDO(startDate, endDate),
			startTime: startTimestamp,
			endTime: endTimestamp
		};

		let rgGeneratorFactory = new ReportGroupGeneratorFactory(req.appContext, req.sessionContext);
		let rgGenerator = rgGeneratorFactory.getGeneratorStrategy(rgType);
		rgGenerator.generate(rgParams).then((results: ReportGroupDO) => {
			let csvString = results.buildCSVString();
			let fileService = (<AppContext>req.appContext).getServiceFactory().getFileService();
			fileService.createFile(process.cwd() + '\\temp', null, 'csv', csvString).then((fullFilePath: string) => {
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