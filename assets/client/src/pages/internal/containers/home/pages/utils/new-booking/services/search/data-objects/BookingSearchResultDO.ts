import {BaseDO} from '../../../../../../../../../../common/base/BaseDO';
import {RoomCategoryItemDO} from './room-category-item/RoomCategoryItemDO';
import {AllotmentItemDO} from './allotment-item/AllotmentItemDO';
import {PriceProductItemDO} from './price-product-item/PriceProductItemDO';
import {CustomerDO} from '../../../../../../../../services/customers/data-objects/CustomerDO';
import {SearchParametersDO} from './search-parameters/SearchParametersDO';

export class BookingSearchResultDO extends BaseDO {
    roomCategoryItemList: RoomCategoryItemDO[];
    allotmentItemList: AllotmentItemDO[];
    priceProductItemList: PriceProductItemDO[];
    customer: CustomerDO;
    searchParameters: SearchParametersDO;

    constructor() {
        super();
    }

    protected getPrimitivePropertyKeys(): string[] {
        return [];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.roomCategoryItemList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "roomCategoryItemList"), (roomCategoryItemObject: Object) => {
            var roomCategItemDO = new RoomCategoryItemDO();
            roomCategItemDO.buildFromObject(roomCategoryItemObject);
            this.roomCategoryItemList.push(roomCategItemDO);
        });

        this.allotmentItemList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "allotmentItemList"), (allotmentItemObject: Object) => {
            var allotmentItemDO = new AllotmentItemDO();
            allotmentItemDO.buildFromObject(allotmentItemObject);
            this.allotmentItemList.push(allotmentItemDO);
        });

        this.priceProductItemList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "priceProductItemList"), (priceProductItemObject: Object) => {
            var priceProductItemDO = new PriceProductItemDO();
            priceProductItemDO.buildFromObject(priceProductItemObject);
            this.priceProductItemList.push(priceProductItemDO);
        });

        this.customer = new CustomerDO();
        this.customer.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "customer"));

        this.searchParameters = new SearchParametersDO();
        this.searchParameters.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "searchParameters"));
    }

    public getAllotmentsFilteredByRoomCategory(roomCategoryId: string): AllotmentItemDO[] {
        return _.filter(this.allotmentItemList, (allotmentItem: AllotmentItemDO) => {
            return allotmentItem.allotment.roomCategoryId === roomCategoryId;
        });
    }
    public getPriceProductsFilteredByIds(priceProductIdList: string[]): PriceProductItemDO[] {
        return _.filter(this.priceProductItemList, (priceProductItem: PriceProductItemDO) => {
            return _.contains(priceProductIdList, priceProductItem.priceProduct.id);
        });
    }
    public getPriceProductItemById(priceProductId: string): PriceProductItemDO {
        return _.find(this.priceProductItemList, (priceProductItem: PriceProductItemDO) => {
            return priceProductItem.priceProduct.id === priceProductId;
        });
    }
}