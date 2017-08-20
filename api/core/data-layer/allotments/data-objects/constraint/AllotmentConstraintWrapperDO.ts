import {BaseDO} from '../../../common/base/BaseDO';
import {AllotmentConstraintType, IAllotmentConstraint, AllotmentConstraintDataDO} from './IAllotmentConstraint';
import {AllotmentConstraintDO} from './AllotmentConstraintDO';
import {ThTranslation} from '../../../../utils/localization/ThTranslation';

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

	public appliesOn(data: AllotmentConstraintDataDO): boolean {
		for (var index = 0; index < this.constraintList.length; index++) {
			var constraint = this.constraintList[index];
			if (!constraint.appliesOn(data)) {
				return false;
			}
		}
		return true;
	}

	public getValueDisplayString(thTranslation: ThTranslation): string {
		return "";
	}

	public getValueDisplayStringList(thTranslation: ThTranslation): string[] {
		var valueDisplayStringList: string[] = [];
		_.forEach(this.constraintList, (constraint: AllotmentConstraintDO) => {
			valueDisplayStringList.push(constraint.getValueDisplayString(thTranslation));
		});
		return valueDisplayStringList;
	}
}