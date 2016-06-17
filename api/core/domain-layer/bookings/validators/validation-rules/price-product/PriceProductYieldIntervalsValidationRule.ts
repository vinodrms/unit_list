import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {ABusinessValidationRule} from '../../../../common/validation-rules/ABusinessValidationRule';
import {IBusinessValidationRuleFilter} from '../../../../common/validation-rule-filters/IBusinessValidationRuleFilter';
import {PriceProductDO} from '../../../../../data-layer/price-products/data-objects/PriceProductDO';
import {ThDateIntervalDO} from '../../../../../utils/th-dates/data-objects/ThDateIntervalDO';
import {YieldIntervalsValidator} from '../../../../yield-manager/validators/YieldIntervalsValidator';

import _ = require('underscore');

export class PriceProductYieldIntervalsValidationRule extends ABusinessValidationRule<PriceProductDO> implements IBusinessValidationRuleFilter<PriceProductDO> {
    constructor(private _bookingInterval: ThDateIntervalDO) {
        super({
            statusCode: ThStatusCode.BookingValidationError,
            errorMessage: "error validating booking"
        });
    }
    protected isValidOnCore(resolve: { (result: PriceProductDO): void }, reject: { (err: ThError): void }, businessObject: PriceProductDO) {
        var priceProduct = businessObject;
        if (!this.priceProductIsOpenOnAllYieldAttributes(priceProduct)) {
            this.logBusinessAndReject(reject, priceProduct, {
                statusCode: ThStatusCode.BookingsValidatorYieldingClosed,
                errorMessage: "invalid yielding for period"
            });
            return;
        }
        resolve(priceProduct);
    }

    public filterSync(businessObjectList: PriceProductDO[]): PriceProductDO[] {
        return _.filter(businessObjectList, (priceProduct: PriceProductDO) => {
            return this.priceProductIsOpenOnAllYieldAttributes(priceProduct);
        });
    }

    private priceProductIsOpenOnAllYieldAttributes(priceProduct: PriceProductDO): boolean {
        var yieldValidator = new YieldIntervalsValidator(priceProduct, this._bookingInterval);
        return yieldValidator.isOpenOnAllYieldAttributes();
    }
}