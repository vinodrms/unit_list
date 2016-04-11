import {BaseDO} from '../../../../../../common/base/BaseDO';
import {IPriceProductConstraint} from './IPriceProductConstraint';
import {PriceProductConstraintDO} from './PriceProductConstraintDO';

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
}