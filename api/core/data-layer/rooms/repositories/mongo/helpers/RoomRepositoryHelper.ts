import {RoomDO} from '../../../data-objects/RoomDO';

export class RoomRepositoryHelper {
	public buildRoomDOFrom(dbRoom: Object): RoomDO {
		var room: RoomDO = new RoomDO();
		room.buildFromObject(dbRoom);
		return room;
	}
	public buildRoomListFrom(dbRoomList: Array<Object>): RoomDO[] {
		var list: RoomDO[] = [];
		dbRoomList.forEach((dbRoom: Object) => {
			list.push(this.buildRoomDOFrom(dbRoom));
		});
		return list;
	}
}