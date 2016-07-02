import {ThDateIntervalDO} from '../../../../../../../services/common/data-objects/th-dates/ThDateIntervalDO';
import {ConfigCapacityDO} from '../../../../../../../services/common/data-objects/bed-config/ConfigCapacityDO';
import {DefaultBillingDetailsDO} from '../../../../../../../services/bookings/data-objects/default-billing/DefaultBillingDetailsDO';

export class TransientBookingItem {
    interval: ThDateIntervalDO;
    configCapacity: ConfigCapacityDO;
    customerIdList: string[];
    defaultBillingDetails: DefaultBillingDetailsDO;
    roomCategoryId: string;
    priceProductId: string;
    allotmentId: string;
    notes: string;
}