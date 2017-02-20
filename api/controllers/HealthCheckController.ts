import {BaseController} from './base/BaseController';
import {ThStatusCode} from '../core/utils/th-responses/ThResponse';

class HealthCheckController extends BaseController {
	
    public getHealth(req: Express.Request, res: Express.Response) {
		sails.models.hotelsentity.count().exec((error, found) => {
			if(error) {
				this.returnErrorResponse(req, res, error, ThStatusCode.InternalServerError);
			}
			this.returnSuccesfulResponse(req, res, { result: found });
		});
	}
}

var healthCheckController = new HealthCheckController();
module.exports = {
	getHealth: healthCheckController.getHealth.bind(healthCheckController),

}
