import {ThLogger, ThLogLevel} from '../../utils/logging/ThLogger';
import {ThError} from '../../utils/th-responses/ThError';
import {ThStatusCode} from '../../utils/th-responses/ThResponse';
import {AppContext} from '../../utils/AppContext';
import {SessionContext} from '../../utils/SessionContext';
import {SaveBedItemDO} from './SaveBedItemDO';
import {ValidationResultParser} from '../common/ValidationResultParser';
import {BedDO} from '../../data-layer/common/data-objects/bed/BedDO';
import {IValidationStructure} from '../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../utils/th-validation/structure/ObjectValidationStructure';
import {PrimitiveValidationStructure} from '../../utils/th-validation/structure/PrimitiveValidationStructure';
import {StringValidationRule} from '../../utils/th-validation/rules/StringValidationRule';
import {BedMetaRepoDO, BedItemMetaRepoDO} from '../../data-layer/beds/repositories/IBedRepository';
import {RoomSearchResultRepoDO} from '../../data-layer/rooms/repositories/IRoomRepository';
import {RoomCategorySearchResultRepoDO} from '../../data-layer/room-categories/repositories/IRoomCategoryRepository';

export class DeleteBedItemDO {
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

export class DeleteBedItem {
	private _bedMeta: BedMetaRepoDO;
	private _bedItemDO: DeleteBedItemDO;

	private _loadedBed: BedDO;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
		this._bedMeta = {
			hotelId: this._sessionContext.sessionDO.hotel.id
		}
	}

	public delete(bedItemDO: DeleteBedItemDO): Promise<BedDO> {
		this._bedItemDO = bedItemDO;

		return new Promise<BedDO>((resolve: { (result: BedDO): void }, reject: { (err: ThError): void }) => {
			try {
				this.deleteCore(resolve, reject);
			} catch (error) {
				var thError = new ThError(ThStatusCode.DeleteBedItemErrorDeleting, error);
				ThLogger.getInstance().logError(ThLogLevel.Error, "error deleting bed item", this._bedItemDO, thError);
				reject(thError);
			}
		});
	}
	private deleteCore(resolve: { (result: BedDO): void }, reject: { (err: ThError): void }) {
		var validationResult = DeleteBedItemDO.getValidationStructure().validateStructure(this._bedItemDO);
		if (!validationResult.isValid()) {
			var parser = new ValidationResultParser(validationResult, this._bedItemDO);
			parser.logAndReject("Error validating data for bed item deletion", reject);
			return;
		}
		var bedRepo = this._appContext.getRepositoryFactory().getBedRepository();
		bedRepo.getBedById(this._bedMeta, this._bedItemDO.id)
			.then((loadedBed: BedDO) => {
				this._loadedBed = loadedBed;

				return this.validateLoadedBed();
			})
			.then((validationResult: boolean) => {
				var bedRepo = this._appContext.getRepositoryFactory().getBedRepository();
				var itemMeta = this.buildBedItemMetaRepoDO();

				return bedRepo.deleteBed(this._bedMeta, itemMeta);
			})
			.then((deletedBed: BedDO) => {
				resolve(deletedBed);
			}).catch((error: any) => {
				var thError = new ThError(ThStatusCode.DeleteBedItemErrorDeleting, error);
				if (thError.isNativeError()) {
					ThLogger.getInstance().logError(ThLogLevel.Error, "error deleting bed item", this._bedItemDO, thError);
				}
				reject(thError);
			});
	}
	private buildBedItemMetaRepoDO(): BedItemMetaRepoDO {
		return {
			id: this._loadedBed.id,
			versionId: this._loadedBed.versionId
		};
	}

	private validateLoadedBed(): Promise<boolean> {
		return new Promise<boolean>((resolve: { (result: boolean): void }, reject: { (err: ThError): void }) => {
			try {
				this.validateLoadedBedCore(resolve, reject);
			} catch (error) {
				var thError = new ThError(ThStatusCode.DeleteBedItemErrorValidating, error);
				ThLogger.getInstance().logError(ThLogLevel.Error, "error validating loaded bed", this._loadedBed, thError);
				reject(thError);
			}
		});
	}
	private validateLoadedBedCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
		
		var roomCategoriesRepo = this._appContext.getRepositoryFactory().getRoomCategoryRepository();
		roomCategoriesRepo.getRoomCategoryList({ hotelId: this._sessionContext.sessionDO.hotel.id },
			{
				bedIdList: [this._bedItemDO.id]
			})
			.then((roomCategorySearchResult: RoomCategorySearchResultRepoDO) => {
				if (roomCategorySearchResult.roomCategoryList.length > 0) {
					var thError = new ThError(ThStatusCode.DeleteBedItemErrorUsedInRoomCategories, null);
					ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Bed delete error: used in room categories", this._bedItemDO, thError);
					reject(thError);
				}
				// TODO: add validations for deleting Bed
				resolve(true);
			}).catch((error: any) => {
				reject(error);
			});
	}
}