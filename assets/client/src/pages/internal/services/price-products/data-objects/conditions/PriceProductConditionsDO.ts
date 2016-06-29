import {BaseDO} from '../../../../../../common/base/BaseDO';

import {ThTranslation} from '../../../../../../common/utils/localization/ThTranslation';
import {IPriceProductCancellationPolicy, PriceProductCancellationPolicyType} from './cancellation/IPriceProductCancellationPolicy';
import {NoCancellationPolicyDO} from './cancellation/NoCancellationPolicyDO';
import {PriceProductCancellationPolicyFactory} from './cancellation/PriceProductCancellationPolicyFactory';

import {IPriceProductCancellationPenalty, PriceProductCancellationPenaltyType} from './penalty/IPriceProductCancellationPenalty';
import {PriceProductCancellationPenaltyFactory} from './penalty/PriceProductCancellationPenaltyFactory';
import {NoCancellationPenaltyDO} from './penalty/NoCancellationPenaltyDO';

export class PriceProductConditionsDO extends BaseDO {
	policyType: PriceProductCancellationPolicyType;
	policy: IPriceProductCancellationPolicy;

	penaltyType: PriceProductCancellationPenaltyType;
	penalty: IPriceProductCancellationPenalty;

	protected getPrimitivePropertyKeys(): string[] {
		return ["policyType", "penaltyType"];
	}

	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		var cancellationPolicyFactory = new PriceProductCancellationPolicyFactory();
		this.policy = cancellationPolicyFactory.getCancellationPolicyByPolicyType(this.policyType);
		this.policy.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "policy"));

		var cancellationPenaltyFactory = new PriceProductCancellationPenaltyFactory();
		this.penalty = cancellationPenaltyFactory.getCancellationPenaltyByPenaltyType(this.penaltyType);
		this.penalty.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "penalty"));
	}

	public isValid(): boolean {
		if (!this.policy.hasCancellationPolicy()) {
			if (!this.penalty.hasCancellationPenalty()) {
				return true;
			}
			return false;
		}
		if (!this.penalty.hasCancellationPenalty()) {
			return false;
		}
		return this.policy.isValid() && this.penalty.isValid();
	}

	public prototypeConditions(): PriceProductConditionsDO {
		var conditions = new PriceProductConditionsDO();
		conditions.buildFromObject(this);
		return conditions;
	}

	public static buildDefault(): PriceProductConditionsDO {
		var conditions = new PriceProductConditionsDO();
		conditions.policyType = PriceProductCancellationPolicyType.NoPolicy;
		conditions.policy = new NoCancellationPolicyDO();
		conditions.penaltyType = PriceProductCancellationPenaltyType.NoPenalty;
		conditions.penalty = new NoCancellationPenaltyDO();
		return conditions;
	}

	public getCancellationConditionsString(thTranslation: ThTranslation): string {
		var policyDesc = this.policy.getDescription();
		var description = thTranslation.translate(policyDesc.phrase, policyDesc.parameters);
		var penaltyDesc = this.penalty.getDescription();
		description += " / " + thTranslation.translate(penaltyDesc.phrase, penaltyDesc.parameters);
		return description;
	}
}