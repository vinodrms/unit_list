import {Injectable, Inject} from 'angular2/core';
import {IThCookie} from './cookies/IThCookie';
import {ThTranslation} from './localization/ThTranslation';
import {IBrowserLocation} from './browser-location/IBrowserLocation';
import {IThHttp} from './http/IThHttp';
import {ThUtils} from './ThUtils';

@Injectable()
export class AppContext {
	public thUtils: ThUtils;

	constructor(
		@Inject(IThCookie) public thCookie: IThCookie,
		@Inject(IBrowserLocation) public browserLocation: IBrowserLocation,
		public thTranslation: ThTranslation,
		@Inject(IThHttp) public thHttp: IThHttp
	) {
		this.thUtils = new ThUtils();
	}
}