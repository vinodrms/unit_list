import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppContext, ThServerApi } from '../../../../common/utils/AppContext';
import { ARequestService } from '../common/ARequestService';
import { RoomAmenitiesDO } from './data-objects/RoomAmenitiesDO';

@Injectable()
export class RoomAmenitiesService extends ARequestService<RoomAmenitiesDO> {
	constructor(private _appContext: AppContext) {
		super();
	}
	protected sendRequest(): Observable<Object> {
		return this._appContext.thHttp.get({
			serverApi: ThServerApi.SettingsRoomAmenities
		});
	}
	protected parseResult(result: Object): RoomAmenitiesDO {
		var roomAmenitiesDO = new RoomAmenitiesDO();
		roomAmenitiesDO.buildFromObject(result);
		return roomAmenitiesDO;
	}
	public getRoomAmenitiesDO(): Observable<RoomAmenitiesDO> {
		return this.getServiceObservable();
	}
}