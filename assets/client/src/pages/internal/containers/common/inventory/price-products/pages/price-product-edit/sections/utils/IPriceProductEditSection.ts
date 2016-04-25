import {PriceProductVM} from '../../../../../../../../services/price-products/view-models/PriceProductVM';

export interface IPriceProductEditSection {
	readonly: boolean;
	isValid(): boolean;
	initializeFrom(priceProductVM: PriceProductVM);
	updateDataOn(priceProductVM: PriceProductVM);
}