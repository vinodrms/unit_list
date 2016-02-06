import {BaseController} from './base/BaseController';
import {ErrorCode} from '../core/utils/responses/ResponseWrapper';
import {HotelSignUpDO, HotelSignUp} from '../core/domain-layer/signup/HotelSignUp';

class HotelAccountController extends BaseController {
	public signUp(req: Express.Request, res: Express.Response) {
		if (!this.precheckPOSTParameters(req, res, "accountData", HotelSignUpDO.getRequiredProperties())) {
			return;
		}
		var signUpDO: HotelSignUpDO = req.body.accountData;
		var hotelSignUp = new HotelSignUp(req.appContext, req.sessionContext, signUpDO);
		hotelSignUp.signUp().then((result: any) => {
			this.returnSuccesfulResponse(req, res, result);
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ErrorCode.HotelSignUpError);
		});
	}
}

var hotelAccountController = new HotelAccountController();
module.exports = {
	signUp: hotelAccountController.signUp.bind(hotelAccountController)
}