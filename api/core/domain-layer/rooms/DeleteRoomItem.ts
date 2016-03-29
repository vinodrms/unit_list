import {ThLogger, ThLogLevel} from '../../utils/logging/ThLogger';
import {ThError} from '../../utils/th-responses/ThError';
import {ThStatusCode} from '../../utils/th-responses/ThResponse';
import {AppContext} from '../../utils/AppContext';
import {SessionContext} from '../../utils/SessionContext';
import {ValidationResultParser} from '../common/ValidationResultParser';
import {IValidationStructure} from '../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../utils/th-validation/structure/ObjectValidationStructure';
import {PrimitiveValidationStructure} from '../../utils/th-validation/structure/PrimitiveValidationStructure';
import {StringValidationRule} from '../../utils/th-validation/rules/StringValidationRule';
import {RoomMetaRepoDO, RoomItemMetaRepoDO} from '../../data-layer/rooms/repositories/IRoomRepository';
import {RoomDO} from '../../data-layer/rooms/data-objects/RoomDO';

export class DeleteRoomItemDO {
	id: string;
	public static getValidationStructure(): IValidationStructure {
		return new ObjectValidationStructure([
			{
				key: "id",
				validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
			}
		])
	}
}

export class DeleteRoomItem {
	private _roomMeta: RoomMetaRepoDO;
	private _deleteItemDO: DeleteRoomItemDO;

	private _loadedRoom: RoomDO;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
		this._roomMeta = {
			hotelId: this._sessionContext.sessionDO.hotel.id
		}
	}

	public delete(deleteItemDO: DeleteRoomItemDO): Promise<RoomDO> {
		this._deleteItemDO = deleteItemDO;

		return new Promise<RoomDO>((resolve: { (result: RoomDO): void }, reject: { (err: ThError): void }) => {
			try {
				this.deleteCore(resolve, reject);
			} catch (error) {
				var thError = new ThError(ThStatusCode.DeleteRoomItemError, error);
				ThLogger.getInstance().logError(ThLogLevel.Error, "error deleting room", this._deleteItemDO, thError);
				reject(thError);
			}
		});
	}
	private deleteCore(resolve: { (result: RoomDO): void }, reject: { (err: ThError): void }) {
		var validationResult = DeleteRoomItemDO.getValidationStructure().validateStructure(this._deleteItemDO);
		if (!validationResult.isValid()) {
			var parser = new ValidationResultParser(validationResult, this._deleteItemDO);
			parser.logAndReject("Error validating data for delete room", reject);
			return;
		}
		var roomRepo = this._appContext.getRepositoryFactory().getRoomRepository();
		roomRepo.getRoomById(this._roomMeta, this._deleteItemDO.id)
			.then((result: RoomDO) => {
				this._loadedRoom = result;

				return this.validateRoom();
			})
			.then((validationResult: boolean) => {
				var roomRepo = this._appContext.getRepositoryFactory().getRoomRepository();
				var itemMeta = this.buildRoomItemMetaRepoDO();
				return roomRepo.deleteRoom(this._roomMeta, itemMeta);
			})
			.then((deletedRoom: RoomDO) => {
				resolve(deletedRoom);
			}).catch((error: any) => {
				var thError = new ThError(ThStatusCode.DeleteRoomItemError, error);
				if (thError.isNativeError()) {
					ThLogger.getInstance().logError(ThLogLevel.Error, "error deleting room", this._deleteItemDO, thError);
				}
				reject(thError);
			});
	}
	private buildRoomItemMetaRepoDO(): RoomItemMetaRepoDO {
		return {
			id: this._loadedRoom.id,
			versionId: this._loadedRoom.versionId
		};
	}
	private validateRoom(): Promise<boolean> {
		return new Promise<boolean>((resolve: { (result: boolean): void }, reject: { (err: ThError): void }) => {
			try {
				this.validateLoadedRoomCore(resolve, reject);
			} catch (error) {
				var thError = new ThError(ThStatusCode.DeleteRoomItemError, error);
				ThLogger.getInstance().logError(ThLogLevel.Error, "error validating loaded room", this._loadedRoom, thError);
				reject(thError);
			}
		});
	}
	private validateLoadedRoomCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
		// TODO: add validations for deleting room 
		resolve(true);
	}
}