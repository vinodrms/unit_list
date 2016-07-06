import {BaseDO} from '../../../../common/base/BaseDO';
import {ThTranslation} from '../../../../../utils/localization/ThTranslation';
import {PriceProductConstraintType, PriceProductConstraintDataDO, IPriceProductConstraint} from '../IPriceProductConstraint';
import {ConstraintUtils} from './utils/ConstraintUtils';

export class MinimumLengthOfStayConstraintDO extends BaseDO implements IPriceProductConstraint {
	lengthOfStay: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["lengthOfStay"];
	}

	public appliesOn(data: PriceProductConstraintDataDO): boolean {
		return this.lengthOfStay <= data.indexedBookingInterval.getLengthOfStay();
	}

	public getValueDisplayString(thTranslation: ThTranslation): string {
		return thTranslation.translate("Minimum %lengthOfStay% nights", { lengthOfStay: this.lengthOfStay});
	}
}