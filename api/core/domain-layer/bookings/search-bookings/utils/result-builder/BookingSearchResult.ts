import {ThDateIntervalDO} from '../../../../../utils/th-dates/data-objects/ThDateIntervalDO';
import {ConfigCapacityDO} from '../../../../../data-layer/common/data-objects/bed-config/ConfigCapacityDO';
import {RoomCategoryStatsDO} from '../../../../../data-layer/room-categories/data-objects/RoomCategoryStatsDO';
import {AllotmentDO} from '../../../../../data-layer/allotments/data-objects/AllotmentDO';
import {PriceProductDO} from '../../../../../data-layer/price-products/data-objects/PriceProductDO';
import {CustomerDO} from '../../../../../data-layer/customers/data-objects/CustomerDO';
import {PricePerDayDO} from '../../../../../data-layer/bookings/data-objects/price/PricePerDayDO';

export class RoomCategoryItem {
    stats: RoomCategoryStatsDO;
    noOccupiedRooms: number;
    priceProductIdList: string[];
    canFit: boolean;
}
export class AllotmentItem {
    allotment: AllotmentDO;
    noTotalAllotments: number;
    noOccupiedAllotments: number;
    priceProductId: string;
}

export class PriceProductItemPrice {
    roomCategoryId: string;
    price: number;
    pricePerDayList: PricePerDayDO[];
    commision: number = 0;
    otherPrice: number = 0;
}
export class PriceProductItem {
    priceProduct: PriceProductDO;
    priceList: PriceProductItemPrice[];
}

export class SearchParameters {
    interval: ThDateIntervalDO;
    configCapacity: ConfigCapacityDO;
}

export class BookingSearchResult {
    roomCategoryItemList: RoomCategoryItem[];
    allotmentItemList: AllotmentItem[];
    priceProductItemList: PriceProductItem[];
    customer: CustomerDO;
    searchParameters: SearchParameters;
}