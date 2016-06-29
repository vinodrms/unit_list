import {BaseDO} from '../../../common/base/BaseDO';
import {IPriceProductConstraint, PriceProductConstraintDataDO} from './IPriceProductConstraint';
import {PriceProductConstraintDO} from './PriceProductConstraintDO';
import {ThTranslation} from '../../../../utils/localization/ThTranslation';

import _ = require('underscore');

export class PriceProductConstraintWrapperDO extends BaseDO implements IPriceProductConstraint {
	constraintList: PriceProductConstraintDO[];

	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}

	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.constraintList = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "constraintList"), (constraintObject: Object) => {
			var constraintDO = new PriceProductConstraintDO();
			constraintDO.buildFromObject(constraintObject);
			this.constraintList.push(constraintDO);
		});
	}

	public appliesOn(data: PriceProductConstraintDataDO): boolean {
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
		_.forEach(this.constraintList, (constraint: PriceProductConstraintDO) => {
			valueDisplayStringList.push(constraint.getValueDisplayString(thTranslation));
		});
		return valueDisplayStringList;
	}
}