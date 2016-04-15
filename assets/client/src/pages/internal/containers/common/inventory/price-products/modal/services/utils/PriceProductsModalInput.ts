import {PriceProductStatus} from '../../../../../../../services/price-products/data-objects/PriceProductDO';

export class PriceProductsModalInput {
	private _priceProductStatus: PriceProductStatus;

	public get priceProductStatus(): PriceProductStatus {
		return this._priceProductStatus;
	}
	public set priceProductStatus(priceProductStatus: PriceProductStatus) {
		this._priceProductStatus = priceProductStatus;
	}
}