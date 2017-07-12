import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {ThUtils} from '../../../utils/ThUtils';
import {PriceProductDO, PriceProductStatus} from '../../../data-layer/price-products/data-objects/PriceProductDO';
import {PriceProductSearchResultRepoDO} from '../../../data-layer/price-products/repositories/IPriceProductRepository';
import {PriceProductsContainer} from './results/PriceProductsContainer';

import _ = require("underscore");

export class PriceProductIdValidator {
	private _thUtils: ThUtils;
	private _priceProductIdList: string[];

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
		this._thUtils = new ThUtils();
	}

	public validatePriceProductId(priceProductId: string): Promise<PriceProductsContainer> {
		return this.validatePriceProductIdList([priceProductId]);
	}

	public validatePriceProductIdList(priceProductIdList: string[]): Promise<PriceProductsContainer> {
		this._priceProductIdList = priceProductIdList;
		return new Promise<PriceProductsContainer>((resolve: { (result: PriceProductsContainer): void }, reject: { (err: ThError): void }) => {
			this.validatePriceProductIdListCore(resolve, reject);
		});
	}
	private validatePriceProductIdListCore(resolve: { (result: PriceProductsContainer): void }, reject: { (err: ThError): void }) {
		if (this._priceProductIdList.length == 0) {
			resolve(new PriceProductsContainer([]));
			return;
		}

		var priceProductRepo = this._appContext.getRepositoryFactory().getPriceProductRepository();
		priceProductRepo.getPriceProductList({ hotelId: this._sessionContext.sessionDO.hotel.id }, { priceProductIdList: this._priceProductIdList, status: PriceProductStatus.Active })
			.then((searchResult: PriceProductSearchResultRepoDO) => {
				var validPriceProductIdList: string[] = this.getIdList(searchResult.priceProductList);
				if (!this._thUtils.firstArrayIncludedInSecond(this._priceProductIdList, validPriceProductIdList)) {
					var thError = new ThError(ThStatusCode.PriceProductIdValidatorInvalidId, null);
					ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Invalid price product id list", this._priceProductIdList, thError);
					throw thError;
				}
				resolve(new PriceProductsContainer(searchResult.priceProductList));
			}).catch((error: any) => {
				reject(error);
			});
	}
	private getIdList(priceProductIdList: PriceProductDO[]): string[] {
		return _.map(priceProductIdList, (priceProduct: PriceProductDO) => {
			return priceProduct.id;
		});
	}
}