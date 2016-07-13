import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import {AppContext, ThServerApi} from '../../../../common/utils/AppContext';
import {ARequestService} from '../common/ARequestService';
import {RoomCategoryDO} from './data-objects/RoomCategoryDO';
import {RoomCategoryStatsDO} from './data-objects/RoomCategoryStatsDO';

@Injectable()
export class RoomCategoriesStatsService extends ARequestService<RoomCategoryStatsDO[]> {
	private _roomCategoryIdList: string[];

	constructor(private _appContext: AppContext) {
		super();
	}

	protected sendRequest(): Observable<Object> {
		var reqParams = {};
		if(!this._appContext.thUtils.isUndefinedOrNull(this._roomCategoryIdList)) {
			reqParams['roomCategoryIdList'] = this._roomCategoryIdList;
		}
		return this._appContext.thHttp.post(ThServerApi.RoomCategoriesStats, reqParams);
	}
	protected parseResult(result: Object): RoomCategoryStatsDO[] {
		var roomCategoryStatsList: RoomCategoryStatsDO[] = [];
		if (!result || !_.isArray(result["roomCategoryStatsList"])) {
			return roomCategoryStatsList;
		}
		var roomCategStatsObjectList: Object[] = result["roomCategoryStatsList"];
		roomCategStatsObjectList.forEach((roomCategoryStatObject: Object) => {
			var roomCategoryStatDO = new RoomCategoryStatsDO();
			roomCategoryStatDO.buildFromObject(roomCategoryStatObject);
			roomCategoryStatsList.push(roomCategoryStatDO);
		});
		return _.sortBy(roomCategoryStatsList, (roomCategoryStats: RoomCategoryStatsDO) => {
			return - (roomCategoryStats.capacity.totalCapacity.noAdults + roomCategoryStats.capacity.totalCapacity.noChildren);
		});
	}

	public getRoomCategoryStatsForRoomCategoryList(roomCategoryList: RoomCategoryDO[]): Observable<RoomCategoryStatsDO[]> {
		this._roomCategoryIdList = _.map(roomCategoryList, (roomCategory: RoomCategoryDO) => {
			return roomCategory.id;
		});
		return this.getServiceObservable();
	}
	public getRoomCategoryStatsForRoomCategoryIdList(roomCategoryIdList?: string[]): Observable<RoomCategoryStatsDO[]> {
		this._roomCategoryIdList = roomCategoryIdList;
		return this.getServiceObservable();
	}
	public refreshData() {
		this.updateServiceResult();
	}
}