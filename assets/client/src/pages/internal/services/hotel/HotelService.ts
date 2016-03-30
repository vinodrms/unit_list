import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {AppContext, ThServerApi} from '../../../../common/utils/AppContext';
import {ARequestService} from '../common/ARequestService';
import {HotelDetailsDO} from './data-objects/HotelDetailsDO';
import {HotelAmenitiesService} from '../settings/HotelAmenitiesService';
import {HotelDO} from './data-objects/hotel/HotelDO';

@Injectable()
export class HotelService extends ARequestService<HotelDetailsDO> {
	constructor(private _appContext: AppContext) {
		super();
	}
	protected sendRequest(): Observable<Object> {
		return this._appContext.thHttp.get(ThServerApi.HotelDetails);
	}
	protected parseResult(result: Object): HotelDetailsDO {
		var hotelDetailsDO: HotelDetailsDO = new HotelDetailsDO();
		hotelDetailsDO.buildFromObject(result["details"]);
		return hotelDetailsDO;
	}
	public getHotelDetailsDO(): Observable<HotelDetailsDO> {
		return this.getServiceObservable();
	}
	public updateOverviewInfo(hotel: HotelDO): Observable<HotelDetailsDO> {
		return this._appContext.thHttp.post(ThServerApi.HotelDetailsUpdateBasicInfo, { basicInfo: hotel }).map((hotelDetailsObject: Object) => {
			var hotelDetails: HotelDetailsDO = this.parseResult(hotelDetailsObject);
			this.updateResult(hotelDetails);
			return hotelDetails;
		});
	}
	public updatePaymentsAndPolicies(hotel: HotelDO): Observable<HotelDetailsDO> {
		return this._appContext.thHttp.post(ThServerApi.HotelDetailsUpdatePaymentsAndPolicies, { paymentsAndPolicies: hotel }).map((hotelDetailsObject: Object) => {
			var hotelDetails: HotelDetailsDO = this.parseResult(hotelDetailsObject);
			this.updateResult(hotelDetails);
			return hotelDetails;
		});
	}
}