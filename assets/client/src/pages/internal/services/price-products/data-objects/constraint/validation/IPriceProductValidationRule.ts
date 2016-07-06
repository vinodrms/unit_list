import {ThTranslation} from '../../../../../../../common/utils/localization/ThTranslation';
import {StringOccurenciesIndexer} from '../../../../../../../common/utils/indexers/StringOccurenciesIndexer';
import {RoomCategoryDO} from '../../../../room-categories/data-objects/RoomCategoryDO';

export interface PriceProductValidationRuleDataDO {
	thTranslation: ThTranslation;
	roomCategoryList: RoomCategoryDO[];

	indexedNumberOfRoomCategories: StringOccurenciesIndexer;
	roomCategoryIdListFromPriceProduct: string[];
}
export interface PriceProductValidationRuleResult {
	valid: boolean;
	errorMessage?: string;
}
export interface IPriceProductValidationRule {
	appliesOn(data: PriceProductValidationRuleDataDO): PriceProductValidationRuleResult;
}