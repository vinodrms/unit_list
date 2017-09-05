import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppContext, ThServerApi } from '../../../../common/utils/AppContext';
import { ARequestService } from '../common/ARequestService';
import { HotelPaymentMethodsDO } from './data-objects/HotelPaymentMethodsDO';

@Injectable()
export class HotelPaymentMethodsService extends ARequestService<HotelPaymentMethodsDO> {
	constructor(private _appContext: AppContext) {
		super();
	}
	protected sendRequest(): Observable<Object> {
		return this._appContext.thHttp.get({
			serverApi: ThServerApi.SettingsPaymentMethods
		});
	}
	protected parseResult(result: Object): HotelPaymentMethodsDO {
		var paymentMethodsDO: HotelPaymentMethodsDO = new HotelPaymentMethodsDO();
		paymentMethodsDO.buildFromObject(result);
		return paymentMethodsDO;
	}
	public getPaymentMethodsDO(): Observable<HotelPaymentMethodsDO> {
		return this.getServiceObservable();
	}
}