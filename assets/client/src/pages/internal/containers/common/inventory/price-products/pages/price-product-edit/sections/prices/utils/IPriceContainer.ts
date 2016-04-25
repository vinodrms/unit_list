import {PriceProductPriceType, IPriceProductPrice} from '../../../../../../../../../services/price-products/data-objects/price/IPriceProductPrice';
import {RoomCategoryStatsDO} from '../../../../../../../../../services/room-categories/data-objects/RoomCategoryStatsDO';
import {PriceProductVM} from '../../../../../../../../../services/price-products/view-models/PriceProductVM';

export interface IPriceContainer {
	initializeFrom(priceType: PriceProductPriceType, priceList: IPriceProductPrice[]);
	updateFromRoomCategoryStatsList(roomCategoryStatsList: RoomCategoryStatsDO[]);
	isValid(): boolean;
	updatePricesOn(priceProductVM: PriceProductVM);
}