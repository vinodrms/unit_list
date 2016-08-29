import {IAttachedAddOnProductItemStrategy, AttachedAddOnProductItemStrategyType} from './IAttachedAddOnProductItemStrategy';
import {OneItemPerDayAttachedAddOnProductItemStrategyDO} from './strategies/OneItemPerDayAttachedAddOnProductItemStrategyDO';
import {OneItemPerDayForEachAdultOrChildAttachedAddOnProductItemStrategyDO} from './strategies/OneItemPerDayForEachAdultOrChildAttachedAddOnProductItemStrategyDO';
import {FixedNumberAttachedAddOnProductItemStrategyDO} from './strategies/FixedNumberAttachedAddOnProductItemStrategyDO';
import {OneItemForEachAdultOrChildAttachedAddOnProductItemStrategyDO} from './strategies/OneItemForEachAdultOrChildAttachedAddOnProductItemStrategyDO';

export class AttachedAddOnProductItemFactory {
    public static MaxFixedNoItems = 20;

    public getStrategyByType(strategyType: AttachedAddOnProductItemStrategyType): IAttachedAddOnProductItemStrategy {
        switch (strategyType) {
            case AttachedAddOnProductItemStrategyType.OneItemPerDay:
                return new OneItemPerDayAttachedAddOnProductItemStrategyDO();
            case AttachedAddOnProductItemStrategyType.OneItemForEachAdultOrChild:
                return new OneItemForEachAdultOrChildAttachedAddOnProductItemStrategyDO();
            case AttachedAddOnProductItemStrategyType.OneItemPerDayForEachAdultOrChild:
                return new OneItemPerDayForEachAdultOrChildAttachedAddOnProductItemStrategyDO();
            case AttachedAddOnProductItemStrategyType.FixedNumber:
                return new FixedNumberAttachedAddOnProductItemStrategyDO();
        }
    }
    public getDefaultStrategy(): IAttachedAddOnProductItemStrategy {
        return this.getStrategyByType(AttachedAddOnProductItemStrategyType.OneItemPerDay);
    }
    public getStrategyList(): IAttachedAddOnProductItemStrategy[] {
        var strategyList: IAttachedAddOnProductItemStrategy[] = [
            new OneItemPerDayAttachedAddOnProductItemStrategyDO(),
            new OneItemForEachAdultOrChildAttachedAddOnProductItemStrategyDO(),
            new OneItemPerDayForEachAdultOrChildAttachedAddOnProductItemStrategyDO()
        ];
        var fixedNoStrategyList = this.getFixedNumberStrategyList();
        strategyList = strategyList.concat(fixedNoStrategyList);
        return strategyList;
    }
    private getFixedNumberStrategyList(): IAttachedAddOnProductItemStrategy[] {
        var fixedNoStrategyList: IAttachedAddOnProductItemStrategy[] = [];
        for (var noItems = 1; noItems <= AttachedAddOnProductItemFactory.MaxFixedNoItems; noItems++) {
            var fixedNoStrategy = new FixedNumberAttachedAddOnProductItemStrategyDO();
            fixedNoStrategy.noOfItems = noItems;
            fixedNoStrategyList.push(fixedNoStrategy);
        }
        return fixedNoStrategyList;
    }
}