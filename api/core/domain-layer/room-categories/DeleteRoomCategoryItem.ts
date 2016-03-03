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
import {RoomCategoryMetaRepoDO, RoomCategoryItemMetaRepoDO} from '../../data-layer/room-categories/repositories/IRoomCategoryRepository';
import {RoomCategoryDO} from '../../data-layer/room-categories/data-objects/RoomCategoryDO';

export class DeleteRoomCategoryItemDO {
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

export class DeleteRoomCategoryItem {
	private _roomCategoryMeta: RoomCategoryMetaRepoDO;
	private _deleteItemDO: DeleteRoomCategoryItemDO;

	private _loadedRoomCategory: RoomCategoryDO;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
		this._roomCategoryMeta = {
			hotelId: this._sessionContext.sessionDO.hotel.id
		}
	}

	public delete(deleteItemDO: DeleteRoomCategoryItemDO): Promise<RoomCategoryDO> {
		this._deleteItemDO = deleteItemDO;

		return new Promise<RoomCategoryDO>((resolve: { (result: RoomCategoryDO): void }, reject: { (err: ThError): void }) => {
			try {
				this.deleteCore(resolve, reject);
			} catch (error) {
				var thError = new ThError(ThStatusCode.DeleteAddOnProductItemError, error);
				ThLogger.getInstance().logError(ThLogLevel.Error, "error deleting room category", this._deleteItemDO, thError);
				reject(thError);
			}
		});
	}
	private deleteCore(resolve: { (result: RoomCategoryDO): void }, reject: { (err: ThError): void }) {
		var validationResult = DeleteRoomCategoryItemDO.getValidationStructure().validateStructure(this._deleteItemDO);
		if (!validationResult.isValid()) {
			var parser = new ValidationResultParser(validationResult, this._deleteItemDO);
			parser.logAndReject("Error validating data for delete room category", reject);
			return;
		}
		var roomCategoryRepo = this._appContext.getRepositoryFactory().getRoomCategoryRepository();
		roomCategoryRepo.getRoomCategoryById(this._roomCategoryMeta, this._deleteItemDO.id)
			.then((result: RoomCategoryDO) => {
				this._loadedRoomCategory = result;

				return this.validateRoomCategory();
			})
			.then((validationResult: boolean) => {
				var roomCategoryRepo = this._appContext.getRepositoryFactory().getRoomCategoryRepository();
				var itemMeta = this.buildRoomCategoryItemMetaRepoDO();
				return roomCategoryRepo.deleteRoomCategory(this._roomCategoryMeta, itemMeta);
			})
			.then((deletedRoomCategory: RoomCategoryDO) => {
				resolve(deletedRoomCategory);
			}).catch((error: any) => {
				var thError = new ThError(ThStatusCode.DeleteAddOnProductItemError, error);
				if (thError.isNativeError()) {
					ThLogger.getInstance().logError(ThLogLevel.Error, "error deleting room category", this._deleteItemDO, thError);
				}
				reject(thError);
			});
	}
	private buildRoomCategoryItemMetaRepoDO(): RoomCategoryItemMetaRepoDO {
		return {
			id: this._loadedRoomCategory.id,
			versionId: this._loadedRoomCategory.versionId
		};
	}
	private validateRoomCategory(): Promise<boolean> {
		return new Promise<boolean>((resolve: { (result: boolean): void }, reject: { (err: ThError): void }) => {
			try {
				this.validateLoadedRoomCategoryCore(resolve, reject);
			} catch (error) {
				var thError = new ThError(ThStatusCode.DeleteAddOnProductItemErrorValidating, error);
				ThLogger.getInstance().logError(ThLogLevel.Error, "error validating loaded room category", this._loadedRoomCategory, thError);
				reject(thError);
			}
		});
	}
	private validateLoadedRoomCategoryCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
		// TODO: add validations for deleting room category 
		resolve(true);
	}
}