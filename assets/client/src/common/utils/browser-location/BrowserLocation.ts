import { Injectable } from '@angular/core';
import { IBrowserLocation } from './IBrowserLocation';
import { LoginStatusCode } from '../responses/LoginStatusCode';

@Injectable()
export class BrowserLocation implements IBrowserLocation {

	constructor() {
	}

	public goToLoginPage(statusCode: LoginStatusCode) {
		if (location.pathname === '') return;
		if (location.pathname === '/') return;
		if (location.pathname.startsWith('/login')) return;

		location.href = '/login/' + statusCode;
	}
	public goToWizardPage() {
		location.href = '/home/wizard';
	}
	public goToHomePage() {
		location.href = '/home/operations/';
	}
}