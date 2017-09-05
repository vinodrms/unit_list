import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppContext, ThServerApi } from '../../../../common/utils/AppContext';
import { ARequestService } from '../common/ARequestService';
import { HotelAmenitiesDO } from './data-objects/HotelAmenitiesDO';

@Injectable()
export class HotelAmenitiesService extends ARequestService<HotelAmenitiesDO> {
	constructor(private _appContext: AppContext) {
		super();
	}
	protected sendRequest(): Observable<Object> {
		return this._appContext.thHttp.get({
			serverApi: ThServerApi.SettingsHotelAmenities
		});
	}
	protected parseResult(result: Object): HotelAmenitiesDO {
		var hotelAmenitiesDO: HotelAmenitiesDO = new HotelAmenitiesDO();
		hotelAmenitiesDO.buildFromObject(result);
		return hotelAmenitiesDO;
	}
	public getHotelAmenitiesDO(): Observable<HotelAmenitiesDO> {
		return this.getServiceObservable();
	}
}