import {RoomCategoryDO} from '../../../data-objects/RoomCategoryDO';

export class RoomCategoryRepositoryHelper {
	public buildRoomCategoryDOFrom(dbRoomCategory: Object): RoomCategoryDO {
		var roomCategory: RoomCategoryDO = new RoomCategoryDO();
		roomCategory.buildFromObject(dbRoomCategory);
		return roomCategory;
	}
	public buildRoomCategoryListFrom(dbRoomCategoryList: Array<Object>): RoomCategoryDO[] {
		var list: RoomCategoryDO[] = [];
		dbRoomCategoryList.forEach((dbRoomCategory: Object) => {
			list.push(this.buildRoomCategoryDOFrom(dbRoomCategory));
		});
		return list;
	}
}