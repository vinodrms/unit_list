import {ConfigCapacityDO} from '../../../../../../../../services/common/data-objects/bed-config/ConfigCapacityDO';
import {TransientBookingItem} from '../../data-objects/TransientBookingItem';

export class BookingResultVM {
    uniqueId: string;
    priceProductName: string;
    roomCategoryName: string;
    roomCapacity: ConfigCapacityDO;
    noAvailableRooms: number;
    noAvailableAllotmentsString: string;
    totalPrice: number;
    totalPriceString: string;
    conditionsString: string;
    constraintsString: string;

    transientBookingItem: TransientBookingItem;
    noAvailableAllotments: number;
}