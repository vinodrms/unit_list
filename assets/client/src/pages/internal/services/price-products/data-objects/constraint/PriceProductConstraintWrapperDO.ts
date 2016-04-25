import {BaseDO} from '../../../../../../common/base/BaseDO';
import {IPriceProductConstraint} from './IPriceProductConstraint';
import {PriceProductConstraintDO} from './PriceProductConstraintDO';
import {ThTranslation} from '../../../../../../common/utils/localization/ThTranslation';

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
	
	public isValid(): boolean {
		var isValid = true;
		_.forEach(this.constraintList, (constraint: PriceProductConstraintDO) => {
			if(!constraint.isValid()) {
				isValid = false;
			}
		});
		return isValid;
	}
	public getValueDisplayString(thTranslation: ThTranslation): string {
		return "";
	}
}