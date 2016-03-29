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
export {ThServerApi} from './http/ThServerApi';
export {ThError} from './responses/ThError';
import {CountryCodeVatConvertor} from './convertors/CountryCodeVatConvertor';

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
}