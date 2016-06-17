import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {ABusinessValidationRule} from '../../../../common/validation-rules/ABusinessValidationRule';
import {IBusinessValidationRuleFilter} from '../../../../common/validation-rule-filters/IBusinessValidationRuleFilter';
import {ThDateDO} from '../../../../../utils/th-dates/data-objects/ThDateDO';
import {ThDateIntervalDO} from '../../../../../utils/th-dates/data-objects/ThDateIntervalDO';
import {IndexedBookingInterval} from '../../../../../data-layer/price-products/utils/IndexedBookingInterval';
import {AllotmentConstraintDataDO} from '../../../../../data-layer/allotments/data-objects/constraint/IAllotmentConstraint';
import {AllotmentDO} from '../../../../../data-layer/allotments/data-objects/AllotmentDO';

import _ = require('underscore');

export interface AllotmentConstraintsParams {
    bookingInterval: ThDateIntervalDO;
    currentHotelThDate: ThDateDO;
}

export class AllotmentConstraintsValidationRule extends ABusinessValidationRule<AllotmentDO> implements IBusinessValidationRuleFilter<AllotmentDO> {
    private _indexedBookingInterval: IndexedBookingInterval;

    constructor(private _constraintParams: AllotmentConstraintsParams) {
        super({
            statusCode: ThStatusCode.BookingValidationError,
            errorMessage: "error validating booking"
        });
        this.buildConstraintsParams();
    }
    private buildConstraintsParams() {
        this._indexedBookingInterval = new IndexedBookingInterval(this._constraintParams.bookingInterval);
    }

    protected isValidOnCore(resolve: { (result: AllotmentDO): void }, reject: { (err: ThError): void }, businessObject: AllotmentDO) {
        var allotment = businessObject;
        var validConstraints: boolean = this.allotmentHasValidConstraints(allotment);
        if (!validConstraints) {
            this.logBusinessAndReject(reject, allotment, {
                statusCode: ThStatusCode.BookingsValidatorAllotmentConstraintsDoNotApply,
                errorMessage: "allotment constraints do not apply"
            });
            return;
        }
        resolve(allotment);
    }

    public filterSync(businessObjectList: AllotmentDO[]): AllotmentDO[] {
        return _.filter(businessObjectList, (allotment: AllotmentDO) => {
            return this.allotmentHasValidConstraints(allotment);
        });
    }

    private allotmentHasValidConstraints(allotment: AllotmentDO): boolean {
        var allotmentConstraintDataDO: AllotmentConstraintDataDO = {
            indexedBookingInterval: this._indexedBookingInterval,
            currentHotelThDate: this._constraintParams.currentHotelThDate
        };
        return allotment.constraints.appliesOn(allotmentConstraintDataDO);
    }
}