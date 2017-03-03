import { BaseDO } from '../../../../../../../common/base/BaseDO';
import { IPriceProductPrice } from '../IPriceProductPrice';
import { PriceForFixedNumberOfPersonsDO } from './PriceForFixedNumberOfPersonsDO';
import { RoomCategoryStatsDO } from '../../../../room-categories/data-objects/RoomCategoryStatsDO';
import { ThDataValidators } from '../../../../../../../common/utils/form-utils/utils/ThDataValidators';

export class PricePerPersonDO extends BaseDO implements IPriceProductPrice {
	adultsPriceList: PriceForFixedNumberOfPersonsDO[];
	childrenPriceList: PriceForFixedNumberOfPersonsDO[];
	firstChildWithoutAdultPrice: number;
	firstChildWithAdultInSharedBedPrice: number;
	roomCategoryId: string;

	constructor() {
		super();
		this.adultsPriceList = [];
		this.childrenPriceList = [];
	}

	protected getPrimitivePropertyKeys(): string[] {
		return ["firstChildWithoutAdultPrice", "firstChildWithAdultInSharedBedPrice", "roomCategoryId"];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.adultsPriceList = this.buildPriceList(object, "adultsPriceList");
		this.childrenPriceList = this.buildPriceList(object, "childrenPriceList");
	}
	private buildPriceList(object: Object, objectKey: string): PriceForFixedNumberOfPersonsDO[] {
		var priceList: PriceForFixedNumberOfPersonsDO[] = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, objectKey), (priceObject: Object) => {
			var priceDO = new PriceForFixedNumberOfPersonsDO();
			priceDO.buildFromObject(priceObject);
			priceList.push(priceDO);
		});
		return priceList;
	}
	public getPriceForNumberOfAdults(noOfPersons: number): PriceForFixedNumberOfPersonsDO {
		return _.find(this.adultsPriceList, (price: PriceForFixedNumberOfPersonsDO) => { return price.noOfPersons === noOfPersons });
	}
	public getPriceForNumberOfChildren(noOfPersons: number): PriceForFixedNumberOfPersonsDO {
		return _.find(this.childrenPriceList, (price: PriceForFixedNumberOfPersonsDO) => { return price.noOfPersons === noOfPersons });
	}

	public prototypeForStats(roomCategoryStats: RoomCategoryStatsDO): PricePerPersonDO {
		var newPricePerPerson: PricePerPersonDO = new PricePerPersonDO();
		newPricePerPerson.roomCategoryId = roomCategoryStats.roomCategory.id;

		for (var noOfAdults = 1; noOfAdults <= roomCategoryStats.capacity.totalCapacity.noAdults; noOfAdults++) {
			var prevAdultsPrice = this.getPriceForNumberOfAdults(noOfAdults);
			if (prevAdultsPrice) {
				newPricePerPerson.adultsPriceList.push(prevAdultsPrice);
			}
			else {
				newPricePerPerson.adultsPriceList.push(new PriceForFixedNumberOfPersonsDO(noOfAdults));
			}
		}
		newPricePerPerson.firstChildWithoutAdultPrice = _.isNumber(this.firstChildWithoutAdultPrice) ? this.firstChildWithoutAdultPrice : 0;
		newPricePerPerson.firstChildWithAdultInSharedBedPrice = _.isNumber(this.firstChildWithAdultInSharedBedPrice) ? this.firstChildWithAdultInSharedBedPrice : 0;
		for (var noOfChildren = 1; noOfChildren <= (roomCategoryStats.capacity.totalCapacity.noAdults + roomCategoryStats.capacity.totalCapacity.noChildren); noOfChildren++) {
			var prevChildrenPrice = this.getPriceForNumberOfChildren(noOfChildren);
			if (prevChildrenPrice) {
				newPricePerPerson.childrenPriceList.push(prevChildrenPrice);
			}
			else {
				var newPrice = new PriceForFixedNumberOfPersonsDO(noOfChildren);
				newPrice.price = 0.0;
				newPricePerPerson.childrenPriceList.push(newPrice);
			}
		}
		return newPricePerPerson;
	}
	public isValid(): boolean {
		return this.priceListIsValid(this.adultsPriceList) && this.priceListIsValid(this.childrenPriceList)
			&& this.firstChildWithoutAdultPriceIsValid() && this.firstChildWithAdultInSharedBedPriceIsValid();
	}
	public firstChildWithoutAdultPriceIsValid(): boolean {
		return ThDataValidators.isValidPrice(this.firstChildWithoutAdultPrice);
	}
	public firstChildWithAdultInSharedBedPriceIsValid(): boolean {
		return ThDataValidators.isValidPrice(this.firstChildWithAdultInSharedBedPrice);
	}
	private priceListIsValid(priceForNoOfPersList: PriceForFixedNumberOfPersonsDO[]): boolean {
		var valid = true;
		_.forEach(priceForNoOfPersList, (priceForNoOfPers: PriceForFixedNumberOfPersonsDO) => {
			if (!priceForNoOfPers.isValid()) {
				valid = false;
			}
		});
		return valid;
	}

	public getPriceBriefValue(): number {
		var priceForOneAdult = this.getPriceForNumberOfAdults(1);
		if (!priceForOneAdult) {
			return 0.0;
		}
		return priceForOneAdult.price;
	}
	public getPriceBriefLineString(): string {
		var priceStr = "";
		this.adultsPriceList.forEach(price => {
			priceStr += (priceStr.length > 0 ? " / " : "") + price.price;
		});
		return priceStr;
	}
	public getRoomCategoryId(): string {
		return this.roomCategoryId;
	}
	public copyPricesFrom(otherPrice: PricePerPersonDO) {
		this.adultsPriceList.forEach((destAdultPrice: PriceForFixedNumberOfPersonsDO) => {
			var priceForFixedNoOfPersons = otherPrice.getPriceForNumberOfAdults(destAdultPrice.noOfPersons);
			if (priceForFixedNoOfPersons) {
				destAdultPrice.price = priceForFixedNoOfPersons.price;
			}
		});
		this.firstChildWithoutAdultPrice = otherPrice.firstChildWithoutAdultPrice;
		this.firstChildWithAdultInSharedBedPrice = otherPrice.firstChildWithAdultInSharedBedPrice;
		this.childrenPriceList.forEach((destChildPrice: PriceForFixedNumberOfPersonsDO) => {
			var priceForFixedNoOfPersons = otherPrice.getPriceForNumberOfChildren(destChildPrice.noOfPersons);
			if (priceForFixedNoOfPersons) {
				destChildPrice.price = priceForFixedNoOfPersons.price;
			}
		});
	}
}