import {BaseDO} from '../../../common/base/BaseDO';
import {PriceProductPriceType, PriceProductPriceQueryDO, IPriceProductPrice} from './IPriceProductPrice';
import {PricePerRoomCategoryDO} from './price-per-room-category/PricePerRoomCategoryDO';
import {PricePerPersonDO} from './price-per-person/PricePerPersonDO';
import {RoomCategoryStatsDO} from '../../../room-categories/data-objects/RoomCategoryStatsDO';

export class PriceProductPriceDO extends BaseDO implements IPriceProductPrice {
	type: PriceProductPriceType;
	priceConfiguration: IPriceProductPrice;

	protected getPrimitivePropertyKeys(): string[] {
		return ["type"];
	}

	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		switch (this.type) {
			case PriceProductPriceType.PricePerRoomCategory:
				this.priceConfiguration = new PricePerRoomCategoryDO();
				break;
			case PriceProductPriceType.PricePerPerson:
				this.priceConfiguration = new PricePerPersonDO();
				break;
		}
		this.priceConfiguration.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "priceConfiguration"));
	}
	public getPriceFor(query: PriceProductPriceQueryDO): number {
		return this.priceConfiguration.getPriceFor(query);
	}
	public priceConfigurationIsValidFor(roomCategoryStatList: RoomCategoryStatsDO[]): boolean {
		return this.priceConfiguration.priceConfigurationIsValidFor(roomCategoryStatList);
	}
}