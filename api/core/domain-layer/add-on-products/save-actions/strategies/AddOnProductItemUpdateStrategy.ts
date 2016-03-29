import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';
import {AddOnProductDO} from '../../../../data-layer/add-on-products/data-objects/AddOnProductDO';
import {IAddOnProductItemActionStrategy} from '../IAddOnProductItemActionStrategy';
import {AddOnProductMetaRepoDO, AddOnProductItemMetaRepoDO} from '../../../../data-layer/add-on-products/repositories/IAddOnProductRepository';

export class AddOnProductItemUpdateStrategy implements IAddOnProductItemActionStrategy {
	private _aopMeta: AddOnProductMetaRepoDO;
	private _loadedAddOnProduct: AddOnProductDO;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext, private _addOnProductDO: AddOnProductDO) {
		this._aopMeta = this.buildAddOnProductMetaRepoDO();
	}
	save(resolve: { (result: AddOnProductDO): void }, reject: { (err: ThError): void }) {
		var aopRepo = this._appContext.getRepositoryFactory().getAddOnProductRepository();
		aopRepo.getAddOnProductById(this._aopMeta, this._addOnProductDO.id)
			.then((loadedAddOnProduct: AddOnProductDO) => {
				this._loadedAddOnProduct = loadedAddOnProduct;

				var aopRepo = this._appContext.getRepositoryFactory().getAddOnProductRepository();
				var itemMeta = this.buildAddOnProductItemMetaRepoDO();
				return aopRepo.updateAddOnProduct(this._aopMeta, itemMeta, this._addOnProductDO);
			})
			.then((updatedAddOnProduct: AddOnProductDO) => {
				resolve(updatedAddOnProduct);
			}).catch((error: any) => {
				var thError = new ThError(ThStatusCode.AddOnProductItemUpdateStrategyErrorUpdating, error);
				if (thError.isNativeError()) {
					ThLogger.getInstance().logError(ThLogLevel.Error, "error updating add on product", this._addOnProductDO, thError);
				}
				reject(thError);
			});
	}
	private buildAddOnProductMetaRepoDO(): AddOnProductMetaRepoDO {
		return {
			hotelId: this._sessionContext.sessionDO.hotel.id
		}
	}
	private buildAddOnProductItemMetaRepoDO(): AddOnProductItemMetaRepoDO {
		return {
			id: this._loadedAddOnProduct.id,
			versionId: this._loadedAddOnProduct.versionId
		};
	}
}