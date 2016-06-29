import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {ABusinessValidationRule} from '../../../../common/validation-rules/ABusinessValidationRule';
import {IBusinessValidationRuleFilter} from '../../../../common/validation-rule-filters/IBusinessValidationRuleFilter';
import {ThDateIntervalDO} from '../../../../../utils/th-dates/data-objects/ThDateIntervalDO';
import {AllotmentDO} from '../../../../../data-layer/allotments/data-objects/AllotmentDO';

import _ = require('underscore');

export interface AllotmentOpenIntervalParams {
    bookingInterval: ThDateIntervalDO;
}

export class AllotmentOpenIntervalValidationRule extends ABusinessValidationRule<AllotmentDO> implements IBusinessValidationRuleFilter<AllotmentDO> {

    constructor(private _constraintParams: AllotmentOpenIntervalParams) {
        super({
            statusCode: ThStatusCode.BookingValidationError,
            errorMessage: "error validating booking"
        });
    }

    protected isValidOnCore(resolve: { (result: AllotmentDO): void }, reject: { (err: ThError): void }, businessObject: AllotmentDO) {
        var allotment = businessObject;
        var validOpenInterval: boolean = this.allotmentHasValidOpenInterval(allotment);
        if (!validOpenInterval) {
            this.logBusinessAndReject(reject, allotment, {
                statusCode: ThStatusCode.BookingsValidatorAllotmentOpenIntervalMismatch,
                errorMessage: "allotment interval mismatch"
            });
            return;
        }
        resolve(allotment);
    }

    public filterSync(businessObjectList: AllotmentDO[]): AllotmentDO[] {
        return _.filter(businessObjectList, (allotment: AllotmentDO) => {
            return this.allotmentHasValidOpenInterval(allotment);
        });
    }

    private allotmentHasValidOpenInterval(allotment: AllotmentDO): boolean {
        var bookingInterval = this._constraintParams.bookingInterval;
        if (allotment.openInterval.start.isAfter(bookingInterval.start) || allotment.openInterval.end.isBefore(bookingInterval.end)) {
            return false;
        }
        return true;
    }
}