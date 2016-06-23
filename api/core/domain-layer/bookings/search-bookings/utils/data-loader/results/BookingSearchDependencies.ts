import {PriceProductDO} from '../../../../../../data-layer/price-products/data-objects/PriceProductDO';
import {AllotmentDO} from '../../../../../../data-layer/allotments/data-objects/AllotmentDO';
import {CustomerDO} from '../../../../../../data-layer/customers/data-objects/CustomerDO';

export class BookingSearchDependencies {
    priceProductList: PriceProductDO[];
    allotmentList: AllotmentDO[];
    customer: CustomerDO;
    constructor(priceProductList: PriceProductDO[], allotmentList: AllotmentDO[], customer?: CustomerDO) {
    }
}