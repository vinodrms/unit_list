import {BookingDO} from '../../../data-layer/bookings/data-objects/BookingDO';
import {CustomerDO} from '../../../data-layer/customers/data-objects/CustomerDO';
import {RoomCategoryStatsDO} from '../../../data-layer/room-categories/data-objects/RoomCategoryStatsDO';
import {BedDO} from '../../../data-layer/common/data-objects/bed/BedDO';
import {AddOnProductDO} from '../../../data-layer/add-on-products/data-objects/AddOnProductDO';
import {AddOnProductCategoryDO} from '../../../data-layer/common/data-objects/add-on-product/AddOnProductCategoryDO';
import {TaxDO} from '../../../data-layer/taxes/data-objects/TaxDO';

export class BookingAggregatedData {
    booking: BookingDO;
    customerList: CustomerDO[];
    roomCategoryStats: RoomCategoryStatsDO;
    bedList: BedDO[];
    addOnProductList: AddOnProductDO[];
    addOnProductCategoyList: AddOnProductCategoryDO[];
    vatList: TaxDO[];
    otherTaxes: TaxDO[];
}