import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';

import {AppContext, ThServerApi} from '../../../../common/utils/AppContext';
import {ARequestService} from '../common/ARequestService';
import {RoomCategoryDO} from './data-objects/RoomCategoryDO';
import {RoomCategoryStatsDO} from './data-objects/RoomCategoryStatsDO';
import {RoomCategoriesType} from './RoomCategoriesType';

@Injectable()
export class RoomCategoriesStatsService extends ARequestService<RoomCategoryStatsDO[]> {
	private _categoriesType: RoomCategoriesType;

	constructor(private _appContext: AppContext) {
		super();
	}

	protected sendRequest(): Observable<Object> {
		switch (this._categoriesType) {
			case RoomCategoriesType.UsedInRooms:
				return this._appContext.thHttp.post(ThServerApi.UsedRoomCategoriesStats, {});
			default:
				return this._appContext.thHttp.post(ThServerApi.RoomCategoriesStats, {});
		}
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
		var roomCategoryIdList = _.map(roomCategoryList, (roomCategory: RoomCategoryDO) => { return roomCategory.id; });
		return this.getRoomCategoryStatsForRoomCategoryIdList(roomCategoryIdList);
	}
	public getRoomCategoryStatsForRoomCategoryIdList(roomCategoryIdList?: string[]): Observable<RoomCategoryStatsDO[]> {
		if (this._appContext.thUtils.isUndefinedOrNull(roomCategoryIdList) || !_.isArray(roomCategoryIdList)) {
			return this.getServiceObservable();
		}
		return this.getServiceObservable().map((roomCategoryStatsList: RoomCategoryStatsDO[]) => {
			return _.filter(roomCategoryStatsList, (roomCategoryStats: RoomCategoryStatsDO) => {
				return _.contains(roomCategoryIdList, roomCategoryStats.roomCategory.id);
			});
		});
	}
	public getRoomCategoryStatsForRoomCategoryId(roomCategoryId: string): Observable<RoomCategoryStatsDO> {
		return this.getRoomCategoryStatsForRoomCategoryIdList([roomCategoryId])
			.map((roomCategoryStatsList: RoomCategoryStatsDO[]) => {
				return roomCategoryStatsList[0];
			});
	}

	public refreshData() {
		this.updateServiceResult();
	}

	public get categoriesType(): RoomCategoriesType {
		return this._categoriesType;
	}
	public set categoriesType(categoriesType: RoomCategoriesType) {
		this._categoriesType = categoriesType;
	}
}