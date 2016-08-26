import {BaseDO} from '../../../common/base/BaseDO';
import {IndexedBookingInterval} from '../../utils/IndexedBookingInterval';
import {ConfigCapacityDO} from '../../../common/data-objects/bed-config/ConfigCapacityDO';

export enum AttachedAddOnProductItemStrategyType {
    OneItemPerDay,
    OneItemPerDayForEachAdultOrChild,
    FixedNumber
}

export interface AttachedAddOnProductItemStrategyQueryDO {
    indexedBookingInterval: IndexedBookingInterval;
    configCapacity: ConfigCapacityDO;
}

export interface IAttachedAddOnProductItemStrategy extends BaseDO {
    getNumberOfItems(query: AttachedAddOnProductItemStrategyQueryDO): number;
    isValid(): boolean;
}