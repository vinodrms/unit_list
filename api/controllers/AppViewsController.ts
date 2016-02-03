import {BaseController} from './base/BaseController';
import {AppEnvironment, AppEnvironmentType} from '../core/utils/environment/AppEnvironment';

class AppViewsController extends BaseController {
	protected _exportedMethods: any = [
    	'getExternalView',
		'getInternalView'
    ];

	public getExternalView(req:Express.Request, res:Express.Response) {
		var isDevelopmentEnvironment = this.isDevelopmentEnvironment();
        res.view("external", {
			isDevelopmentEnvironment : isDevelopmentEnvironment
        });
	}
	public getInternalView(req:Express.Request, res:Express.Response) {
		var isDevelopmentEnvironment = this.isDevelopmentEnvironment();
        res.view("internal", {
			isDevelopmentEnvironment : isDevelopmentEnvironment
        });
	}
	private isDevelopmentEnvironment() : boolean {
        if(AppEnvironment.getAppEnvironment() == AppEnvironmentType.Development)
            return true;
        return false;
    }
}

var controller = new AppViewsController();
module.exports = controller.exports();