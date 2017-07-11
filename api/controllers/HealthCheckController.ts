import {BaseController} from './base/BaseController';
import {ThStatusCode} from '../core/utils/th-responses/ThResponse';

declare var sails: any;

class HealthCheckController extends BaseController {
	
    public getHealth(req, res) {
		sails.models.hotelsentity.count().exec((error, found) => {
			if(error) {
				res.serverError();
			}
			this.returnSuccesfulResponse(req, res, { result: found });
		});
	}
}

var healthCheckController = new HealthCheckController();
module.exports = {
	getHealth: healthCheckController.getHealth.bind(healthCheckController),

}
