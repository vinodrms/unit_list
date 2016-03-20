import {LoginStatusCode} from '../../../../../common/utils/responses/LoginStatusCode';

export interface LoginStatusResponse {
	displayError: boolean;
	displaySuccess: boolean;
	message?: string;
}

var LoginStatusResponsesWrapper: { [index: number]: LoginStatusResponse; } = {};
LoginStatusResponsesWrapper[LoginStatusCode.Ok] = { displayError: false, displaySuccess: false };
LoginStatusResponsesWrapper[LoginStatusCode.SessionTimeout] = { displayError: true, displaySuccess: false, message: "Your session expired. Please log in again." };
LoginStatusResponsesWrapper[LoginStatusCode.AccountActivationOk] = { displayError: false, displaySuccess: true, message: "Account succesfully activated" };
LoginStatusResponsesWrapper[LoginStatusCode.AccountActivationError] = { displayError: true, displaySuccess: false, message: "Problem activating account. The link may have expired." };

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