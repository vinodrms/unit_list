import {SinglePriceVM} from './view-models/SinglePriceVM';
import {RoomCategoryStatsDO} from '../../../../../../../../../services/room-categories/data-objects/RoomCategoryStatsDO';
import {RoomCategoryDO} from '../../../../../../../../../services/room-categories/data-objects/RoomCategoryDO';
import {SinglePriceDO} from '../../../../../../../../../services/price-products/data-objects/price/single-price/SinglePriceDO';
import {PriceProductPriceType, IPriceProductPrice} from '../../../../../../../../../services/price-products/data-objects/price/IPriceProductPrice';
import {PriceProductVM} from '../../../../../../../../../services/price-products/view-models/PriceProductVM';
import {IPriceContainer} from './IPriceContainer';

export class SinglePriceContainer implements IPriceContainer {
	private _singlePriceVMList: SinglePriceVM[];

	constructor() {
		this._singlePriceVMList = [];
	}

	public get singlePriceVMList(): SinglePriceVM[] {
		return this._singlePriceVMList;
	}
	public set singlePriceVMList(singlePriceVMList: SinglePriceVM[]) {
		this._singlePriceVMList = singlePriceVMList;
	}

	public initializeFrom(priceType: PriceProductPriceType, priceList: IPriceProductPrice[]) {
		if (priceType !== PriceProductPriceType.SinglePrice) {
			this.resetValues();
			return;
		}
		var singlePriceDOList: SinglePriceDO[] = <SinglePriceDO[]>priceList;

		var newSinglePriceVMList: SinglePriceVM[] = [];
		_.forEach(singlePriceDOList, (singlePriceDO: SinglePriceDO) => {
			var singlePriceVM = new SinglePriceVM();
			singlePriceVM.roomCategoryStats = new RoomCategoryStatsDO();
			singlePriceVM.roomCategoryStats.roomCategory = new RoomCategoryDO();
			singlePriceVM.roomCategoryStats.roomCategory.id = singlePriceDO.roomCategoryId;
			singlePriceVM.singlePrice = singlePriceDO;
			newSinglePriceVMList.push(singlePriceVM);
		});
		this._singlePriceVMList = newSinglePriceVMList;
	}
	private resetValues() {
		this._singlePriceVMList = [];
	}

	public updateFromRoomCategoryStatsList(roomCategoryStatsList: RoomCategoryStatsDO[]) {
		var newSinglePriceVMList: SinglePriceVM[] = [];
		_.forEach(roomCategoryStatsList, (roomCategoryStats: RoomCategoryStatsDO) => {
			var currentSinglePriceDO = this.getCurrentSinglePriceDOForRoomCategoryId(roomCategoryStats.roomCategory.id);
			var newSinglePriceVM = new SinglePriceVM();
			newSinglePriceVM.roomCategoryStats = roomCategoryStats;
			newSinglePriceVM.singlePrice = currentSinglePriceDO.prototypeForStats(roomCategoryStats);
			newSinglePriceVMList.push(newSinglePriceVM);
		});
		this._singlePriceVMList = newSinglePriceVMList;
	}

	private getCurrentSinglePriceDOForRoomCategoryId(roomCategoryId: string): SinglePriceDO {
		var currentSinglePriceVM = _.find(this._singlePriceVMList, (priceVM: SinglePriceVM) => { return priceVM.singlePrice.roomCategoryId === roomCategoryId });
		if (!currentSinglePriceVM) {
			return new SinglePriceDO();
		}
		return currentSinglePriceVM.singlePrice;
	}

	public isValid(): boolean {
		var valid = true;
		_.forEach(this._singlePriceVMList, (singlePriceVM: SinglePriceVM) => {
			if (!singlePriceVM.singlePrice.isValid()) {
				valid = false;
			}
		});
		return valid;
	}
	public updatePricesOn(priceProductVM: PriceProductVM) {
		priceProductVM.priceProduct.price.type = PriceProductPriceType.SinglePrice;
		priceProductVM.priceProduct.price.priceList = _.map(this._singlePriceVMList, (singlePriceVM: SinglePriceVM) => {
			return singlePriceVM.singlePrice;
		});
	}
}