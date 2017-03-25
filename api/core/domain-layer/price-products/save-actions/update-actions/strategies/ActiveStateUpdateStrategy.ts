import { ThLogger, ThLogLevel } from '../../../../../utils/logging/ThLogger';
import { ThError } from '../../../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../../../utils/th-responses/ThResponse';
import { AppContext } from '../../../../../utils/AppContext';
import { SessionContext } from '../../../../../utils/SessionContext';
import { ThUtils } from "../../../../../utils/ThUtils";
import { PriceProductDO } from '../../../../../data-layer/price-products/data-objects/PriceProductDO';
import { PriceProductMetaRepoDO, PriceProductItemMetaRepoDO } from '../../../../../data-layer/price-products/repositories/IPriceProductRepository';
import { IPriceProductItemActionStrategy } from '../../IPriceProductItemActionStrategy';
import { YieldManagerFilterValidator } from '../../../../hotel-configurations/validators/YieldManagerFilterValidator';
import { PriceProductActionUtils } from "../../utils/PriceProductActionUtils";
import { SavePriceProductItemDO } from "../../../SavePriceProductItemDO";

export class ActiveStateUpdateStrategy implements IPriceProductItemActionStrategy {
	private _thUtils: ThUtils;
	private _priceProductUtils: PriceProductActionUtils;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext,
		private _ppRepoMeta: PriceProductMetaRepoDO, private _ppItemRepoMeta: PriceProductItemMetaRepoDO,
		private _priceProductDO: PriceProductDO,
		private _loadedPriceProductDO: PriceProductDO) {
		this._thUtils = new ThUtils();
		this._priceProductUtils = new PriceProductActionUtils();
	}

	public save(resolve: { (result: PriceProductDO): void }, reject: { (err: ThError): void }) {
		var ymFilterValidator = new YieldManagerFilterValidator(this._appContext, this._sessionContext);
		ymFilterValidator.validateFilterList(this._priceProductDO.yieldFilterList)
			.then((filterCheckResult: boolean) => {
				this.updateAttributesOnLoadedPriceProduct();
				var priceProductRepo = this._appContext.getRepositoryFactory().getPriceProductRepository();
				return priceProductRepo.updatePriceProduct(this._ppRepoMeta, this._ppItemRepoMeta, this._loadedPriceProductDO);
			}).then((updatedPriceProduct: PriceProductDO) => {
				resolve(updatedPriceProduct);
			}).catch((error: any) => {
				reject(error);
			});
	}

	private updateAttributesOnLoadedPriceProduct() {
		this._loadedPriceProductDO.yieldFilterList = this._priceProductDO.yieldFilterList;
		this._loadedPriceProductDO.notes = this._priceProductDO.notes;
		this.updateExistingDynamicRatesOnLoadedPriceProduct();
		this.addNewDynamicRatesOnLoadedPriceProduct();
	}

	private updateExistingDynamicRatesOnLoadedPriceProduct() {
		this._loadedPriceProductDO.price.dynamicPriceList.forEach(loadedDynamicPrice => {
			let dynamicPrice = this._priceProductDO.price.getDynamicPriceById(loadedDynamicPrice.id);
			if (this._thUtils.isUndefinedOrNull(dynamicPrice)) {
				var thError = new ThError(ThStatusCode.PriceProductItemStrategyMissingDynamicRates, null);
				ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "missing dynamic daily rates", this._priceProductDO, thError);
				throw thError;
			}
			loadedDynamicPrice.name = dynamicPrice.name;
			loadedDynamicPrice.description = dynamicPrice.description;
		});
	}

	private addNewDynamicRatesOnLoadedPriceProduct() {
		this._priceProductDO.price.dynamicPriceList.forEach(dynamicPrice => {
			if (this._thUtils.isUndefinedOrNull(dynamicPrice.id)) {
				dynamicPrice.id = this._priceProductUtils.generateDynamicPriceId();
				this._loadedPriceProductDO.price.dynamicPriceList.push(dynamicPrice);
			}
		});
	}
}