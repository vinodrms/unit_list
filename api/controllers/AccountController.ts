import {BaseController} from './base/BaseController';
import {ThStatusCode} from '../core/utils/th-responses/ThResponse';
import {HotelSignUp} from '../core/domain-layer/hotel-account/sign-up/HotelSignUp';
import {AppContext} from '../core/utils/AppContext';
import {SessionContext, SessionManager} from '../core/utils/SessionContext';
import {ILoginService, LoginType} from '../core/services/login/ILoginService';
import {HotelDO} from '../core/data-layer/hotel/data-objects/HotelDO';
import {UserDO} from '../core/data-layer/hotel/data-objects/user/UserDO';
import {ActionTokenDO} from '../core/data-layer/hotel/data-objects/user/ActionTokenDO';
import {UserAccountActivation} from '../core/domain-layer/hotel-account/account-activation/UserAccountActivation';
import {UserAccountRequestResetPassword} from '../core/domain-layer/hotel-account/reset-password/UserAccountRequestResetPassword';
import {UserAccountResetPassword} from '../core/domain-layer/hotel-account/reset-password/UserAccountResetPassword';
import {LoginStatusCode} from '../core/utils/th-responses/LoginStatusCode';

class AccountController extends BaseController {
	public signUp(req: Express.Request, res: Express.Response) {
		var hotelSignUp = new HotelSignUp(req.appContext, req.sessionContext, req.body.accountData);
		hotelSignUp.signUp().then((result: ActionTokenDO) => {
			this.returnSuccesfulResponse(req, res, {});
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.HotelSignUpError);
		});
	}
	public activate(req: Express.Request, res: Express.Response) {
		var appContext: AppContext = req.appContext;
		var hotelActivateAccount = new UserAccountActivation(req.appContext, req.sessionContext, req.query);
		hotelActivateAccount.activate().then((result: any) => {
			res.redirect(appContext.getUnitPalConfig().getAppContextRoot() + "/?loginStatusCode=" + LoginStatusCode.AccountActivationOk);
		}).catch((err: any) => {
			res.redirect(appContext.getUnitPalConfig().getAppContextRoot() + "/?loginStatusCode=" + LoginStatusCode.AccountActivationError);
		});
	}
	public logIn(req: Express.Request, res: Express.Response) {
		var appContext: AppContext = req.appContext;
		var loginService: ILoginService = appContext.getServiceFactory().getLoginService();
		loginService.logIn(LoginType.Basic, req).then((loginData: { user: UserDO, hotel: HotelDO }) => {
			var sessionManager: SessionManager = new SessionManager(req);
			sessionManager.initializeSession(loginData).then((sessionContext: SessionContext) => {
				this.returnSuccesfulResponse(req, res, { configurationCompleted: loginData.hotel.configurationCompleted });
			}).catch((err: any) => {
				this.returnErrorResponse(req, res, err, ThStatusCode.AccControllerErrorInitializingSession);
			});
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.HotelLoginError);
		});
	}
	public logOut(req: Express.Request, res: Express.Response) {
		var sessionManager: SessionManager = new SessionManager(req);
		sessionManager.destroySession();
		this.returnSuccesfulResponse(req, res, {});
	}

	public requestResetPassword(req: Express.Request, res: Express.Response) {
		var reqPasswd = new UserAccountRequestResetPassword(req.appContext, req.sessionContext, req.body.requestData);
		reqPasswd.requestResetPassword().then((resetToken: ActionTokenDO) => {
			this.returnSuccesfulResponse(req, res, {});
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.AccControllerErrorRequestingResetPassword);
		});
	}
	public resetPassword(req: Express.Request, res: Express.Response) {
		var reqPasswd = new UserAccountResetPassword(req.appContext, req.sessionContext, req.body.requestData);
		reqPasswd.resetPassword().then((user: UserDO) => {
			this.returnSuccesfulResponse(req, res, {});
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.AccControllerErrorResettingPassword);
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