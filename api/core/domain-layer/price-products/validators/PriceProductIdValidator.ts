import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {ThUtils} from '../../../utils/ThUtils';
import {PriceProductDO, PriceProductStatus} from '../../../data-layer/price-products/data-objects/PriceProductDO';
import {PriceProductSearchResultRepoDO} from '../../../data-layer/price-products/repositories/IPriceProductRepository';

export class PriceProductIdValidator {
	private _thUtils: ThUtils;
	private _priceProductIdList: string[];

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
		this._thUtils = new ThUtils();
	}

	public validatePriceProductId(priceProductId: string): Promise<boolean> {
		return this.validatePriceProductIdList([priceProductId]);
	}

	public validatePriceProductIdList(priceProductIdList: string[]): Promise<boolean> {
		this._priceProductIdList = priceProductIdList;
		return new Promise<boolean>((resolve: { (result: boolean): void }, reject: { (err: ThError): void }) => {
			this.validatePriceProductIdListCore(resolve, reject);
		});
	}
	private validatePriceProductIdListCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
		var priceProductRepo = this._appContext.getRepositoryFactory().getPriceProductRepository();
		priceProductRepo.getPriceProductList({ hotelId: this._sessionContext.sessionDO.hotel.id }, { priceProductIdList: this._priceProductIdList, status: PriceProductStatus.Active })
			.then((searchResult: PriceProductSearchResultRepoDO) => {
				var validPriceProductIdList: string[] = this.getIdList(searchResult.priceProductList);
				if (!this._thUtils.firstArrayIncludedInSecond(this._priceProductIdList, validPriceProductIdList)) {
					var thError = new ThError(ThStatusCode.PriceProductIdValidatorInvalidId, null);
					ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Invalid price product id list", this._priceProductIdList, thError);
					throw thError;
				}
				resolve(true);
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