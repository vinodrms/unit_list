import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {AppContext, ThServerApi} from '../../../../common/utils/AppContext';
import {ARequestService} from '../common/ARequestService';
import {RoomCategoryDO} from './data-objects/RoomCategoryDO';
import {RoomCategoryStatsDO} from './data-objects/RoomCategoryStatsDO';

@Injectable()
export class RoomCategoriesStatsService {

	constructor(private _appContext: AppContext) {
	}

	public getRoomCategoryStatsForRoomCategoryList(roomCategoryList: RoomCategoryDO[]): Observable<RoomCategoryStatsDO[]> {
		return this.getRoomCategoryStatsForRoomCategoryIdList(_.map(roomCategoryList, (roomCategory: RoomCategoryDO) => {
			return roomCategory.id;
		}));
	}
	public getRoomCategoryStatsForRoomCategoryIdList(roomCategoryIdList: string[]): Observable<RoomCategoryStatsDO[]> {
		return this._appContext.thHttp.post(ThServerApi.RoomCategoriesStats, { roomCategoryIdList: roomCategoryIdList })
			.map((requestResult: Object) => {
				var roomCategoryStatsList: RoomCategoryStatsDO[] = [];

				if (!requestResult || !_.isArray(requestResult["roomCategoryStatsList"])) {
					return roomCategoryStatsList;
				}
				var roomCategStatsObjectList: Object[] = requestResult["roomCategoryStatsList"];
				roomCategStatsObjectList.forEach((roomCategoryStatObject: Object) => {
					var roomCategoryStatDO = new RoomCategoryStatsDO();
					roomCategoryStatDO.buildFromObject(roomCategoryStatObject);
					roomCategoryStatsList.push(roomCategoryStatDO);
				});
				return roomCategoryStatsList;
			});
	}
}