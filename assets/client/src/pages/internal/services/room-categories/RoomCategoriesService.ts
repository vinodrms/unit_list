import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppContext, ThServerApi } from '../../../../common/utils/AppContext';
import { ARequestService } from '../common/ARequestService';
import { RoomCategoryDO } from './data-objects/RoomCategoryDO';
import { RoomCategoriesType } from './RoomCategoriesType';

import * as _ from "underscore";

@Injectable()
export class RoomCategoriesService extends ARequestService<RoomCategoryDO[]> {
	private _categoriesType: RoomCategoriesType;

	constructor(private _appContext: AppContext) {
		super();
	}
	protected sendRequest(): Observable<Object> {
		switch (this._categoriesType) {
			case RoomCategoriesType.UsedInRooms:
				return this._appContext.thHttp.get({
					serverApi: ThServerApi.RoomsUsedRoomCategories
				});
			default:
				return this._appContext.thHttp.post({
					serverApi: ThServerApi.RoomCategories
				});
		}
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

	public refreshData() {
		this.updateServiceResult();
	}

	public saveRoomCategory(roomCategDO: RoomCategoryDO): Observable<RoomCategoryDO> {
		return this._appContext.thHttp.post({
			serverApi: ThServerApi.RoomCategoriesSaveItem,
			body: JSON.stringify({
				roomCategory: roomCategDO
			})
		}).map((taxObject: Object) => {
			var roomCategoryDO: RoomCategoryDO = new RoomCategoryDO();
			roomCategoryDO.buildFromObject(taxObject["roomCategory"]);
			return roomCategoryDO;
		});
	}

	public get categoriesType(): RoomCategoriesType {
		return this._categoriesType;
	}
	public set categoriesType(categoriesType: RoomCategoriesType) {
		this._categoriesType = categoriesType;
	}
}