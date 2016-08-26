import {BaseDO} from '../../../../../../common/base/BaseDO';
import {ThTranslation} from '../../../../../../common/utils/localization/ThTranslation';
import {AddOnProductSnapshotDO} from './../../../add-on-products/data-objects/AddOnProductSnapshotDO';
import {IAttachedAddOnProductItemStrategy, AttachedAddOnProductItemStrategyType} from './IAttachedAddOnProductItemStrategy';
import {AttachedAddOnProductItemFactory} from './AttachedAddOnProductItemFactory';

export class AttachedAddOnProductItemDO extends BaseDO implements IAttachedAddOnProductItemStrategy {
    addOnProductSnapshot: AddOnProductSnapshotDO;
    strategyType: AttachedAddOnProductItemStrategyType;
    strategy: IAttachedAddOnProductItemStrategy;

    protected getPrimitivePropertyKeys(): string[] {
        return ["strategyType"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.addOnProductSnapshot = new AddOnProductSnapshotDO();
        this.addOnProductSnapshot.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "addOnProductSnapshot"));

        var factory = new AttachedAddOnProductItemFactory();
        this.strategy = factory.getStrategyByType(this.strategyType);
        this.strategy.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "strategy"));
    }

    public getValueDisplayString(thTranslation: ThTranslation): string {
        return this.strategy.getValueDisplayString(thTranslation);
    }
    public getStrategyType(): AttachedAddOnProductItemStrategyType {
        return this.strategy.getStrategyType();
    }
    public equals(otherStrategy: IAttachedAddOnProductItemStrategy): boolean {
        return this.strategy.equals(otherStrategy);
    }
}