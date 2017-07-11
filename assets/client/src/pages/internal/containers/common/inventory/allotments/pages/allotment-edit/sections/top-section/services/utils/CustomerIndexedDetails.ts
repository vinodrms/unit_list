import { RoomCategoryDO } from '../../../../../../../../../../services/room-categories/data-objects/RoomCategoryDO';
import { PriceProductDO } from '../../../../../../../../../../services/price-products/data-objects/PriceProductDO';

import * as _ from "underscore";

export class CustomerIndexedDetails {
	private _roomCategoryList: RoomCategoryDO[];
	private _priceProductList: PriceProductDO[];

	constructor() {
	}

	public get roomCategoryList(): RoomCategoryDO[] {
		return this._roomCategoryList;
	}
	public set roomCategoryList(roomCategoryList: RoomCategoryDO[]) {
		this._roomCategoryList = roomCategoryList;
	}
	public get priceProductList(): PriceProductDO[] {
		return this._priceProductList;
	}
	public set priceProductList(priceProductList: PriceProductDO[]) {
		this._priceProductList = priceProductList;
	}

	public getRoomCategoryListById(roomCategoryIdList: string[]): RoomCategoryDO[] {
		return _.filter(this._roomCategoryList, (roomCategory: RoomCategoryDO) => {
			return _.contains(roomCategoryIdList, roomCategory.id);
		});
	}
	public getPriceProductById(priceProductId: string): PriceProductDO {
		return _.find(this._priceProductList, (priceProduct: PriceProductDO) => {
			return priceProduct.id === priceProductId;
		});
	}
}