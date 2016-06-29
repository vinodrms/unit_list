import {ThDateIntervalDO} from '../../../../../../../services/common/data-objects/th-dates/ThDateIntervalDO';
import {ConfigCapacityDO} from '../../../../../../../services/common/data-objects/bed-config/ConfigCapacityDO';

export class TransientBookingItem {
    interval: ThDateIntervalDO;
    configCapacity: ConfigCapacityDO;
    roomCategoryId: string;
    priceProductId: string;
    allotmentId: string;
}