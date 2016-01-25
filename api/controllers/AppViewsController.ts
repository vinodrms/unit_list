import BaseControllerImport = require('./base/BaseController');
import BaseController = BaseControllerImport.BaseController;

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
        if(sails.config.environment == 'development')
            return true;
        return false;
    }
}

var controller = new AppViewsController();
module.exports = controller.exports();