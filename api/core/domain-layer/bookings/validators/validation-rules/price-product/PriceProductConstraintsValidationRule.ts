import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {ABusinessValidationRule} from '../../../../common/validation-rules/ABusinessValidationRule';
import {IBusinessValidationRuleFilter} from '../../../../common/validation-rule-filters/IBusinessValidationRuleFilter';
import {ThUtils} from '../../../../../utils/ThUtils';
import {ThDateDO} from '../../../../../utils/th-dates/data-objects/ThDateDO';
import {ThDateIntervalDO} from '../../../../../utils/th-dates/data-objects/ThDateIntervalDO';
import {ConfigCapacityDO} from '../../../../../data-layer/common/data-objects/bed-config/ConfigCapacityDO';
import {PriceProductConstraintDataDO} from '../../../../../data-layer/price-products/data-objects/constraint/IPriceProductConstraint';
import {PriceProductDO} from '../../../../../data-layer/price-products/data-objects/PriceProductDO';
import {IndexedBookingInterval} from '../../../../../data-layer/price-products/utils/IndexedBookingInterval';
import {IndexedNumberOfRoomCategories} from '../../../../../data-layer/price-products/utils/IndexedNumberOfRoomCategories';

import _ = require('underscore');

export interface PriceProductConstraintsParams {
    bookingInterval: ThDateIntervalDO;
    currentHotelThDate: ThDateDO;
    configCapacity: ConfigCapacityDO;

    roomCategoryIdListFromBookings?: string[];
}

export class PriceProductConstraintsValidationRule extends ABusinessValidationRule<PriceProductDO> implements IBusinessValidationRuleFilter<PriceProductDO> {
    private _indexedNumberOfRoomCategories: IndexedNumberOfRoomCategories;
    private _indexedBookingInterval: IndexedBookingInterval;

    constructor(private _constraintParams: PriceProductConstraintsParams) {
        super({
            statusCode: ThStatusCode.BookingValidationError,
            errorMessage: "error validating booking"
        });
        this.buildConstraintsParams();
    }
    private buildConstraintsParams() {
        var thUtils = new ThUtils();
        if (!thUtils.isUndefinedOrNull(this._constraintParams.roomCategoryIdListFromBookings) && _.isArray(this._constraintParams.roomCategoryIdListFromBookings)) {
            this._indexedNumberOfRoomCategories = new IndexedNumberOfRoomCategories(this._constraintParams.roomCategoryIdListFromBookings);
        }
        this._indexedBookingInterval = new IndexedBookingInterval(this._constraintParams.bookingInterval);
    }

    protected isValidOnCore(resolve: { (result: PriceProductDO): void }, reject: { (err: ThError): void }, businessObject: PriceProductDO) {
        var priceProduct = businessObject;
        var validConstraints: boolean = this.priceProductHasValidConstraints(priceProduct);
        if (!validConstraints) {
            this.logBusinessAndReject(reject, priceProduct, {
                statusCode: ThStatusCode.BookingsValidatorConstraintsDoNotApply,
                errorMessage: "price product constraints do not apply"
            });
            return;
        }
        resolve(priceProduct);
    }

    public filterSync(businessObjectList: PriceProductDO[]): PriceProductDO[] {
        return _.filter(businessObjectList, (priceProduct: PriceProductDO) => {
            return this.priceProductHasValidConstraints(priceProduct);
        });
    }

    private priceProductHasValidConstraints(priceProduct: PriceProductDO): boolean {
        var priceProductConstraintDataDO = {
            indexedBookingInterval: this._indexedBookingInterval,
            currentHotelThDate: this._constraintParams.currentHotelThDate,
            configCapacity: this._constraintParams.configCapacity,
            indexedNumberOfRoomCategories: this._indexedNumberOfRoomCategories,
            roomCategoryIdListFromPriceProduct: priceProduct.roomCategoryIdList
        };
        return priceProduct.constraints.appliesOn(priceProductConstraintDataDO);
    }
}