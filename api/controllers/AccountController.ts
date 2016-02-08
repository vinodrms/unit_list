import {BaseController} from './base/BaseController';
import {ErrorCode} from '../core/utils/responses/ResponseWrapper';
import {HotelSignUpDO, HotelSignUp} from '../core/domain-layer/hotel-account/HotelSignUp';
import {AppContext} from '../core/utils/AppContext';
import {ILoginService, LoginType} from '../core/services/login/ILoginService';
import {HotelDO} from '../core/data-layer/hotel/data-objects/HotelDO';
import {UserDO} from '../core/data-layer/hotel/data-objects/user/UserDO';

class AccountController extends BaseController {
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
	public logIn(req: Express.Request, res: Express.Response) {
		var appContext: AppContext = req.appContext;
		var loginService: ILoginService = appContext.getServiceFactory().getLoginService();
		loginService.logIn(LoginType.Basic, req).then((loginData: { user: UserDO, hotel: HotelDO }) => {
			// TODO: create session
			this.returnSuccesfulResponse(req, res, loginData);
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ErrorCode.HotelLoginError);
		});
	}
}

var accountController = new AccountController();
module.exports = {
	signUp: accountController.signUp.bind(accountController),
	logIn: accountController.logIn.bind(accountController)
}