import { BaseController } from './base/BaseController';
import { ThStatusCode } from '../core/utils/th-responses/ThResponse';
import { AppContext } from '../core/utils/AppContext';
import { ReportGenerator } from '../core/domain-layer/reports/ReportGenerator';
import { ReportFileResult } from '../core/domain-layer/reports/common/result/ReportFileResult';
import { ITokenService } from "../core/domain-layer/token/ITokenService";
import { SessionDO } from "../core/utils/SessionContext";
import { IUser } from "../core/bootstrap/oauth/OAuthServerInitializer";

export class ReportsController extends BaseController {
	public getReport(req: any, res: any) {
		let tokenService: ITokenService = req.appContext.getServiceFactory().getTokenService();
		let params: any;
		
		tokenService.getUserInfoByAccessToken(req.query['token']).then((userInfo: IUser) => {
            let sessionDO: SessionDO = new SessionDO();
            sessionDO.buildFromUserInfo(userInfo);
			req.sessionContext.sessionDO = sessionDO;
			
			try {
				params = JSON.parse(req.query.params);
			} catch (e) {
				this.returnErrorResponse(req, res, e, ThStatusCode.ReportsControllerErrorParsingJson);
				return;
			}
			let generator = new ReportGenerator(req.appContext, req.sessionContext);
			return generator.getReport(params);
		}).then((result: ReportFileResult) => {
			let reportPath = result.reportPath;
			res.download(reportPath, (err) => {
				if (!err) {
					let fileService = (<AppContext>req.appContext).getServiceFactory().getFileService();
					fileService.deleteFile(reportPath);
				}
			});
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.ReportFetchError);
		});
	}
}

let reportsControllerInstance = new ReportsController();
module.exports = {
	getReport: reportsControllerInstance.getReport.bind(reportsControllerInstance),
}