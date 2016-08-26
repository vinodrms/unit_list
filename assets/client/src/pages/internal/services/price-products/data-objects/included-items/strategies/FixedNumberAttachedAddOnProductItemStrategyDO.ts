import {BaseDO} from '../../../../../../../common/base/BaseDO';
import {IAttachedAddOnProductItemStrategy, AttachedAddOnProductItemStrategyType} from '../IAttachedAddOnProductItemStrategy';
import {ThTranslation} from '../../../../../../../common/utils/localization/ThTranslation';

export class FixedNumberAttachedAddOnProductItemStrategyDO extends BaseDO implements IAttachedAddOnProductItemStrategy {
    noOfItems: number;

    protected getPrimitivePropertyKeys(): string[] {
        return ["noOfItems"];
    }

    public getValueDisplayString(thTranslation: ThTranslation): string {
        if (this.noOfItems === 1) {
            return thTranslation.translate("1 item");
        }
        return thTranslation.translate("%noItems% items", { noItems: this.noOfItems });
    }

    public getStrategyType(): AttachedAddOnProductItemStrategyType {
        return AttachedAddOnProductItemStrategyType.FixedNumber;
    }
    public equals(otherStrategy: IAttachedAddOnProductItemStrategy): boolean {
        return this.getStrategyType() === otherStrategy.getStrategyType() && this.noOfItems === otherStrategy["noOfItems"];
    }
}