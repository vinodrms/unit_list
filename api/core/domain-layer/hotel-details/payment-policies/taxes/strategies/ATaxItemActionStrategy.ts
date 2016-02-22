import {ThLogger, ThLogLevel} from '../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../../utils/AppContext';
import {SessionContext} from '../../../../../utils/SessionContext';
import {ITaxItemActionStrategy} from '../ITaxItemActionStrategy';
import {IValidationStructure} from '../../../../../utils/th-validation/structure/core/IValidationStructure';
import {HotelDO} from '../../../../../data-layer/hotel/data-objects/HotelDO';
import {ValidationResultParser} from '../../../../common/ValidationResultParser';
import {TaxDO} from '../../../../../data-layer/common/data-objects/taxes/TaxDO';
import {HotelMetaRepoDO, TaxRepoDO} from '../../../../../data-layer/hotel/repositories/IHotelRepository';
import {ThUtils} from '../../../../../utils/ThUtils';

export abstract class ATaxItemActionStrategy implements ITaxItemActionStrategy {
	protected _isValidStrategy: boolean;
	protected _thUtils: ThUtils;
	protected _builtTaxDO: TaxDO;
	constructor(protected _appContext: AppContext, protected _sessionContext: SessionContext, protected _taxObject: Object) {
		this._thUtils = new ThUtils();
		this._isValidStrategy = true;
	}
	public validateAsync(finishedValidatingTaxItemCallback: { (err: ThError, success?: boolean): void; }) {
		this.validate().then((result: boolean) => {
			finishedValidatingTaxItemCallback(null, result);
		}).catch((err: any) => {
			finishedValidatingTaxItemCallback(err);
		});
	}
	private validate(): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			try {
				this.validateCore(resolve, reject);
			} catch (e) {
				var thError = new ThError(ThStatusCode.ATaxItemActionStrategyErrorValidating, e);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error validating the tax item's structure", this._taxObject, thError);
				reject(thError);
			}
        });
	}
	private validateCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
		if (!this._isValidStrategy) {
			var thError = new ThError(ThStatusCode.ATaxItemActionStrategyInvalidTaxItemType, null);
			ThLogger.getInstance().logBusiness(ThLogLevel.Error, "Invalid TaxItemType; enum TaxItemType", this._taxObject, thError);
			reject(thError);
			return;
		}
		var validationResult = this.getValidationStructure().validateStructure(this._taxObject);
		if (!validationResult.isValid()) {
			var parser = new ValidationResultParser(validationResult, this._taxObject);
			parser.logAndReject("Error validating data for save tax item", reject);
			return;
		}
		this._builtTaxDO = this.buildTaxDO();
		if (!this._builtTaxDO.isValid()) {
			var thError = new ThError(ThStatusCode.ATaxItemActionStrategyErrorValidating, null);
			ThLogger.getInstance().logBusiness(ThLogLevel.Error, "Error validating the tax item's structure", this._taxObject, thError);
			reject(thError);
			return;
		}
		resolve(true);
	}
	protected abstract getValidationStructure(): IValidationStructure;
	protected abstract buildTaxDO(): TaxDO;

	public abstract saveAsync(hotelMeta: HotelMetaRepoDO, finishedSavingTaxItemCallback: { (err: ThError, updatedHotel?: HotelDO): void; });
	protected getTaxRepoDO(): TaxRepoDO {
		return {
			tax: this._builtTaxDO
		};
	}
}