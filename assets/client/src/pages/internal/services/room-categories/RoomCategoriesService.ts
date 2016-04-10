import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {AppContext, ThServerApi} from '../../../../common/utils/AppContext';
import {ARequestService} from '../common/ARequestService';
import {RoomCategoryDO} from './data-objects/RoomCategoryDO';

@Injectable()
export class RoomCategoriesService extends ARequestService<RoomCategoryDO[]> {
	constructor(private _appContext: AppContext) {
		super();
	}
	protected sendRequest(): Observable<Object> {
		return this._appContext.thHttp.post(ThServerApi.RoomCategories, {});
	}
	protected parseResult(result: Object): RoomCategoryDO[] {
		var roomCategoryList: RoomCategoryDO[] = [];

		if (!result["result"] || !_.isArray(result["result"].roomCategoryList)) {
			return roomCategoryList;
		}
		var roomCategObjectList: Object[] = result["result"].roomCategoryList;
		roomCategObjectList.forEach((roomCategoryObject: Object) => {
			var roomCategoryDO = new RoomCategoryDO();
			roomCategoryDO.buildFromObject(roomCategoryObject);
			roomCategoryList.push(roomCategoryDO);
		});

		return roomCategoryList;
	}
	public getRoomCategoryList(): Observable<RoomCategoryDO[]> {
		return this.getServiceObservable();
	}

	public saveRoomCategory(roomCategDO: RoomCategoryDO): Observable<RoomCategoryDO> {
		return this._appContext.thHttp.post(ThServerApi.RoomCategoriesSaveItem, { roomCategory: roomCategDO }).map((taxObject: Object) => {
			var roomCategoryDO: RoomCategoryDO = new RoomCategoryDO();
			roomCategoryDO.buildFromObject(taxObject["roomCategory"]);
			return roomCategoryDO;
		});
	}
}