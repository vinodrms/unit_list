import {ThError} from '../../../../utils/th-responses/ThError';
import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';
import {RoomDO, RoomMaintenanceStatus, RollawayBedStatus} from '../../../../data-layer/rooms/data-objects/RoomDO';
import {IRoomItemActionStrategy} from '../IRoomItemActionStrategy';
import {RoomMetaRepoDO} from '../../../../data-layer/rooms/repositories/IRoomRepository';
import {DocumentHistoryDO} from '../../../../data-layer/common/data-objects/document-history/DocumentHistoryDO';

export class RoomItemAddStrategy implements IRoomItemActionStrategy {
	constructor(private _appContext: AppContext, private _sessionContext: SessionContext, private _roomDO: RoomDO) {
	}
	save(resolve: { (result: RoomDO): void }, reject: { (err: ThError): void }) {
		this.populateDefaultMaintenanceValues();

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
	private populateDefaultMaintenanceValues() {
		this._roomDO.maintenanceStatus = RoomMaintenanceStatus.Clean;
		this._roomDO.maintenanceMessage = "";
		this._roomDO.maintenanceHistory = new DocumentHistoryDO();
		this._roomDO.rollawayBedStatus = RollawayBedStatus.NoRollawayBeds;
	}
}