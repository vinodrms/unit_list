import {BaseController} from './base/BaseController';
import {AppEnvironmentType} from '../core/utils/environment/UnitPalConfig';
import {SessionManager} from '../core/utils/SessionContext';
import {LoginStatusCode} from '../core/utils/th-responses/LoginStatusCode';
import {UnitPalConfig, GoogleAnalyticsSettings} from '../core/utils/environment/UnitPalConfig';

class AppViewsController extends BaseController {
	public getExternalView(req: Express.Request, res: Express.Response) {
		var unitPalConfig: UnitPalConfig = req.appContext.getUnitPalConfig();
        res.view("external", this.getViewParameters(unitPalConfig));
	}

	public getInternalView(req: Express.Request, res: Express.Response) {
		var unitPalConfig: UnitPalConfig = req.appContext.getUnitPalConfig();
		var sessionManager = new SessionManager(req);

		if (!this.isDevelopmentEnvironment(unitPalConfig) && !sessionManager.sessionExists()) {
			return res.redirect(unitPalConfig.getAppContextRoot() + "/login/" + LoginStatusCode.SessionTimeout);
		}
        return res.view("internal", this.getViewParameters(unitPalConfig));
	}

	private getViewParameters(unitPalConfig: UnitPalConfig): Object {
		var googleAnalyticsSettings: GoogleAnalyticsSettings = unitPalConfig.getGoogleAnalyticsSettings();
		return {
			isDevelopmentEnvironment: this.isDevelopmentEnvironment(unitPalConfig),
			googleAnalyticsEnabled: googleAnalyticsSettings.enabled,
			googleAnalyticsTrackingId: googleAnalyticsSettings.trackingId
        };
	}
	private isDevelopmentEnvironment(unitPalConfig: UnitPalConfig) {
		return unitPalConfig.getAppEnvironment() == AppEnvironmentType.Development;
	}
}

var appViewsController = new AppViewsController();
module.exports = {
	getExternalView: appViewsController.getExternalView.bind(appViewsController),
	getInternalView: appViewsController.getInternalView.bind(appViewsController)
}