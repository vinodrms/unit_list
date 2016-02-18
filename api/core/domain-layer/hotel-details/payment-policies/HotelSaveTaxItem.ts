import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {IValidationStructure} from '../../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../../utils/th-validation/structure/ObjectValidationStructure';
import {PrimitiveValidationStructure} from '../../../utils/th-validation/structure/PrimitiveValidationStructure';
import {NumberValidationRule} from '../../../utils/th-validation/rules/NumberValidationRule';
import {HotelDO} from '../../../data-layer/hotel/data-objects/HotelDO';
import {HotelDetailsBuilder, HotelDetailsDO} from '../utils/HotelDetailsBuilder';
import {ValidationResultParser} from '../../common/ValidationResultParser';
import {TaxItemType, TaxItemActionFactory} from './taxes/TaxItemActionFactory';
import {ITaxItemActionStrategy} from './taxes/ITaxItemActionStrategy';
import {HotelMetaRepoDO} from '../../../data-layer/hotel/repositories/IHotelRepository';

export class HotelSaveTaxItemDO {
	itemType: TaxItemType;
	taxObject: Object;

	public static getValidationStructure(): IValidationStructure {
		return new ObjectValidationStructure([
			{
				key: "itemType",
				validationStruct: new PrimitiveValidationStructure(new NumberValidationRule())
			},
			{
				key: "taxObject",
				validationStruct: new ObjectValidationStructure([])
			}
		]);
	}
}

export class HotelSaveTaxItem {
	private _taxItemDO;
	private _loadedHotel: HotelDO;
	private _taxItemActionStrategy: ITaxItemActionStrategy;
	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
	}
	public save(taxItemDO: HotelSaveTaxItemDO): Promise<HotelDetailsDO> {
		this._taxItemDO = taxItemDO;
		return new Promise<HotelDetailsDO>((resolve: { (result: HotelDetailsDO): void }, reject: { (err: ThError): void }) => {
			try {
				this.saveCore(resolve, reject);
			} catch (e) {
				var thError = new ThError(ThStatusCode.HotelSaveTaxItemError, e);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error saving hotel tax item", this._taxItemDO, thError);
				reject(thError);
			}
		});
	}
	private saveCore(resolve: { (result: HotelDetailsDO): void }, reject: { (err: ThError): void }) {
		var validationResult = HotelSaveTaxItemDO.getValidationStructure().validateStructure(this._taxItemDO);
		if (!validationResult.isValid()) {
			var parser = new ValidationResultParser(validationResult, this._taxItemDO);
			parser.logAndReject("Error validating data for save tax item", reject);
			return;
		}

		async.waterfall([
			((finishGetHotelByIdCallback) => {
				var hotelRepository = this._appContext.getRepositoryFactory().getHotelRepository();
				hotelRepository.getHotelByIdAsync(this._sessionContext.sessionDO.hotel.id, finishGetHotelByIdCallback);
			}),
			((hotel: HotelDO, finishedValidatingTaxItemCallback) => {
				this._loadedHotel = hotel;

				var actionFactory = new TaxItemActionFactory(this._appContext, this._sessionContext);
				this._taxItemActionStrategy = actionFactory.getActionStrategy(this._taxItemDO.itemType, this._taxItemDO.taxObject);
				this._taxItemActionStrategy.validateAsync(finishedValidatingTaxItemCallback);
			}),
			((validationResult: boolean, finishedSavingTaxItemCallback) => {
				this._taxItemActionStrategy.saveAsync(this.getHotelMetaDO(), finishedSavingTaxItemCallback);
			}),
			((hotel: HotelDO, finishBuildResponse) => {
				var hotelDetailsBuilder = new HotelDetailsBuilder(this._sessionContext, hotel);
				hotelDetailsBuilder.buildAsync(finishBuildResponse);
			})
		], ((error: any, response: HotelDetailsDO) => {
			if (error) {
				var thError = new ThError(ThStatusCode.HotelSaveTaxItemError, error);
				if (thError.isNativeError()) {
					ThLogger.getInstance().logError(ThLogLevel.Error, "Error updating hotel payment and policies", this._sessionContext, thError);
				}
				reject(thError);
			}
			else {
				resolve(response);
			}
		}));
	}
	private getHotelMetaDO(): HotelMetaRepoDO {
		return {
			id: this._loadedHotel.id,
			versionId: this._loadedHotel.versionId
		};
	}
}