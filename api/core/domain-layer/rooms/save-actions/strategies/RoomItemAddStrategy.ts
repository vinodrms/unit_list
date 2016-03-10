import {ThError} from '../../../../utils/th-responses/ThError';
import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';
import {RoomDO} from '../../../../data-layer/rooms/data-objects/RoomDO';
import {IRoomItemActionStrategy} from '../IRoomItemActionStrategy';
import {RoomMetaRepoDO} from '../../../../data-layer/rooms/repositories/IRoomRepository';

export class RoomItemAddStrategy implements IRoomItemActionStrategy {
	constructor(private _appContext: AppContext, private _sessionContext: SessionContext, private _roomDO: RoomDO) {
	}
	save(resolve: { (result: RoomDO): void }, reject: { (err: ThError): void }) {
		var roomRepo = this._appContext.getRepositoryFactory().getRoomRepository();
		var roomMeta = this.buildRoomMetaRepoDO();
		roomRepo.addRoom(roomMeta, this._roomDO).then((result: RoomDO) => {
			resolve(result);
		}).catch((err: any) => {
			reject(err);
		});
	}
	private buildRoomMetaRepoDO(): RoomMetaRepoDO {
		return {
			hotelId: this._sessionContext.sessionDO.hotel.id
		}
	}
}