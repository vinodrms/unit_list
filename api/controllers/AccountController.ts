import {BaseController} from './base/BaseController';
import {ErrorCode} from '../core/utils/responses/ResponseWrapper';
import {HotelSignUpDO, HotelSignUp} from '../core/domain-layer/hotel-account/HotelSignUp';
import {AppContext} from '../core/utils/AppContext';
import {SessionDO, SessionManager} from '../core/utils/SessionContext';
import {ILoginService, LoginType} from '../core/services/login/ILoginService';
import {HotelDO} from '../core/data-layer/hotel/data-objects/HotelDO';
import {UserDO} from '../core/data-layer/hotel/data-objects/user/UserDO';
import {ActionTokenDO} from '../core/data-layer/hotel/data-objects/user/ActionTokenDO';
import {UserAccountActivation, UserAccountActivationDO} from '../core/domain-layer/hotel-account/UserAccountActivation';
import {UserAccountRequestResetPassword, UserAccountRequestResetPasswordDO} from '../core/domain-layer/hotel-account/UserAccountRequestResetPassword';
import {UserAccountResetPassword, UserAccountResetPasswordDO} from '../core/domain-layer/hotel-account/UserAccountResetPassword';

class AccountController extends BaseController {
	public signUp(req: Express.Request, res: Express.Response) {
		if (!this.precheckPOSTParameters(req, res, "accountData", HotelSignUpDO.getRequiredProperties())) {
			return;
		}
		var signUpDO: HotelSignUpDO = req.body.accountData;
		var hotelSignUp = new HotelSignUp(req.appContext, req.sessionContext, signUpDO);
		hotelSignUp.signUp().then((result: any) => {
			this.returnSuccesfulResponse(req, res, {});
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ErrorCode.HotelSignUpError);
		});
	}
	public activate(req: Express.Request, res: Express.Response) {
		if (!this.precheckGETParameters(req, res, UserAccountActivationDO.getRequiredProperties())) {
			return;
		}
		var appContext: AppContext = req.appContext;
		var accActivationDO: UserAccountActivationDO = req.query;
		var hotelActivateAccount = new UserAccountActivation(appContext, req.sessionContext, accActivationDO);
		hotelActivateAccount.activate().then((result: any) => {
			// TODO: add status code in login page to display alert with "account succesfully activated"
			res.redirect(appContext.getUnitPalConfig().getAppContextRoot());
		}).catch((err: any) => {
			//TODO: redirect to login page with error code instead of returning JSON
			this.returnErrorResponse(req, res, err, ErrorCode.HotelActivateError);
		});
	}
	public logIn(req: Express.Request, res: Express.Response) {
		var appContext: AppContext = req.appContext;
		var loginService: ILoginService = appContext.getServiceFactory().getLoginService();
		loginService.logIn(LoginType.Basic, req).then((loginData: { user: UserDO, hotel: HotelDO }) => {
			var sessionManager: SessionManager = new SessionManager(req);
			sessionManager.initializeSession(loginData).then((sessionDO: SessionDO) => {
				this.returnSuccesfulResponse(req, res, sessionDO);
			}).catch((err: any) => {

				this.returnErrorResponse(req, res, err, ErrorCode.AccControllerErrorInitializingSession);
			});
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ErrorCode.HotelLoginError);
		});
	}
	public logOut(req: Express.Request, res: Express.Response) {
		var sessionManager: SessionManager = new SessionManager(req);
		sessionManager.destroySession();
		this.returnSuccesfulResponse(req, res, {});
	}

	public requestResetPassword(req: Express.Request, res: Express.Response) {
		if (!this.precheckPOSTParameters(req, res, "requestData", UserAccountRequestResetPasswordDO.getRequiredProperties())) {
			return;
		}
		var reqPasswd = new UserAccountRequestResetPassword(req.appContext, req.sessionContext, req.body.requestData);
		reqPasswd.requestResetPassword().then((resetToken: ActionTokenDO) => {
			this.returnSuccesfulResponse(req, res, {});
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ErrorCode.AccControllerErrorRequestingResetPassword);
		});
	}
	public resetPassword(req: Express.Request, res: Express.Response) {
		if (!this.precheckPOSTParameters(req, res, "requestData", UserAccountResetPasswordDO.getRequiredProperties())) {
			return;
		}
		var reqPasswd = new UserAccountResetPassword(req.appContext, req.sessionContext, req.body.requestData);
		reqPasswd.resetPassword().then((user: UserDO) => {
			this.returnSuccesfulResponse(req, res, {});
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ErrorCode.AccControllerErrorResettingPassword);
		});
	}
}

var accountController = new AccountController();
module.exports = {
	signUp: accountController.signUp.bind(accountController),
	logIn: accountController.logIn.bind(accountController),
	activate: accountController.activate.bind(accountController),
	logOut: accountController.logOut.bind(accountController),
	requestResetPassword: accountController.requestResetPassword.bind(accountController),
	resetPassword: accountController.resetPassword.bind(accountController)
}