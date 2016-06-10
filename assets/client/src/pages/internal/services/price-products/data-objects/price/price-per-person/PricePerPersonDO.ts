import {BaseDO} from '../../../../../../../common/base/BaseDO';
import {IPriceProductPrice} from '../IPriceProductPrice';
import {PriceForFixedNumberOfPersonsDO} from './PriceForFixedNumberOfPersonsDO';
import {RoomCategoryStatsDO} from '../../../../room-categories/data-objects/RoomCategoryStatsDO';
import {ThDataValidators} from '../../../../../../../common/utils/form-utils/utils/ThDataValidators';

export class PricePerPersonDO extends BaseDO implements IPriceProductPrice {
	adultsPriceList: PriceForFixedNumberOfPersonsDO[];
	childrenPriceList: PriceForFixedNumberOfPersonsDO[];
	firstChildWithoutAdultPrice: number;
	roomCategoryId: string;

	constructor() {
		super();
		this.adultsPriceList = [];
		this.childrenPriceList = [];
	}

	protected getPrimitivePropertyKeys(): string[] {
		return ["firstChildWithoutAdultPrice", "roomCategoryId"];
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

		for (var noOfAdults = 1; noOfAdults <= roomCategoryStats.capacity.totalCapacity.maxNoAdults; noOfAdults++) {
			var prevAdultsPrice = this.getPriceForNumberOfAdults(noOfAdults);
			if (prevAdultsPrice) {
				newPricePerPerson.adultsPriceList.push(prevAdultsPrice);
			}
			else {
				newPricePerPerson.adultsPriceList.push(new PriceForFixedNumberOfPersonsDO(noOfAdults));
			}
		}
		newPricePerPerson.firstChildWithoutAdultPrice = this.firstChildWithoutAdultPrice;
		for (var noOfChildren = 1; noOfChildren <= (roomCategoryStats.capacity.totalCapacity.maxNoAdults + roomCategoryStats.capacity.totalCapacity.maxNoChildren); noOfChildren++) {
			var prevChildrenPrice = this.getPriceForNumberOfChildren(noOfChildren);
			if (prevChildrenPrice) {
				newPricePerPerson.childrenPriceList.push(prevChildrenPrice);
			}
			else {
				newPricePerPerson.childrenPriceList.push(new PriceForFixedNumberOfPersonsDO(noOfChildren));
			}
		}
		return newPricePerPerson;
	}
	public isValid(): boolean {
		return this.priceListIsValid(this.adultsPriceList) && this.priceListIsValid(this.childrenPriceList) && this.firstChildWithoutAdultPriceIsValid();
	}
	public firstChildWithoutAdultPriceIsValid(): boolean {
		return ThDataValidators.isValidPrice(this.firstChildWithoutAdultPrice);
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

	getPriceBriefValue(): number {
		var priceForOneAdult = this.getPriceForNumberOfAdults(1);
		if(!priceForOneAdult) {
			return 0.0;
		}
		return priceForOneAdult.price;
	}
	getRoomCategoryId(): string {
		return this.roomCategoryId;
	}
}