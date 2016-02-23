import {ThLogger, ThLogLevel} from '../../utils/logging/ThLogger';
import {ThError} from '../../utils/th-responses/ThError';
import {ThStatusCode} from '../../utils/th-responses/ThResponse';
import {AppContext} from '../../utils/AppContext';
import {SessionContext} from '../../utils/SessionContext';
import {HotelSaveTaxItemDO} from './HotelSaveTaxItemDO';
import {TaxResponseRepoDO} from '../../data-layer/taxes/repositories/ITaxRepository';
import {ValidationResultParser} from '../common/ValidationResultParser';
import {TaxDO} from '../../data-layer/taxes/data-objects/TaxDO';
import {IValidationStructure} from '../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../utils/th-validation/structure/ObjectValidationStructure';
import {PrimitiveValidationStructure} from '../../utils/th-validation/structure/PrimitiveValidationStructure';
import {StringValidationRule} from '../../utils/th-validation/rules/StringValidationRule';
import {TaxMetaRepoDO, TaxItemMetaRepoDO} from '../../data-layer/taxes/repositories/ITaxRepository';

export class HotelDeleteTaxItemDO {
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

export class HotelDeleteTaxItem {
	private _taxMeta: TaxMetaRepoDO;
	private _taxItemDO: HotelDeleteTaxItemDO;

	private _loadedTax: TaxDO;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
		this._taxMeta = {
			hotelId: this._sessionContext.sessionDO.hotel.id
		}
	}

	public delete(taxItemDO: HotelDeleteTaxItemDO): Promise<TaxDO> {
		this._taxItemDO = taxItemDO;

		return new Promise<TaxDO>((resolve: { (result: TaxDO): void }, reject: { (err: ThError): void }) => {
			try {
				this.deleteCore(resolve, reject);
			} catch (error) {
				var thError = new ThError(ThStatusCode.HotelDeleteTaxItemError, error);
				ThLogger.getInstance().logError(ThLogLevel.Error, "error deleting tax item", this._taxItemDO, thError);
				reject(thError);
			}
		});
	}
	private deleteCore(resolve: { (result: TaxDO): void }, reject: { (err: ThError): void }) {
		var validationResult = HotelDeleteTaxItemDO.getValidationStructure().validateStructure(this._taxItemDO);
		if (!validationResult.isValid()) {
			var parser = new ValidationResultParser(validationResult, this._taxItemDO);
			parser.logAndReject("Error validating data for delete tax item", reject);
			return;
		}
		async.waterfall([
			((finishGetTaxByIdCallback: { (err: ThError, result?: TaxDO): void; }) => {
				var taxRepo = this._appContext.getRepositoryFactory().getTaxRepository();
				taxRepo.getTaxByIdAsync(this._taxMeta, this._taxItemDO.id, finishGetTaxByIdCallback);
			}),
			((loadedTax: TaxDO, finishValidatingCallback: { (err: ThError, result?: boolean): void; }) => {
				this._loadedTax = loadedTax;
				this.validateLoadedTaxAsync(finishValidatingCallback);
			}),
			((validationResult: boolean, finishDeleteTaxCallback: { (err: ThError, result?: TaxDO): void; }) => {
				var taxRepo = this._appContext.getRepositoryFactory().getTaxRepository();
				var itemMeta = this.buildTaxItemMetaRepoDO();
				taxRepo.deleteTaxAsync(this._taxMeta, itemMeta, finishDeleteTaxCallback);
			})
		], ((error: any, deletedTax: TaxDO) => {
			if (error || !deletedTax) {
				var thError = new ThError(ThStatusCode.HotelDeleteTaxItemErrorDeleting, error);
				if (thError.isNativeError()) {
					ThLogger.getInstance().logError(ThLogLevel.Error, "error deleting tax item", this._taxItemDO, thError);
				}
				reject(thError);
			}
			else {
				resolve(deletedTax);
			}
		}));
	}
	private buildTaxItemMetaRepoDO(): TaxItemMetaRepoDO {
		return {
			id: this._loadedTax.id,
			versionId: this._loadedTax.versionId
		};
	}

	private validateLoadedTaxAsync(finishValidatingCallback: { (err: ThError, result?: boolean): void; }) {
		this.validateLoadedTax().then((result: boolean) => {
			finishValidatingCallback(null, result);
		}).catch((err: any) => {
			finishValidatingCallback(err);
		});
	}
	private validateLoadedTax(): Promise<boolean> {
		return new Promise<boolean>((resolve: { (result: boolean): void }, reject: { (err: ThError): void }) => {
			try {
				this.validateLoadedTaxCore(resolve, reject);
			} catch (error) {
				var thError = new ThError(ThStatusCode.HotelDeleteTaxItemErrorValidating, error);
				ThLogger.getInstance().logError(ThLogLevel.Error, "error validating loaded tax", this._loadedTax, thError);
				reject(thError);
			}
		});
	}
	private validateLoadedTaxCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
		// TODO: add validations for deleting VAT (eg: if it is used in existing price products or open invoices)
		resolve(true);
	}
}