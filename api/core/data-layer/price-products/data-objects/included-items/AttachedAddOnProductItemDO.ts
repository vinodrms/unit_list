import {BaseDO} from '../../../common/base/BaseDO';
import {AddOnProductSnapshotDO} from './../../../add-on-products/data-objects/AddOnProductSnapshotDO';
import {IAttachedAddOnProductItemStrategy, AttachedAddOnProductItemStrategyQueryDO, AttachedAddOnProductItemStrategyType} from './IAttachedAddOnProductItemStrategy';
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

    public getNumberOfItems(query: AttachedAddOnProductItemStrategyQueryDO): number {
        return this.strategy.getNumberOfItems(query);
    }
    public isValid(): boolean {
        return this.strategy.isValid();
    }
}