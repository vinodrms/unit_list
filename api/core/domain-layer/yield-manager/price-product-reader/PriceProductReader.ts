import { ThLogger, ThLogLevel } from '../../../utils/logging/ThLogger';
import { ThError } from '../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../utils/th-responses/ThResponse';
import { AppContext } from '../../../utils/AppContext';
import { SessionContext } from '../../../utils/SessionContext';
import { ThUtils } from '../../../utils/ThUtils';
import { ThDateDO } from '../../../utils/th-dates/data-objects/ThDateDO';
import { ThDateIntervalUtils } from '../../../utils/th-dates/ThDateIntervalUtils';
import { IndexedBookingInterval } from '../../../data-layer/price-products/utils/IndexedBookingInterval';
import { PriceProductDO, PriceProductStatus } from '../../../data-layer/price-products/data-objects/PriceProductDO';
import { IPriceProductPrice } from "../../../data-layer/price-products/data-objects/price/IPriceProductPrice";
import { DynamicPriceDO } from "../../../data-layer/price-products/data-objects/price/DynamicPriceDO";
import { PriceProductSearchResultRepoDO } from '../../../data-layer/price-products/repositories/IPriceProductRepository';
import { RoomCategoryStatsAggregator } from "../../room-categories/aggregators/RoomCategoryStatsAggregator";
import { RoomCategoryStatsDO } from "../../../data-layer/room-categories/data-objects/RoomCategoryStatsDO";
import { ValidationResultParser } from '../../common/ValidationResultParser';
import { YieldManagerPeriodDO } from '../utils/YieldManagerPeriodDO';
import { YieldManagerPeriodParser } from '../utils/YieldManagerPeriodParser';
import { PriceProductYieldResult, PriceProductYieldItem, YieldItemState, YieldItemStateType, DynamicPriceYieldItem } from './utils/PriceProductYieldItem';

import _ = require('underscore');

export class PriceProductReader {
    private _indexedInterval: IndexedBookingInterval;
    private _thUtils: ThUtils;

    private _loadedpriceProductList: PriceProductDO[];
    private _loadedRoomCategoryStatsList: RoomCategoryStatsDO[];

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();
    }

    public getYieldItems(yieldManagerPeriodDO: YieldManagerPeriodDO): Promise<PriceProductYieldResult> {
        return new Promise<PriceProductYieldResult>((resolve: { (result: PriceProductYieldResult): void }, reject: { (err: ThError): void }) => {
            this.getYieldItemsCore(resolve, reject, yieldManagerPeriodDO);
        });
    }
    private getYieldItemsCore(resolve: { (result: PriceProductYieldResult): void }, reject: { (err: ThError): void }, yieldManagerPeriodDO: YieldManagerPeriodDO) {
        var ymPeriodParser = new YieldManagerPeriodParser(yieldManagerPeriodDO);
        if (!ymPeriodParser.isValid()) {
            var thError = new ThError(ThStatusCode.PriceProductReaderInvalidInterval, null);
            ThLogger.getInstance().logError(ThLogLevel.Warning, "invalid interval for yield reader", yieldManagerPeriodDO, thError);
            reject(thError);
            return;
        }
        this._indexedInterval = ymPeriodParser.getIndexedInterval();

        var priceProductRepo = this._appContext.getRepositoryFactory().getPriceProductRepository();
        priceProductRepo.getPriceProductList({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
            status: PriceProductStatus.Active
        }).then((searchResult: PriceProductSearchResultRepoDO) => {
            this._loadedpriceProductList = searchResult.priceProductList;

            var roomCategStatsAggregator = new RoomCategoryStatsAggregator(this._appContext, this._sessionContext);
            return roomCategStatsAggregator.getRoomCategoryStatsList();
        }).then((roomCategoryStatsList: RoomCategoryStatsDO[]) => {
            this._loadedRoomCategoryStatsList = RoomCategoryStatsDO.sortByUnits(roomCategoryStatsList);

            return this.getYieldItemList();
        }).then((yieldItemList: PriceProductYieldItem[]) => {
            var result = new PriceProductYieldResult();
            result.itemList = yieldItemList;
            result.dateList = this._indexedInterval.bookingDateList;
            resolve(result);
        }).catch((error: any) => {
            var thError = new ThError(ThStatusCode.PriceProductReaderError, error);
            if (thError.isNativeError()) {
                ThLogger.getInstance().logError(ThLogLevel.Error, "error getting price products for yield", this._indexedInterval.indexedBookingInterval, thError);
            }
            reject(thError);
        });
    }

    private getYieldItemList(): Promise<PriceProductYieldItem[]> {
        var promiseArray: Promise<PriceProductYieldItem>[] = []
        _.forEach(this._loadedpriceProductList, (priceProduct: PriceProductDO) => {
            promiseArray.push(this.getYieldItem(priceProduct));
        });
        return Promise.all(promiseArray);
    }
    private getYieldItem(priceProduct: PriceProductDO): Promise<PriceProductYieldItem> {
        return new Promise<PriceProductYieldItem>((resolve: { (result: PriceProductYieldItem): void }, reject: { (err: ThError): void }) => {
            this.getYieldItemCore(resolve, reject, priceProduct);
        });
    }
    private getYieldItemCore(resolve: { (result: PriceProductYieldItem): void }, reject: { (err: ThError): void }, priceProduct: PriceProductDO) {
        var yieldItem = new PriceProductYieldItem();
        yieldItem.priceProductId = priceProduct.id;
        yieldItem.priceProductName = priceProduct.name;
        yieldItem.parentPriceProductId = priceProduct.parentId;
        yieldItem.lastRoomAvailability = priceProduct.lastRoomAvailability;
        yieldItem.yieldFilterList = priceProduct.yieldFilterList;
        yieldItem.stateList = [];
        yieldItem.dynamicPriceList = [];

        let roomCategoryIdList = priceProduct.price.getRoomCategoryIdList();
        priceProduct.price.dynamicPriceList.forEach(dynamicPrice => {
            let dynamicPriceItem = new DynamicPriceYieldItem();
            dynamicPriceItem.dynamicPriceId = dynamicPrice.id;
            dynamicPriceItem.name = dynamicPrice.name;
            dynamicPriceItem.description = dynamicPrice.description;
            dynamicPriceItem.priceBriefString = "";
            dynamicPriceItem.roomCategoryNameForPriceBrief = "";
            dynamicPriceItem.openList = [];

            let baseRoomCategStats = this.getBaseRoomCategoryStats(dynamicPrice, roomCategoryIdList);
            if (!this._thUtils.isUndefinedOrNull(baseRoomCategStats)) {
                dynamicPriceItem.roomCategoryNameForPriceBrief = baseRoomCategStats.roomCategory.displayName;
                let price: IPriceProductPrice = dynamicPrice.getPriceForRoomCategory(baseRoomCategStats.roomCategory.id);
                if (!this._thUtils.isUndefinedOrNull(price)) {
                    dynamicPriceItem.priceBriefString = price.getPriceBriefString();
                }
            }

            yieldItem.dynamicPriceList.push(dynamicPriceItem);
        });

        var openIntervalUtils = new ThDateIntervalUtils(priceProduct.openIntervalList);
        var openForArrivalIntervalUtils = new ThDateIntervalUtils(priceProduct.openForArrivalIntervalList);
        var openForDepartureIntervalUtils = new ThDateIntervalUtils(priceProduct.openForDepartureIntervalList);

        _.forEach(this._indexedInterval.bookingDateList, (date: ThDateDO) => {
            var state = new YieldItemState();
            state.open = openIntervalUtils.containsThDateDO(date) ? YieldItemStateType.Open : YieldItemStateType.Closed;
            state.openForArrival = openForArrivalIntervalUtils.containsThDateDO(date) ? YieldItemStateType.Open : YieldItemStateType.Closed;
            state.openForDeparture = openForDepartureIntervalUtils.containsThDateDO(date) ? YieldItemStateType.Open : YieldItemStateType.Closed;
            yieldItem.stateList.push(state);

            let enabledDynamicPrice: DynamicPriceDO = priceProduct.price.getEnabledDynamicPriceForDate(date);
            yieldItem.dynamicPriceList.forEach(dynamicPriceItem => {
                if (dynamicPriceItem.dynamicPriceId === enabledDynamicPrice.id) {
                    dynamicPriceItem.openList.push(YieldItemStateType.Open);
                }
                else {
                    dynamicPriceItem.openList.push(YieldItemStateType.Closed);
                }
            });
        });

        resolve(yieldItem);
    }
    private getBaseRoomCategoryStats(dynamicPrice: DynamicPriceDO, roomCategoryIdList: string[]​​): RoomCategoryStatsDO {
        for (var i = 0; i < this._loadedRoomCategoryStatsList.length; i++) {
            let roomCategStats = this._loadedRoomCategoryStatsList[i];
            if (_.contains(roomCategoryIdList, roomCategStats.roomCategory.id)) {
                return roomCategStats;
            }
        }
        return null;
    }
}