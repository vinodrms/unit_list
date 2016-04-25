import {BaseController} from './base/BaseController';
import {AppEnvironmentType} from '../core/utils/environment/UnitPalConfig';
import {AppContext} from '../core/utils/AppContext';
import {SessionManager} from '../core/utils/SessionContext';
import {LoginStatusCode} from '../core/utils/th-responses/LoginStatusCode';

class AppViewsController extends BaseController {
	public getExternalView(req: Express.Request, res: Express.Response) {
		var isDevelopmentEnvironment = this.isDevelopmentEnvironment(req);
        res.view("external", {
			isDevelopmentEnvironment: isDevelopmentEnvironment
        });
	}
	public getInternalView(req: Express.Request, res: Express.Response) {
		var isDevelopmentEnvironment = this.isDevelopmentEnvironment(req);
		var sessionManager = new SessionManager(req);
		if (!isDevelopmentEnvironment && !sessionManager.sessionExists()) {
			var appContext: AppContext = req.appContext;
			return res.redirect(appContext.getUnitPalConfig().getAppContextRoot() + "/?loginStatusCode=" + LoginStatusCode.SessionTimeout);
		}
        return res.view("internal", {
			isDevelopmentEnvironment: isDevelopmentEnvironment
        });
	}
	private isDevelopmentEnvironment(req: Express.Request): boolean {
		var appContext: AppContext = req.appContext;
		if (appContext.getUnitPalConfig().getAppEnvironment() == AppEnvironmentType.Development) {
			return true;
		}
		return false;
    }
}

var appViewsController = new AppViewsController();
module.exports = {
	getExternalView: appViewsController.getExternalView.bind(appViewsController),
	getInternalView: appViewsController.getInternalView.bind(appViewsController)
}