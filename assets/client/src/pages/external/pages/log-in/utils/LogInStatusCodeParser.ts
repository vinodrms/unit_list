import {LoginStatusCode} from '../../../../../common/utils/responses/LoginStatusCode';

export interface LoginStatusResponse {
	action: LoginStatusAction;
	message?: string;
}

export enum LoginStatusAction {
	NoAction,
	SuccessAlert,
	ErrorAlert
}

var LoginStatusResponsesWrapper: { [index: number]: LoginStatusResponse; } = {};
LoginStatusResponsesWrapper[LoginStatusCode.Ok] = { action: LoginStatusAction.NoAction };
LoginStatusResponsesWrapper[LoginStatusCode.SessionTimeout] = { action: LoginStatusAction.ErrorAlert, message: "Your session expired. Please log in again." };
LoginStatusResponsesWrapper[LoginStatusCode.AccountActivationOk] = { action: LoginStatusAction.SuccessAlert, message: "Account succesfully activated" };
LoginStatusResponsesWrapper[LoginStatusCode.AccountActivationError] = { action: LoginStatusAction.ErrorAlert, message: "Problem activating account. The link may have expired." };
LoginStatusResponsesWrapper[LoginStatusCode.RequestResetPasswordOk] = { action: LoginStatusAction.SuccessAlert, message: "Am email has been sent. Please check your inbox." };
LoginStatusResponsesWrapper[LoginStatusCode.UpdatePasswordOk] = { action: LoginStatusAction.SuccessAlert, message: "Your password was reset. Please log in using the new credentials." };

export class LogInStatusCodeParser {
	private _statusCode: LoginStatusCode;

	constructor() {
		this._statusCode = LoginStatusCode.Ok;
	}

	public updateStatusCode(possibleStatusCode: string) {
		if (_.isUndefined(possibleStatusCode)) {
			return;
		}
		var parsedStatusCode: number = parseInt(possibleStatusCode);
		if (isNaN(parsedStatusCode)) {
			return;
		}
		for (var loginStatusCode in LoginStatusCode) {
			var actualStatusCode = parseInt(loginStatusCode);
			if (actualStatusCode === parsedStatusCode) {
				this._statusCode = actualStatusCode;
				return;
			}
		}
	}

	public getLoginStatusResponse(): LoginStatusResponse {
		return LoginStatusResponsesWrapper[this._statusCode];
	}
}