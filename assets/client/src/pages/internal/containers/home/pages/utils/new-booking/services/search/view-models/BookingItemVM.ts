import {ConfigCapacityDO} from '../../../../../../../../services/common/data-objects/bed-config/ConfigCapacityDO';
import {PriceProductDO} from '../../../../../../../../services/price-products/data-objects/PriceProductDO';
import {TransientBookingItem} from '../../data-objects/TransientBookingItem';

export class BookingItemVM {
    cartSequenceId: number;
    uniqueId: string;
    priceProductName: string;
    roomCategoryName: string;
    roomCapacity: ConfigCapacityDO;
    bookingCapacity: ConfigCapacityDO;
    noAvailableRooms: number;
    noAvailableAllotments: number;
    noAvailableAllotmentsString: string;
    totalPrice: number;
    totalPriceString: string;
    conditionsString: string;
    constraintsString: string;

    transientBookingItem: TransientBookingItem;
    priceProduct: PriceProductDO;
}