import { ThError } from "../../../../../utils/th-responses/ThError";
import { ThStatusCode } from "../../../../../utils/th-responses/ThResponse";
import { ThLogger, ThLogLevel } from "../../../../../utils/logging/ThLogger";
import { MongoRepository, MongoSearchCriteria } from "../../../../common/base/MongoRepository";
import { BookingRepositoryHelper } from "./helpers/BookingRepositoryHelper";
import { BookingMetaRepoDO, BookingSearchCriteriaRepoDO, BookingSearchResultRepoDO } from "../../IBookingRepository";
import { LazyLoadMetaResponseRepoDO, LazyLoadRepoDO } from "../../../../common/repo-data-objects/LazyLoadRepoDO";
import { MongoQueryBuilder } from "../../../../common/base/MongoQueryBuilder";
import { ThDateIntervalDO } from "../../../../../utils/th-dates/data-objects/ThDateIntervalDO";
import { IndexedBookingInterval } from "../../../../price-products/utils/IndexedBookingInterval";
import { ThDateDO } from "../../../../../utils/th-dates/data-objects/ThDateDO";
import { BookingDO } from "../../../data-objects/BookingDO";
import { BookingStateChangeTriggerType } from "../../../data-objects/state-change-time/BookingStateChangeTriggerTimeDO";

import _ = require('underscore');

export class MongoBookingReadRepository extends MongoRepository {
    private helper: BookingRepositoryHelper;

    constructor(bookingsEntity: Sails.Model) {
        super(bookingsEntity);
        this.helper = new BookingRepositoryHelper();
    }

    public getBookingListCount(meta: BookingMetaRepoDO, searchCriteria: BookingSearchCriteriaRepoDO): Promise<LazyLoadMetaResponseRepoDO> {
        return new Promise<LazyLoadMetaResponseRepoDO>((resolve: { (result: LazyLoadMetaResponseRepoDO): void }, reject: { (err: ThError): void }) => {
            this.getBookingListCountCore(resolve, reject, meta, searchCriteria);
        });
    }
    private getBookingListCountCore(resolve: { (result: LazyLoadMetaResponseRepoDO): void }, reject: { (err: ThError): void }, meta: BookingMetaRepoDO, searchCriteria: BookingSearchCriteriaRepoDO) {
        var query = this.buildSearchCriteria(meta, searchCriteria);
        return this.getDocumentCount(query,
            (err: Error) => {
                var thError = new ThError(ThStatusCode.BookingRepositoryErrorReadingDocumentCount, err);
                ThLogger.getInstance().logError(ThLogLevel.Error, "error reading document count", { meta: meta, searchCriteria: searchCriteria }, thError);
                reject(thError);
            },
            (meta: LazyLoadMetaResponseRepoDO) => {
                resolve(meta);
            });
    }

    public getBookingList(meta: BookingMetaRepoDO, searchCriteria: BookingSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<BookingSearchResultRepoDO> {
        return new Promise<BookingSearchResultRepoDO>((resolve: { (result: BookingSearchResultRepoDO): void }, reject: { (err: ThError): void }) => {
            this.getBookingListCore(resolve, reject, meta, searchCriteria, lazyLoad);
        });
    }
    private getBookingListCore(resolve: { (result: BookingSearchResultRepoDO): void }, reject: { (err: ThError): void }, meta: BookingMetaRepoDO, searchCriteria: BookingSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO) {
        var sortCriteria = 1;
        if (!this._thUtils.isUndefinedOrNull(searchCriteria) && _.isBoolean(searchCriteria.descendentSortOrder) && searchCriteria.descendentSortOrder) {
            sortCriteria = -1;
        }

        var mongoSearchCriteria: MongoSearchCriteria = {
            criteria: this.buildSearchCriteria(meta, searchCriteria),
            sortCriteria: { "startUtcTimestamp": sortCriteria },
            lazyLoad: lazyLoad
        };
        this.findMultipleDocuments(mongoSearchCriteria,
            (err: Error) => {
                var thError = new ThError(ThStatusCode.BookingsRepositoryErrorGettingList, err);
                ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting booking list", { meta: meta, searchCriteria: searchCriteria }, thError);
                reject(thError);
            },
            (foundBookingList: Object[]) => {
                var bookingList = this.helper.buildBookingListFrom(foundBookingList);
                resolve({
                    bookingList: bookingList,
                    lazyLoad: lazyLoad
                });
            }
        );
    }

    private buildSearchCriteria(meta: BookingMetaRepoDO, searchCriteria: BookingSearchCriteriaRepoDO): Object {
        var mongoQueryBuilder = new MongoQueryBuilder();
        mongoQueryBuilder.addExactMatch("hotelId", meta.hotelId);
        if (this._thUtils.isUndefinedOrNull(searchCriteria)) {
            return mongoQueryBuilder.processedQuery;
        }

        if (!this._thUtils.isUndefinedOrNull(searchCriteria.interval)) {
            var searchInterval = new ThDateIntervalDO();
            searchInterval.buildFromObject(searchCriteria.interval);
            if (searchInterval.isValid()) {
                var indexedBookingInterval = new IndexedBookingInterval(searchInterval);
                var queryStartUtcTimestamp = indexedBookingInterval.getStartUtcTimestamp();
                var queryEndUtcTimestamp = indexedBookingInterval.getEndUtcTimestamp();
                mongoQueryBuilder.addCustomQuery("$or", [
                    {
                        $and: [
                            { "startUtcTimestamp": { $lte: queryStartUtcTimestamp } },
                            { "endUtcTimestamp": { $gte: queryStartUtcTimestamp } }
                        ]
                    },
                    {
                        $and: [
                            { "startUtcTimestamp": { $gte: queryStartUtcTimestamp } },
                            { "startUtcTimestamp": { $lte: queryEndUtcTimestamp } }
                        ]
                    }
                ]);
            }
        }
        this.appendTriggerParamsIfNecessary(mongoQueryBuilder, searchCriteria);
        this.appendDateParamsIfNecessary(mongoQueryBuilder, searchCriteria);
        this.appendBeforeStartDateParamIfNecessary(mongoQueryBuilder, searchCriteria);
        this.appendCheckOutUtcTimestampNullOrGreaterThanIfNecessary(mongoQueryBuilder, searchCriteria);
        mongoQueryBuilder.addMultipleSelectOptionList("confirmationStatus", searchCriteria.confirmationStatusList);
        mongoQueryBuilder.addExactMatch("groupBookingId", searchCriteria.groupBookingId);
        mongoQueryBuilder.addMultipleSelectOptionList("groupBookingId", searchCriteria.groupBookingIdList);
        mongoQueryBuilder.addMultipleSelectOptionList("id", searchCriteria.bookingIdList);
        mongoQueryBuilder.addRegex("indexedSearchTerms", searchCriteria.searchTerm);
        mongoQueryBuilder.addExactMatch("roomId", searchCriteria.roomId);
        mongoQueryBuilder.addMultipleSelectOption("customerIdList", searchCriteria.customerId);
        mongoQueryBuilder.addMultipleSelectOption("reservedAddOnProductIdList", searchCriteria.reservedAddOnProductId);
        mongoQueryBuilder.addExactMatch("priceProductId", searchCriteria.priceProductId);      
        return mongoQueryBuilder.processedQuery;
    }
    private appendTriggerParamsIfNecessary(mongoQueryBuilder: MongoQueryBuilder, searchCriteria: BookingSearchCriteriaRepoDO) {
        if (this._thUtils.isUndefinedOrNull(searchCriteria.triggerParams)
            || this._thUtils.isUndefinedOrNull(searchCriteria.triggerParams.triggerName)
            || this._thUtils.isUndefinedOrNull(searchCriteria.triggerParams.cancellationHour)
            || this._thUtils.isUndefinedOrNull(searchCriteria.triggerParams.currentHotelTimestamp)) {
            return;
        }

        var triggerTypeSelector: string = searchCriteria.triggerParams.triggerName + ".type";
        var triggerUtcTimestampSelector: string = searchCriteria.triggerParams.triggerName + ".utcTimestamp";
        var maxExactTimestamp = searchCriteria.triggerParams.currentHotelTimestamp.getUtcTimestamp();
        var maxDependentOnHourTimestamp = maxExactTimestamp - searchCriteria.triggerParams.cancellationHour.getMillis();

        mongoQueryBuilder.addCustomQuery("$or", [
            this.generateTriggerTypeQueryOption(triggerTypeSelector, triggerUtcTimestampSelector, BookingStateChangeTriggerType.ExactTimestamp, maxExactTimestamp),
            this.generateTriggerTypeQueryOption(triggerTypeSelector, triggerUtcTimestampSelector, BookingStateChangeTriggerType.DependentOnCancellationHour, maxDependentOnHourTimestamp)
        ]);
    }
    private generateTriggerTypeQueryOption(triggerTypeSelector: string, triggerUtcTimestampSelector: string,
        triggerType: BookingStateChangeTriggerType, maxUtcTimestamp: number): Object {

        var optionType: Object = {};
        optionType[triggerTypeSelector] = triggerType;
        var optionValue: Object = {};
        optionValue[triggerUtcTimestampSelector] = { $lte: maxUtcTimestamp };
        return {
            $and: [optionType, optionValue]
        };
    }
    private appendDateParamsIfNecessary(mongoQueryBuilder: MongoQueryBuilder, searchCriteria: BookingSearchCriteriaRepoDO) {
        this.appendDateParamsIfNecessaryCore(mongoQueryBuilder, BookingDO.StartUtcTimestampName, searchCriteria.startDate);
        this.appendDateParamsIfNecessaryCore(mongoQueryBuilder, BookingDO.EndUtcTimestampName, searchCriteria.endDate);
    }
    private appendDateParamsIfNecessaryCore(mongoQueryBuilder: MongoQueryBuilder, utcTimestampFieldName: string, possibleThDate: ThDateDO) {
        if (this._thUtils.isUndefinedOrNull(possibleThDate)) {
            return;
        }
        var thDate = new ThDateDO();
        thDate.buildFromObject(possibleThDate);
        if (!thDate.isValid()) {
            return;
        }
        var overlappingUtcTimestampInterval = IndexedBookingInterval.getOverlappingUtcTimestampIntervalForDate(thDate);
        var fieldNameSelector: string = utcTimestampFieldName;

        var maxTimestampValue: Object = {};
        maxTimestampValue[fieldNameSelector] = { $lte: overlappingUtcTimestampInterval.maxUtcTimestamp };
        var minTimestampValue: Object = {};
        minTimestampValue[fieldNameSelector] = { $gte: overlappingUtcTimestampInterval.minUtcTimestamp };

        mongoQueryBuilder.addCustomQuery("$and", [maxTimestampValue, minTimestampValue]);
    }
    private appendBeforeStartDateParamIfNecessary(mongoQueryBuilder: MongoQueryBuilder, searchCriteria: BookingSearchCriteriaRepoDO) {
        if (this._thUtils.isUndefinedOrNull(searchCriteria.beforeStartDate)) {
            return;
        }
        var maxThDate = new ThDateDO();
        maxThDate.buildFromObject(searchCriteria.beforeStartDate);
        if (!maxThDate.isValid()) {
            return;
        }
        var overlappingUtcTimestampInterval = IndexedBookingInterval.getOverlappingUtcTimestampIntervalForDate(maxThDate);
        mongoQueryBuilder.addCustomQuery("startUtcTimestamp", { $lte: overlappingUtcTimestampInterval.maxUtcTimestamp });
    }
    private appendCheckOutUtcTimestampNullOrGreaterThanIfNecessary(mongoQueryBuilder: MongoQueryBuilder, searchCriteria: BookingSearchCriteriaRepoDO) {
        if (this._thUtils.isUndefinedOrNull(searchCriteria.checkOutDateNullOrGreaterOrEqualThan)) {
            return;
        }
        var startThDate = new ThDateDO();
        startThDate.buildFromObject(searchCriteria.checkOutDateNullOrGreaterOrEqualThan);
        if (!startThDate.isValid()) {
            return;
        }
        mongoQueryBuilder.addCustomQuery("$or", [
            { checkOutUtcTimestamp: { $gte: startThDate.getUtcTimestamp() } },
            { checkOutUtcTimestamp: null }]
        );
    }
}