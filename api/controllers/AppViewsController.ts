import BaseControllerImport = require('./base/BaseController');
import BaseController = BaseControllerImport.BaseController;

class AppViewsController extends BaseController {
	protected _exportedMethods: any = [
    	'getExternalView',
		'getInternalView'
    ];

	public getExternalView(req:Express.Request, res:Express.Response) {
        res.view("external", {
        });
	}
	public getInternalView(req:Express.Request, res:Express.Response) {
        res.view("internal", {
        });
	}
}

var controller = new AppViewsController();
module.exports = controller.exports();