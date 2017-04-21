import { ThLogger, ThLogLevel } from '../../../../../utils/logging/ThLogger';
import { ThError } from '../../../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../../../utils/th-responses/ThResponse';
import { AppContext } from '../../../../../utils/AppContext';
import { SessionContext } from '../../../../../utils/SessionContext';
import { ThUtils } from '../../../../../utils/ThUtils';
import { BookingSearchResult, RoomCategoryItem, SearchParameters, AllotmentItem, PriceProductItem, PriceProductItemPrice } from './BookingSearchResult';
import { IBookingOccupancy } from '../../utils/occupancy-calculator/results/IBookingOccupancy';
import { BookingSearchDependencies } from '../data-loader/results/BookingSearchDependencies';
import { BookingSearchDO } from '../../BookingSearchDO';
import { RoomCategoryStatsDO } from '../../../../../data-layer/room-categories/data-objects/RoomCategoryStatsDO';
import { PriceProductDO } from '../../../../../data-layer/price-products/data-objects/PriceProductDO';
import { PriceProductsContainer } from '../../../../price-products/validators/results/PriceProductsContainer';
import { PriceProductPriceQueryDO } from "../../../../../data-layer/price-products/data-objects/price/IPriceProductPrice";
import { PricePerDayDO } from "../../../../../data-layer/bookings/data-objects/price/PricePerDayDO";
import { AllotmentDO } from '../../../../../data-layer/allotments/data-objects/AllotmentDO';
import { IndexedBookingInterval } from '../../../../../data-layer/price-products/utils/IndexedBookingInterval';
import { BookingUtils } from '../../../utils/BookingUtils';
import { HotelDO } from "../../../../../data-layer/hotel/data-objects/HotelDO";
import { StringOccurenciesIndexer } from "../../../../../utils/indexers/StringOccurenciesIndexer";

import _ = require('underscore');

export interface SearchResultBuilderParams {
    bookingOccupancy: IBookingOccupancy;
    bookingSearchDependencies: BookingSearchDependencies;
    roomCategoryStatsList: RoomCategoryStatsDO[];
    searchParams: BookingSearchDO;
    hotel: HotelDO;
}

export class BookingSearchResultBuilder {
    private _thUtils: ThUtils;
    private _bookingUtils: BookingUtils;

    private _builderParams: SearchResultBuilderParams;
    private _indexedBookingInterval: IndexedBookingInterval;
    private _priceProductList: PriceProductDO[];

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();
        this._bookingUtils = new BookingUtils();
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

            let bookingCreationDate = this._bookingUtils.getCurrentThDateForHotel(this._builderParams.hotel);

            _.forEach(priceProduct.roomCategoryIdList, (roomCategoryId: string) => {
                let priceQuery: PriceProductPriceQueryDO = {
                    roomCategoryId: roomCategoryId,
                    configCapacity: this._builderParams.searchParams.configCapacity,
                    roomCategoryStatsList: this._builderParams.roomCategoryStatsList,
                    bookingInterval: this._indexedBookingInterval
                };
                if (priceProduct.price.hasPriceConfiguredFor(priceQuery)) {
                    var itemPrice = new PriceProductItemPrice();

                    var bookingBilledCustomerId: string;
                    if (!this._thUtils.isUndefinedOrNull(this._builderParams.bookingSearchDependencies.customer)) {
                        bookingBilledCustomerId = this._builderParams.bookingSearchDependencies.customer.id;
                    }

                    itemPrice.roomCategoryId = roomCategoryId;
                    var pricePerDayList: PricePerDayDO[] = priceProduct.price.getPricePerDayBreakdownFor(priceQuery);
                    let discountPerDayBreakdown = priceProduct.discounts.getDiscountValuesBreakdownFor({
                        indexedBookingInterval: this._indexedBookingInterval,
                        bookingCreationDate: bookingCreationDate,
                        configCapacity: this._builderParams.searchParams.configCapacity,

                        // pass no room categories because the bookings were not added yet
                        // such as e.g. the min no rooms constraint will not apply
                        indexedNumberOfRoomCategoriesFromGroupBooking: new StringOccurenciesIndexer([]),
                        roomCategoryIdListFromPriceProduct: priceProduct.roomCategoryIdList,
                        bookingBilledCustomerId: bookingBilledCustomerId
                    });
                    pricePerDayList = this._bookingUtils.getPricePerDayListWithDiscount(pricePerDayList, discountPerDayBreakdown);
                    itemPrice.pricePerDayList = pricePerDayList;

                    let roomPrice = this._thUtils.getArraySum(pricePerDayList);
                    itemPrice.price = roomPrice;

                    if (!this._thUtils.isUndefinedOrNull(this._builderParams.bookingSearchDependencies.customer)) {
                        let commission = this._builderParams.bookingSearchDependencies.customer.customerDetails.getCommission();
                        itemPrice.commision = commission.getCommissionFor(roomPrice);
                        itemPrice.price -= itemPrice.commision;
                    }

                    var includedInvoiceItems = this._bookingUtils.getIncludedInvoiceItems(priceProduct, this._builderParams.searchParams.configCapacity, this._indexedBookingInterval);
                    itemPrice.otherPrice = includedInvoiceItems.getTotalPrice();
                    itemPrice.price += itemPrice.otherPrice;

                    itemPrice.price = this._thUtils.roundNumberToTwoDecimals(itemPrice.price);
                    priceProductItem.priceList.push(itemPrice);
                }
            });
            priceProductItemList.push(priceProductItem);
        });
        return priceProductItemList;
    }
}