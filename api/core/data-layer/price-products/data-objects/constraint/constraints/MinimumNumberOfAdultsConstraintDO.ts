import {BaseDO} from '../../../../common/base/BaseDO';
import {PriceProductConstraintDataDO, IPriceProductConstraint} from '../IPriceProductConstraint';
import {ThTranslation} from '../../../../../utils/localization/ThTranslation';

export class MinimumNumberOfAdultsConstraintDO extends BaseDO implements IPriceProductConstraint {
    noOfAdults: number;

    protected getPrimitivePropertyKeys(): string[] {
        return ["noOfAdults"];
    }

    public appliesOn(data: PriceProductConstraintDataDO): boolean {
        return this.noOfAdults <= data.configCapacity.noAdults;
    }

    public getValueDisplayString(thTranslation: ThTranslation): string {
		return thTranslation.translate("Minimum %noOfAdults% adults", { noOfAdults: this.noOfAdults});
	}
}