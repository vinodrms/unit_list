import {BaseDO} from '../../common/base/BaseDO';

export enum PriceProductStatus {
	Draft,
	Active,
	Archived
}

export enum PriceProductAvailability {
	Public,
	Private
}

export enum PriceProductPriceType {
	SinglePrice,
	PricePerPerson
}

export class PriceProductDO extends BaseDO {
	id: string;
	hotelId: string;
	versionId: number;
	status: PriceProductStatus;
	name: string;
	availability: PriceProductAvailability;
	lastRoomAvailability: boolean;
	addOnProductIdList: string[];
	roomCategoryIdList: string[];
	taxIdList: string[];
	
	// TODO: finish 
	// openIntervalList, closedForArrivalIntervalList, closedForDepartureIntervalList
	
	priceType: PriceProductPriceType;
	
	
	
	protected getPrimitivePropertyKeys(): string[] {
		return ["id", "hotelId", "versionId"];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);
	}
}