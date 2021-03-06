import {BaseDO} from '../../../../../../common/base/BaseDO';
import {AllotmentConstraintType, IAllotmentConstraint} from './IAllotmentConstraint';
import {AllotmentConstraintDO} from './AllotmentConstraintDO';
import {ThTranslation} from '../../../../../../common/utils/localization/ThTranslation';

import _ = require("underscore");

export class AllotmentConstraintWrapperDO extends BaseDO implements IAllotmentConstraint {
	constraintList: AllotmentConstraintDO[];

	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}

	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.constraintList = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "constraintList"), (constraintObject: Object) => {
			var constraintDO = new AllotmentConstraintDO();
			constraintDO.buildFromObject(constraintObject);
			this.constraintList.push(constraintDO);
		});
	}
	public isValid(): boolean {
		var isValid = true;
		_.forEach(this.constraintList, (constraint: AllotmentConstraintDO) => {
			if (!constraint.isValid()) {
				isValid = false;
			}
		});
		return isValid;
	}
	public getValueDisplayString(thTranslation: ThTranslation): string {
		return "";
	}
	public getBriefValueDisplayString(thTranslation: ThTranslation): string {
		var briefValue = "";
		_.forEach(this.constraintList, (constraint: AllotmentConstraintDO) => {
			if (briefValue.length > 0) { briefValue = briefValue + ", "; };
			briefValue = briefValue + constraint.getBriefValueDisplayString(thTranslation);
		});
		if (briefValue.length == 0) { briefValue = "n/a"; };
		return briefValue;
	}
}