import {BaseDO} from '../../../../../../../common/base/BaseDO';
import {IAttachedAddOnProductItemStrategy, AttachedAddOnProductItemStrategyType} from '../IAttachedAddOnProductItemStrategy';
import {ThTranslation} from '../../../../../../../common/utils/localization/ThTranslation';

export class OneItemPerDayAttachedAddOnProductItemStrategyDO extends BaseDO implements IAttachedAddOnProductItemStrategy {
    protected getPrimitivePropertyKeys(): string[] {
        return [];
    }

    public getValueDisplayString(thTranslation: ThTranslation): string {
        return thTranslation.translate("One item per day");
    }

    public getStrategyType(): AttachedAddOnProductItemStrategyType {
        return AttachedAddOnProductItemStrategyType.OneItemPerDay;
    }

    public equals(otherStrategy: IAttachedAddOnProductItemStrategy): boolean {
        return this.getStrategyType() === otherStrategy.getStrategyType();
    }
}