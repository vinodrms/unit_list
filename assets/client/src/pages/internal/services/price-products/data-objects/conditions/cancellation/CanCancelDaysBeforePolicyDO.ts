import {BaseDO} from '../../../../../../../common/base/BaseDO';
import {IPriceProductCancellationPolicy, CancellationPolicyDescription} from './IPriceProductCancellationPolicy';
import {ThDataValidators} from '../../../../../../../common/utils/form-utils/utils/ThDataValidators';

import * as _ from "underscore";

export class CanCancelDaysBeforePolicyDO extends BaseDO implements IPriceProductCancellationPolicy {
	daysBefore: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["daysBefore"];
	}
	public getDescription(): CancellationPolicyDescription {
		return {
			phrase: "Can cancel until %daysBefore% days prior to arrival",
			parameters: {
				daysBefore: this.daysBefore
			}
		}
	}
	public hasCancellationPolicy(): boolean {
		return true;
	}
	public isValid(): boolean {
		if (_.isNumber(this.daysBefore) && this.daysBefore >= 0 && ThDataValidators.isValidInteger(this.daysBefore)) {
			return true;
		}
		return false;
	}
}