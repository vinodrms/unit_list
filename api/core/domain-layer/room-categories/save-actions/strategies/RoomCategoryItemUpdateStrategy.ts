import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';
import {RoomCategoryDO} from '../../../../data-layer/room-categories/data-objects/RoomCategoryDO';
import {IRoomCategoryItemActionStrategy} from '../IRoomCategoryItemActionStrategy';
import {RoomCategoryMetaRepoDO, RoomCategoryItemMetaRepoDO} from '../../../../data-layer/room-categories/repositories/IRoomCategoryRepository';

export class RoomCategoryItemUpdateStrategy implements IRoomCategoryItemActionStrategy {
	private _roomCategoryMeta: RoomCategoryMetaRepoDO;
	private _loadedRoomCategory: RoomCategoryDO;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext, private _roomCategoryDO: RoomCategoryDO) {
		this._roomCategoryMeta = this.buildRoomCategoryMetaRepoDO();
	}
	save(resolve: { (result: RoomCategoryDO): void }, reject: { (err: ThError): void }) {
		var roomCategoryRepo = this._appContext.getRepositoryFactory().getRoomCategoryRepository();
		roomCategoryRepo.getRoomCategoryById(this._roomCategoryMeta, this._roomCategoryDO.id)
			.then((loadedRoomCategory: RoomCategoryDO) => {
				this._loadedRoomCategory = loadedRoomCategory;

				var roomCategoryRepo = this._appContext.getRepositoryFactory().getRoomCategoryRepository();
				var itemMeta = this.buildRoomCategoryItemMetaRepoDO();
				return roomCategoryRepo.updateRoomCategory(this._roomCategoryMeta, itemMeta, this._roomCategoryDO);
			})
			.then((updatedRoomCategory: RoomCategoryDO) => {
				resolve(updatedRoomCategory);
			}).catch((error: any) => {
				var thError = new ThError(ThStatusCode.RoomCategoryItemUpdateStrategyErrorUpdating, error);
				if (thError.isNativeError()) {
					ThLogger.getInstance().logError(ThLogLevel.Error, "error updating room category", this._roomCategoryDO, thError);
				}
				reject(thError);
			});
	}
	private buildRoomCategoryMetaRepoDO(): RoomCategoryMetaRepoDO {
		return {
			hotelId: this._sessionContext.sessionDO.hotel.id
		}
	}
	private buildRoomCategoryItemMetaRepoDO(): RoomCategoryItemMetaRepoDO {
		return {
			id: this._loadedRoomCategory.id,
			versionId: this._loadedRoomCategory.versionId
		};
	}
}