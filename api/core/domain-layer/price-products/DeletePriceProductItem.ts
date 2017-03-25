import { AppContext } from '../../utils/AppContext';
import { SessionContext } from '../../utils/SessionContext';
import { PriceProductInputIdDO } from './validation-structures/PriceProductInputIdDO';
import { PriceProductDO, PriceProductStatus } from '../../data-layer/price-products/data-objects/PriceProductDO';
import { ThStatusCode } from "../../utils/th-responses/ThResponse";
import { ThError } from "../../utils/th-responses/ThError";
import { ThLogLevel, ThLogger } from "../../utils/logging/ThLogger";
import { ValidationResultParser } from "../common/ValidationResultParser";
import { PriceProductMetaRepoDO, PriceProductItemMetaRepoDO } from "../../data-layer/price-products/repositories/IPriceProductRepository";

export class DeletePriceProductItem {
	private _inputDO: PriceProductInputIdDO;
	private _oldStatus: PriceProductStatus;
	private _newStatus: PriceProductStatus;

	private _ppRepoMeta: PriceProductMetaRepoDO;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
		this._ppRepoMeta = { hotelId: this._sessionContext.sessionDO.hotel.id };
	}

	public delete(inputDO: PriceProductInputIdDO): Promise<PriceProductDO> {
		return this.updateStatus(inputDO, PriceProductStatus.Draft, PriceProductStatus.Deleted);
	}

	private updateStatus(inputDO: PriceProductInputIdDO, oldStatus: PriceProductStatus, newStatus: PriceProductStatus): Promise<PriceProductDO> {
		this._inputDO = inputDO;
		this._oldStatus = oldStatus;
		this._newStatus = newStatus;

		return new Promise<PriceProductDO>((resolve: { (result: PriceProductDO): void }, reject: { (err: ThError): void }) => {
			try {
				this.updateStatusCore(resolve, reject);
			} catch (error) {
				var thError = new ThError(ThStatusCode.UpdatePriceProductItemStatusError, error);
				ThLogger.getInstance().logError(ThLogLevel.Error, "error updating status for price product", this._inputDO, thError);
				reject(thError);
			}
		});
	}
	private updateStatusCore(resolve: { (result: PriceProductDO): void }, reject: { (err: ThError): void }) {
		var validationResult = PriceProductInputIdDO.getValidationStructure().validateStructure(this._inputDO);
		if (!validationResult.isValid()) {
			var parser = new ValidationResultParser(validationResult, this._inputDO);
			parser.logAndReject("Error validating data for update price product status", reject);
			return false;
		}

		var ppRepo = this._appContext.getRepositoryFactory().getPriceProductRepository();
		ppRepo.getPriceProductById(this._ppRepoMeta, this._inputDO.id)
			.then((loadedPriceProduct: PriceProductDO) => {
				if (loadedPriceProduct.status !== this._oldStatus) {
					var thError = new ThError(ThStatusCode.UpdatePriceProductItemStatusWrongStatus, null);
					ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "invalid old status for price product", this._inputDO, thError);
					throw thError;
				}
				var ppItemRepoMeta: PriceProductItemMetaRepoDO = {
					id: loadedPriceProduct.id,
					versionId: loadedPriceProduct.versionId
				}
				var ppRepo = this._appContext.getRepositoryFactory().getPriceProductRepository();
				return ppRepo.updatePriceProductStatus(this._ppRepoMeta, ppItemRepoMeta, {
					oldStatus: this._oldStatus,
					newStatus: this._newStatus,
					priceProduct: loadedPriceProduct
				});
			})
			.then((updatedPriceProduct: PriceProductDO) => {
				resolve(updatedPriceProduct);
			}).catch((error: any) => {
				var thError = new ThError(ThStatusCode.UpdatePriceProductItemStatusError, error);
				if (thError.isNativeError()) {
					ThLogger.getInstance().logError(ThLogLevel.Error, "error updating price product item status", this._inputDO, thError);
				}
				reject(thError);
			});
	}
}