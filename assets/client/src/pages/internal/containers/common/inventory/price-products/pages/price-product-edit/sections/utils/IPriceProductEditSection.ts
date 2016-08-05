import {PriceProductVM} from '../../../../../../../../services/price-products/view-models/PriceProductVM';
import {AddOnProductCategoriesDO} from '../../../../../../../../services/settings/data-objects/AddOnProductCategoriesDO';

export interface IPriceProductEditSection {
	readonly: boolean;
	isValid(): boolean;
	initializeFrom(priceProductVM: PriceProductVM, addOnProductCategories?: AddOnProductCategoriesDO);
	updateDataOn(priceProductVM: PriceProductVM);
}