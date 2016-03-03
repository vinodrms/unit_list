import {ThError} from '../../../../utils/th-responses/ThError';
import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';
import {RoomCategoryDO} from '../../../../data-layer/room-categories/data-objects/RoomCategoryDO';
import {IRoomCategoryItemActionStrategy} from '../IRoomCategoryItemActionStrategy';
import {RoomCategoryMetaRepoDO} from '../../../../data-layer/room-categories/repositories/IRoomCategoryRepository';

export class RoomCategoryItemAddStrategy implements IRoomCategoryItemActionStrategy {
	constructor(private _appContext: AppContext, private _sessionContext: SessionContext, private _roomCategoryDO: RoomCategoryDO) {
	}
	save(resolve: { (result: RoomCategoryDO): void }, reject: { (err: ThError): void }) {
		var roomCategoryRepo = this._appContext.getRepositoryFactory().getRoomCategoryRepository();
		var roomCategoryMeta = this.buildRoomCategoryMetaRepoDO();
		roomCategoryRepo.addRoomCategory(roomCategoryMeta, this._roomCategoryDO).then((result: RoomCategoryDO) => {
			resolve(result);
		}).catch((err: any) => {
			reject(err);
		});
	}
	private buildRoomCategoryMetaRepoDO(): RoomCategoryMetaRepoDO {
		return {
			hotelId: this._sessionContext.sessionDO.hotel.id
		}
	}
}