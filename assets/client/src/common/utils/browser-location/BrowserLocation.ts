import {Injectable} from 'angular2/core';
import {IBrowserLocation} from './IBrowserLocation';
import {LoginStatusCode} from '../responses/LoginStatusCode';

@Injectable()
export class BrowserLocation implements IBrowserLocation {

	constructor() {
	}

	public goToLoginPage(statusCode: LoginStatusCode) {
		location.href = '/?loginStatusCode=' + statusCode;
	}
	public goToWizardPage() {
		location.href = '/home/wizard';
	}
	public goToHomePage() {
		location.href = '/home';
	}
}