import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ARequestService } from '../../../../../../../../../../services/common/ARequestService';
import { AppContext, ThServerApi } from '../../../../../../../../../../../../common/utils/AppContext';
import { BookingDotComConfigurationDO } from './utils/BookingDotComConfigurationDO';

@Injectable()
export class GetBookingDotComConfigurationService extends ARequestService<BookingDotComConfigurationDO> {
	constructor(private appContext: AppContext) {
		super();
	}
	protected sendRequest(): Observable<Object> {
		return this.appContext.thHttp.get({
			serverApi: ThServerApi.BookingDotComGetConfiguration
		});
	}
	protected parseResult(result: Object): BookingDotComConfigurationDO {
		var configuration: BookingDotComConfigurationDO = new BookingDotComConfigurationDO();
		configuration.buildFromObject(result);
		return configuration;
	}
	public getConfiguration(): Observable<BookingDotComConfigurationDO> {
		return this.getServiceObservable();
	}
}