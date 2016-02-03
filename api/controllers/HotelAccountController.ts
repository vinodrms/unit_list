import {BaseController} from './base/BaseController';
import {AppContext} from '../core/utils/AppContext';
import {SessionContext} from '../core/utils/SessionContext';
import {HotelSignUpDO} from '../core/domain-layer/signup/HotelSignUp';

class HotelAccountController extends BaseController {
	protected _exportedMethods: any = [
    	'signUp'
    ];

	public signUp(req:Express.Request, res:Express.Response) {
		if(!this._inputPOSTParametersExist(req, res, "accountData", HotelSignUpDO.getRequiredProperties())) {
			return;
		}
		var signUpDO : HotelSignUpDO = req.body.accountData;
		// TODO
		
	}
}

var controller = new HotelAccountController();
module.exports = controller.exports();