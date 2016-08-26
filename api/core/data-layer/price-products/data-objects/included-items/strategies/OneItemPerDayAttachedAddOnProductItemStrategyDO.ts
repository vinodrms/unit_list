import {BaseDO} from '../../../../common/base/BaseDO';
import {IAttachedAddOnProductItemStrategy, AttachedAddOnProductItemStrategyQueryDO} from '../IAttachedAddOnProductItemStrategy';

export class OneItemPerDayAttachedAddOnProductItemStrategyDO extends BaseDO implements IAttachedAddOnProductItemStrategy {
    protected getPrimitivePropertyKeys(): string[] {
        return [];
    }

    public getNumberOfItems(query: AttachedAddOnProductItemStrategyQueryDO): number {
        return query.indexedBookingInterval.getLengthOfStay();
    }
    public isValid(): boolean {
        return true;
    }
}