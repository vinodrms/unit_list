import {BaseDO} from '../../../../common/base/BaseDO';
import {IAttachedAddOnProductItemStrategy, AttachedAddOnProductItemStrategyQueryDO} from '../IAttachedAddOnProductItemStrategy';

export class OneItemPerDayForEachAdultOrChildAttachedAddOnProductItemStrategyDO extends BaseDO implements IAttachedAddOnProductItemStrategy {
    protected getPrimitivePropertyKeys(): string[] {
        return [];
    }

    public getNumberOfItems(query: AttachedAddOnProductItemStrategyQueryDO): number {
        return query.indexedBookingInterval.getLengthOfStay() * (query.configCapacity.noAdults + query.configCapacity.noChildren);
    }
    public isValid(): boolean {
        return true;
    }
}