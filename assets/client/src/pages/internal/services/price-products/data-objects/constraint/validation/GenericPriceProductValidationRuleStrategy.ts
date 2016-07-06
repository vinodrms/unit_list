import {IPriceProductValidationRule, PriceProductValidationRuleResult, PriceProductValidationRuleDataDO} from './IPriceProductValidationRule';

export class GenericPriceProductValidationRuleStrategy implements IPriceProductValidationRule {
    appliesOn(data: PriceProductValidationRuleDataDO): PriceProductValidationRuleResult {
        return {
            valid: true
        };
    }
}