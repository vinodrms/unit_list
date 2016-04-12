import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {AppContext, ThServerApi} from '../../../../common/utils/AppContext';
import {ARequestService} from '../common/ARequestService';
import {RoomAttributesDO} from './data-objects/RoomAttributesDO';

@Injectable()
export class RoomAttributesService extends ARequestService<RoomAttributesDO> {
	constructor(private _appContext: AppContext) {
		super();
	}
	protected sendRequest(): Observable<Object> {
		return this._appContext.thHttp.get(ThServerApi.SettingsRoomAttributes);
	}
	protected parseResult(result: Object): RoomAttributesDO {
		var roomAttributesDO = new RoomAttributesDO();
		roomAttributesDO.buildFromObject(result);
		return roomAttributesDO;
	}
	public getRoomAttributesDO(): Observable<RoomAttributesDO> {
		return this.getServiceObservable();
	}
}