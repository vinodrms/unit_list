import {SinglePriceDO} from '../../../../../../../../../../services/price-products/data-objects/price/single-price/SinglePriceDO';
import {RoomCategoryStatsDO} from '../../../../../../../../../../services/room-categories/data-objects/RoomCategoryStatsDO';

export class SinglePriceVM {
	private _singlePrice: SinglePriceDO;
	private _roomCategoryStats: RoomCategoryStatsDO;

	public get singlePrice(): SinglePriceDO {
		return this._singlePrice;
	}
	public set singlePrice(singlePrice: SinglePriceDO) {
		this._singlePrice = singlePrice;
	}

	public get roomCategoryStats(): RoomCategoryStatsDO {
		return this._roomCategoryStats;
	}
	public set roomCategoryStats(roomCategoryStats: RoomCategoryStatsDO) {
		this._roomCategoryStats = roomCategoryStats;
	}
}