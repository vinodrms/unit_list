import {ThLogger, ThLogLevel} from '../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../../utils/AppContext';
import {SessionContext} from '../../../../../utils/SessionContext';
import {BookingSearchResult, RoomCategoryItem, SearchParameters, AllotmentItem, PriceProductItem, PriceProductItemPrice} from './BookingSearchResult';
import {IBookingOccupancy} from '../../utils/occupancy-calculator/results/IBookingOccupancy';
import {BookingSearchDependencies} from '../data-loader/results/BookingSearchDependencies';
import {BookingSearchDO} from '../../BookingSearchDO';
import {RoomCategoryStatsDO} from '../../../../../data-layer/room-categories/data-objects/RoomCategoryStatsDO';
import {PriceProductDO} from '../../../../../data-layer/price-products/data-objects/PriceProductDO';
import {PriceProductsContainer} from '../../../../price-products/validators/results/PriceProductsContainer';
import {AllotmentDO} from '../../../../../data-layer/allotments/data-objects/AllotmentDO';
import {IndexedBookingInterval} from '../../../../../data-layer/price-products/utils/IndexedBookingInterval';

import _ = require('underscore');

export interface SearchResultBuilderParams {
    bookingOccupancy: IBookingOccupancy;
    bookingSearchDependencies: BookingSearchDependencies;
    roomCategoryStatsList: RoomCategoryStatsDO[];
    searchParams: BookingSearchDO;
}

export class BookingSearchResultBuilder {
    private _builderParams: SearchResultBuilderParams;
    private _indexedBookingInterval: IndexedBookingInterval;
    private _priceProductList: PriceProductDO[];

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
    }

    public build(builderParams: SearchResultBuilderParams): Promise<BookingSearchResult> {
        this._builderParams = builderParams;
        this._indexedBookingInterval = new IndexedBookingInterval(this._builderParams.searchParams.interval);

        return new Promise<BookingSearchResult>((resolve: { (result: BookingSearchResult): void }, reject: { (err: ThError): void }) => {
            try {
                this.buildCore(resolve, reject);
            } catch (error) {
                var thError = new ThError(ThStatusCode.SearchResultBuilderError, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "error building result", this._sessionContext.sessionDO, thError);
                reject(thError);
            }
        });
    }

    private buildCore(resolve: { (result: BookingSearchResult): void }, reject: { (err: ThError): void }) {
        var searchResult = new BookingSearchResult();
        searchResult.customer = this._builderParams.bookingSearchDependencies.customer;
        searchResult.searchParameters = this.buildSearchParameters();
        searchResult.allotmentItemList = this.buildAllotmentItemList();

        var priceProductsContainer = new PriceProductsContainer(this._builderParams.bookingSearchDependencies.priceProductList);
        searchResult.roomCategoryItemList = this.buildRoomCategoryItemList(priceProductsContainer);

        var mergedPriceProductList = this._builderParams.bookingSearchDependencies.getMergedPriceProductList();
        var mergedPriceProductsContainer = new PriceProductsContainer(mergedPriceProductList);
        searchResult.priceProductItemList = this.buildPriceProductItemList(mergedPriceProductsContainer);

        resolve(searchResult);
    }

    private buildSearchParameters(): SearchParameters {
        var searchParameters = new SearchParameters();
        searchParameters.configCapacity = this._builderParams.searchParams.configCapacity;
        searchParameters.interval = this._builderParams.searchParams.interval;
        return searchParameters;
    }

    private buildRoomCategoryItemList(priceProductsContainer: PriceProductsContainer): RoomCategoryItem[] {
        var roomCategoryItemList: RoomCategoryItem[] = [];
        _.forEach(this._builderParams.roomCategoryStatsList, (roomCategoryStats: RoomCategoryStatsDO) => {
            var roomCategoryItem = new RoomCategoryItem();
            roomCategoryItem.stats = roomCategoryStats;
            roomCategoryItem.noOccupiedRooms = this._builderParams.bookingOccupancy.getOccupancyForRoomCategoryId(roomCategoryStats.roomCategory.id);
            roomCategoryItem.priceProductIdList = this.getIdListFromPriceProductList(
                priceProductsContainer.getFilteredPriceProductsByRoomCategoryId(roomCategoryStats.roomCategory.id)
            );
            roomCategoryItemList.push(roomCategoryItem);
        });
        return roomCategoryItemList;
    }
    private getIdListFromPriceProductList(priceProductList: PriceProductDO[]): string[] {
        return _.map(priceProductList, (priceProduct: PriceProductDO) => { return priceProduct.id });
    }

    private buildAllotmentItemList(): AllotmentItem[] {
        var allotmentItemList: AllotmentItem[] = [];
        _.forEach(this._builderParams.bookingSearchDependencies.allotmentList, (allotment: AllotmentDO) => {
            var allotmentItem = new AllotmentItem();
            allotmentItem.allotment = allotment;
            allotmentItem.noTotalAllotments = allotment.availability.getAllotmentAvailabilityForInterval(this._indexedBookingInterval);
            allotmentItem.noOccupiedAllotments = this._builderParams.bookingOccupancy.getOccupancyForAllotmentId(allotment.id);
            allotmentItem.priceProductId = allotment.priceProductId;
            allotmentItemList.push(allotmentItem);
        });
        return allotmentItemList;
    }

    private buildPriceProductItemList(priceProductsContainer: PriceProductsContainer): PriceProductItem[] {
        var priceProductItemList: PriceProductItem[] = [];
        _.forEach(priceProductsContainer.priceProductList, (priceProduct: PriceProductDO) => {
            priceProduct.prepareForClient();

            var priceProductItem = new PriceProductItem();
            priceProductItem.priceProduct = priceProduct;
            priceProductItem.priceList = [];

            _.forEach(priceProduct.roomCategoryIdList, (roomCategoryId: string) => {
                var itemPrice = new PriceProductItemPrice();
                itemPrice.roomCategoryId = roomCategoryId;
                var noOfNights = this._indexedBookingInterval.getLengthOfStay();
                itemPrice.price = noOfNights * priceProduct.price.getPricePerNightFor({
                    roomCategoryId: roomCategoryId,
                    configCapacity: this._builderParams.searchParams.configCapacity
                });
                priceProductItem.priceList.push(itemPrice);
            });
            priceProductItemList.push(priceProductItem);
        });
        return priceProductItemList;
    }
}