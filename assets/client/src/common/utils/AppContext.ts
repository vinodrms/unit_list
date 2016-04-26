import {Injectable, Inject} from 'angular2/core';
import {IThCookie} from './cookies/IThCookie';
import {ThTranslation} from './localization/ThTranslation';
import {IBrowserLocation} from './browser-location/IBrowserLocation';
import {IThHttp} from './http/IThHttp';
import {ThUtils} from './ThUtils';
import {IRouterNavigator} from './navigator/IRouterNavigator';
import {RouterNavigator} from './navigator/RouterNavigator';
import {IToaster} from './toaster/IToaster';
import {IModalService} from './modals/IModalService';
import {ThServerApi} from './http/ThServerApi';
export {ThServerApi} from './http/ThServerApi';
import {ThError} from './responses/ThError';
export {ThError} from './responses/ThError';
import {CountryCodeVatConvertor} from './convertors/CountryCodeVatConvertor';
import {LoginStatusCode} from './responses/LoginStatusCode';

@Injectable()
export class AppContext {
	public thUtils: ThUtils;
	public countryCodeVatConvertor: CountryCodeVatConvertor;

	constructor(
		@Inject(IThCookie) public thCookie: IThCookie,
		@Inject(IBrowserLocation) public browserLocation: IBrowserLocation,
		@Inject(IRouterNavigator) public routerNavigator: IRouterNavigator,
		public thTranslation: ThTranslation,
		@Inject(IThHttp) public thHttp: IThHttp,
		@Inject(IToaster) public toaster: IToaster,
		@Inject(IModalService) public modalService: IModalService
	) {
		this.thUtils = new ThUtils();
		this.countryCodeVatConvertor = new CountryCodeVatConvertor();
	}

	public logOut() {
		this.thHttp.post(ThServerApi.AccountLogOut, {}).subscribe((result: any) => {
			this.goToMainPage();
		}, (error: ThError) => {
			this.goToMainPage();
		});
	}
	private goToMainPage() {
		this.browserLocation.goToLoginPage(LoginStatusCode.Ok);
	}
}