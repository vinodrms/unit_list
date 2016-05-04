import {LoginStatusCode} from '../responses/LoginStatusCode';
import {OpaqueToken} from '@angular/core';

export interface IBrowserLocation {
	goToLoginPage(statusCode: LoginStatusCode);
	goToWizardPage();
	goToHomePage();
}
export const IBrowserLocation = new OpaqueToken("IBrowserLocation");