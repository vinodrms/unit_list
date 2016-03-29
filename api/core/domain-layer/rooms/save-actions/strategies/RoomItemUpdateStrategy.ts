import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';
import {RoomDO} from '../../../../data-layer/rooms/data-objects/RoomDO';
import {IRoomItemActionStrategy} from '../IRoomItemActionStrategy';
import {RoomMetaRepoDO, RoomItemMetaRepoDO} from '../../../../data-layer/rooms/repositories/IRoomRepository';

export class RoomItemUpdateStrategy implements IRoomItemActionStrategy {
	private _roomMeta: RoomMetaRepoDO;
	private _loadedRoom: RoomDO;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext, private _roomDO: RoomDO) {
		this._roomMeta = this.buildRoomMetaRepoDO();
	}
	save(resolve: { (result: RoomDO): void }, reject: { (err: ThError): void }) {
		var roomRepo = this._appContext.getRepositoryFactory().getRoomRepository();
		roomRepo.getRoomById(this._roomMeta, this._roomDO.id)
			.then((loadedRoom: RoomDO) => {
				this._loadedRoom = loadedRoom;

				var roomRepo = this._appContext.getRepositoryFactory().getRoomRepository();
				var itemMeta = this.buildRoomItemMetaRepoDO();
				return roomRepo.updateRoom(this._roomMeta, itemMeta, this._roomDO);
			})
			.then((updatedRoom: RoomDO) => {
				resolve(updatedRoom);
			}).catch((error: any) => {
				var thError = new ThError(ThStatusCode.RoomItemUpdateStrategyErrorUpdating, error);
				if (thError.isNativeError()) {
					ThLogger.getInstance().logError(ThLogLevel.Error, "error updating room", this._roomDO, thError);
				}
				reject(thError);
			});
	}
	private buildRoomMetaRepoDO(): RoomMetaRepoDO {
		return {
			hotelId: this._sessionContext.sessionDO.hotel.id
		}
	}
	private buildRoomItemMetaRepoDO(): RoomItemMetaRepoDO {
		return {
			id: this._loadedRoom.id,
			versionId: this._loadedRoom.versionId
		};
	}
}