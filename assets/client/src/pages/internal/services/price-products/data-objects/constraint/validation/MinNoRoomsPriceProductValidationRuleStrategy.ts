import {ThTranslation} from '../../../../../../../common/utils/localization/ThTranslation';
import {RoomCategoryDO} from '../../../../room-categories/data-objects/RoomCategoryDO';
import {IPriceProductValidationRule, PriceProductValidationRuleResult, PriceProductValidationRuleDataDO} from './IPriceProductValidationRule';

import * as _ from "underscore";

export class MinNoRoomsPriceProductValidationRuleStrategy implements IPriceProductValidationRule {
    constructor(private _noOfRooms: number) {
    }

    public appliesOn(data: PriceProductValidationRuleDataDO): PriceProductValidationRuleResult {
        var valid = this._noOfRooms <= data.indexedNumberOfRoomCategories.getNoOfOccurenciesForElementList(data.roomCategoryIdListFromPriceProduct);
        if (valid) {
            return {
                valid: true
            };
        }
        return {
            valid: false,
            errorMessage: data.thTranslation.translate("Add at least %noRooms% rooms: %roomCategories%", { noRooms: this._noOfRooms, roomCategories: this.getRoomCategoriesString(data) })
        }
    }

    private getRoomCategoriesString(data: PriceProductValidationRuleDataDO): string {
        var roomCategString: string = "";
        _.forEach(data.roomCategoryIdListFromPriceProduct, (roomCategoryId: string) => {
            var roomCategory: RoomCategoryDO = _.find(data.roomCategoryList, (roomCateg: RoomCategoryDO) => {
                return roomCateg.id === roomCategoryId;
            });
            if (roomCategory) {
                if (roomCategString.length > 0) {
                    roomCategString += "/";
                }
                roomCategString += roomCategory.displayName;
            }
        });
        return roomCategString;
    }
}