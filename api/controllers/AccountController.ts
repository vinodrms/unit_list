import { BaseController } from './base/BaseController';
import { ThStatusCode } from '../core/utils/th-responses/ThResponse';
import { HotelSignUp } from '../core/domain-layer/hotel-account/sign-up/HotelSignUp';
import { AppContext } from '../core/utils/AppContext';
import { SessionContext } from '../core/utils/SessionContext';
import { ILoginService, LoginType } from '../core/services/login/ILoginService';
import { HotelDO } from '../core/data-layer/hotel/data-objects/HotelDO';
import { UserDO } from '../core/data-layer/hotel/data-objects/user/UserDO';
import { ActionTokenDO } from '../core/data-layer/hotel/data-objects/user/ActionTokenDO';
import { UserAccountActivation } from '../core/domain-layer/hotel-account/account-activation/UserAccountActivation';
import { UserAccountRequestResetPassword } from '../core/domain-layer/hotel-account/reset-password/UserAccountRequestResetPassword';
import { UserAccountResetPassword } from '../core/domain-layer/hotel-account/reset-password/UserAccountResetPassword';
import { LoginStatusCode } from '../core/utils/th-responses/LoginStatusCode';

class AccountController extends BaseController {
    public isAuthenticated(req: any, res: any) {
        this.returnSuccesfulResponse(req, res, {});
    }
    public signUp(req: any, res: any) {
        var hotelSignUp = new HotelSignUp(req.appContext, req.sessionContext, req.body.accountData);
        hotelSignUp.signUp().then((result: ActionTokenDO) => {
            this.returnSuccesfulResponse(req, res, {});
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, ThStatusCode.HotelSignUpError);
        });
    }
    public activate(req: any, res: any) {
        var appContext: AppContext = req.appContext;
        var hotelActivateAccount = new UserAccountActivation(req.appContext, req.sessionContext, req.query);
        hotelActivateAccount.activate().then((result: any) => {
            res.redirect(appContext.getUnitPalConfig().getAppContextRoot() + "/login/" + LoginStatusCode.AccountActivationOk);
        }).catch((err: any) => {
            res.redirect(appContext.getUnitPalConfig().getAppContextRoot() + "/login/" + LoginStatusCode.AccountActivationError);
        });
    }
    public logOut(req: any, res: any) {
        let appContext: AppContext = req.appContext;
        let sessionContext: SessionContext = req.sessionContext;

        let tokenService = appContext.getServiceFactory().getTokenService();
        tokenService.invalidateToken({
            accessToken: sessionContext.token.accessToken
        }).then((deletedCount: number) => {
            this.returnSuccesfulResponse(req, res, {});
        }).catch((error: any) => {
            this.returnErrorResponse(req, res, error, ThStatusCode.UserLogoutError);
        });
    }
    public requestResetPassword(req: any, res: any) {
        var reqPasswd = new UserAccountRequestResetPassword(req.appContext, req.sessionContext, req.body.requestData);
        reqPasswd.requestResetPassword().then((resetToken: ActionTokenDO) => {
            this.returnSuccesfulResponse(req, res, {});
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, ThStatusCode.AccControllerErrorRequestingResetPassword);
        });
    }
    public resetPassword(req: any, res: any) {
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
    isAuthenticated: accountController.isAuthenticated.bind(accountController),
    signUp: accountController.signUp.bind(accountController),
    activate: accountController.activate.bind(accountController),
    logOut: accountController.logOut.bind(accountController),
    requestResetPassword: accountController.requestResetPassword.bind(accountController),
    resetPassword: accountController.resetPassword.bind(accountController)
}
