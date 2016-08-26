import {IAttachedAddOnProductItemStrategy, AttachedAddOnProductItemStrategyType} from './IAttachedAddOnProductItemStrategy';
import {OneItemPerDayAttachedAddOnProductItemStrategyDO} from './strategies/OneItemPerDayAttachedAddOnProductItemStrategyDO';
import {OneItemPerDayForEachAdultOrChildAttachedAddOnProductItemStrategyDO} from './strategies/OneItemPerDayForEachAdultOrChildAttachedAddOnProductItemStrategyDO';
import {FixedNumberAttachedAddOnProductItemStrategyDO} from './strategies/FixedNumberAttachedAddOnProductItemStrategyDO';

export class AttachedAddOnProductItemFactory {
    public getStrategyByType(strategyType: AttachedAddOnProductItemStrategyType): IAttachedAddOnProductItemStrategy {
        switch (strategyType) {
            case AttachedAddOnProductItemStrategyType.OneItemPerDay:
                return new OneItemPerDayAttachedAddOnProductItemStrategyDO();
            case AttachedAddOnProductItemStrategyType.OneItemPerDayForEachAdultOrChild:
                return new OneItemPerDayForEachAdultOrChildAttachedAddOnProductItemStrategyDO();
            case AttachedAddOnProductItemStrategyType.FixedNumber:
                return new FixedNumberAttachedAddOnProductItemStrategyDO();
        }
    }
}