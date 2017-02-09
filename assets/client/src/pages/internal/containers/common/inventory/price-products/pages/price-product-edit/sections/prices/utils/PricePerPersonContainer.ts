import {PricePerPersonVM} from './view-models/PricePerPersonVM';
import {RoomCategoryStatsDO} from '../../../../../../../../../services/room-categories/data-objects/RoomCategoryStatsDO';
import {RoomCategoryDO} from '../../../../../../../../../services/room-categories/data-objects/RoomCategoryDO';
import {PricePerPersonDO} from '../../../../../../../../../services/price-products/data-objects/price/price-per-person/PricePerPersonDO';
import {PriceForFixedNumberOfPersonsDO} from '../../../../../../../../../services/price-products/data-objects/price/price-per-person/PriceForFixedNumberOfPersonsDO';
import {PriceProductPriceType, IPriceProductPrice} from '../../../../../../../../../services/price-products/data-objects/price/IPriceProductPrice';
import {PriceProductVM} from '../../../../../../../../../services/price-products/view-models/PriceProductVM';
import {IPriceContainer} from './IPriceContainer';

export class PricePerPersonContainer implements IPriceContainer {
	private _pricePerPersonVMList: PricePerPersonVM[];

	constructor() {
		this._pricePerPersonVMList = [];
	}

	public get pricePerPersonVMList(): PricePerPersonVM[] {
		return this._pricePerPersonVMList;
	}
	public set pricePerPersonVMList(pricePerPersonVMList: PricePerPersonVM[]) {
		this._pricePerPersonVMList = pricePerPersonVMList;
	}

	public initializeFrom(priceType: PriceProductPriceType, priceList: IPriceProductPrice[]) {
		if(priceType !== PriceProductPriceType.PricePerPerson) {
			this.resetValues();
			return;
		}
		var pricePerPersonDOList: PricePerPersonDO[] = <PricePerPersonDO[]> priceList;
		
		
		var newPricePerPersonVMList: PricePerPersonVM[] = [];
		_.forEach(pricePerPersonDOList, (pricePerPersonDO: PricePerPersonDO) => {
			var pricePerPersonVM = new PricePerPersonVM();
			pricePerPersonVM.roomCategoryStats = new RoomCategoryStatsDO();
			pricePerPersonVM.roomCategoryStats.roomCategory = new RoomCategoryDO();
			pricePerPersonVM.roomCategoryStats.roomCategory.id = pricePerPersonDO.roomCategoryId;
			pricePerPersonVM.pricePerPerson = pricePerPersonDO;
			newPricePerPersonVMList.push(pricePerPersonVM);
		});
		this._pricePerPersonVMList = newPricePerPersonVMList;
	}
	private resetValues() {
		this._pricePerPersonVMList = [];
	}

	public updateFromRoomCategoryStatsList(roomCategoryStatsList: RoomCategoryStatsDO[]) {
		var newPricePerPersonVMList: PricePerPersonVM[] = [];
		var previousRoomCategoryId: string;
		_.forEach(roomCategoryStatsList, (roomCategoryStats: RoomCategoryStatsDO) => {
			var currentPricePerPersonDO = this.getCurrentPricePerPersonDOForRoomCategoryId(roomCategoryStats.roomCategory.id);
			var newPricePerPersonVM = new PricePerPersonVM();
			newPricePerPersonVM.roomCategoryStats = roomCategoryStats;
			newPricePerPersonVM.pricePerPerson = currentPricePerPersonDO.prototypeForStats(roomCategoryStats);
			if (previousRoomCategoryId) {
				newPricePerPersonVM.previousRoomCategoryId = previousRoomCategoryId;
			}
			newPricePerPersonVMList.push(newPricePerPersonVM);
			previousRoomCategoryId = roomCategoryStats.roomCategory.id;
		});
		this._pricePerPersonVMList = newPricePerPersonVMList;
	}

	private getCurrentPricePerPersonDOForRoomCategoryId(roomCategoryId: string): PricePerPersonDO {
		var currentPricePerPersonVM = this.getPricePerPersonVMForRoomCategoryId(roomCategoryId);
		if (!currentPricePerPersonVM) {
			return new PricePerPersonDO();
		}
		return currentPricePerPersonVM.pricePerPerson;
	}
	private getPricePerPersonVMForRoomCategoryId(roomCategoryId: string): PricePerPersonVM {
		return _.find(this._pricePerPersonVMList, (priceVM: PricePerPersonVM) => { return priceVM.pricePerPerson.roomCategoryId === roomCategoryId });
	}

	public copyPrices(sourceRoomCategoryId: string, destinationRoomCategoryId: string) {
		var sourcePricePerPersonVM = this.getPricePerPersonVMForRoomCategoryId(sourceRoomCategoryId);
		var destPricePerPersonVM = this.getPricePerPersonVMForRoomCategoryId(destinationRoomCategoryId);
		if (!sourcePricePerPersonVM || !destPricePerPersonVM) {
			return;
		}
		var sourcePricePerPersonDO = sourcePricePerPersonVM.pricePerPerson;
		var destPricePerPersonDO = destPricePerPersonVM.pricePerPerson;
		destPricePerPersonDO.adultsPriceList.forEach((destAdultPrice: PriceForFixedNumberOfPersonsDO) => {
			var priceForFixedNoOfPersons = sourcePricePerPersonDO.getPriceForNumberOfAdults(destAdultPrice.noOfPersons);
			if (priceForFixedNoOfPersons) {
				destAdultPrice.price = priceForFixedNoOfPersons.price;
			}
		});
		destPricePerPersonDO.firstChildWithoutAdultPrice = sourcePricePerPersonDO.firstChildWithoutAdultPrice;
		destPricePerPersonDO.firstChildWithAdultInSharedBedPrice = sourcePricePerPersonDO.firstChildWithAdultInSharedBedPrice;
		destPricePerPersonDO.childrenPriceList.forEach((destChildPrice: PriceForFixedNumberOfPersonsDO) => {
			var priceForFixedNoOfPersons = sourcePricePerPersonDO.getPriceForNumberOfChildren(destChildPrice.noOfPersons);
			if (priceForFixedNoOfPersons) {
				destChildPrice.price = priceForFixedNoOfPersons.price;
			}
		});
	}
	
	public isValid(): boolean {
		var valid = true;
		_.forEach(this._pricePerPersonVMList, (pricePerPersonVM: PricePerPersonVM) => {
			if(!pricePerPersonVM.pricePerPerson.isValid()) {
				valid = false;
			}
		});
		return valid;
	}
	public updatePricesOn(priceProductVM: PriceProductVM) {
		priceProductVM.priceProduct.price.type = PriceProductPriceType.PricePerPerson;
		priceProductVM.priceProduct.price.priceList = _.map(this._pricePerPersonVMList, (pricePerPersonVM: PricePerPersonVM) => {
			return pricePerPersonVM.pricePerPerson;
		});
	}
}