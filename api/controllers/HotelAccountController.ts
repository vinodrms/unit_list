import {BaseController} from './base/BaseController';
import {AppContext} from '../core/utils/AppContext';
import {SessionContext} from '../core/utils/SessionContext';
import {HotelSignUpDO} from '../core/domain-layer/signup/HotelSignUp';

class HotelAccountController extends BaseController {
	public signUp(req:Express.Request, res:Express.Response) {
		if(!this.precheckPOSTParameters(req, res, "accountData", HotelSignUpDO.getRequiredProperties())) {
			return;
		}
		var signUpDO : HotelSignUpDO = req.body.accountData;
		// TODO
		
	}
}

var hotelAccountController = new HotelAccountController();
module.exports = {
	signUp : hotelAccountController.signUp.bind(hotelAccountController)
}