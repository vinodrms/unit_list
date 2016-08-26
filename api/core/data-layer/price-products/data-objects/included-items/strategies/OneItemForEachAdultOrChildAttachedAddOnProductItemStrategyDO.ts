import {BaseDO} from '../../../../common/base/BaseDO';
import {IAttachedAddOnProductItemStrategy, AttachedAddOnProductItemStrategyQueryDO} from '../IAttachedAddOnProductItemStrategy';

export class OneItemForEachAdultOrChildAttachedAddOnProductItemStrategyDO extends BaseDO implements IAttachedAddOnProductItemStrategy {
    protected getPrimitivePropertyKeys(): string[] {
        return [];
    }

    public getNumberOfItems(query: AttachedAddOnProductItemStrategyQueryDO): number {
        return query.configCapacity.noAdults + query.configCapacity.noChildren;
    }
    public isValid(): boolean {
        return true;
    }
}