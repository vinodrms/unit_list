import {BaseDO} from '../../../../../../common/base/BaseDO';
import {RoomCategoryStatsDO} from '../../../room-categories/data-objects/RoomCategoryStatsDO';

export enum PriceProductPriceType {
	SinglePrice,
	PricePerPerson
}

export enum PriceProductPriceConfigurationState {
	Valid,
	MissingPrices
}

export interface IPriceProductPrice extends BaseDO {
}