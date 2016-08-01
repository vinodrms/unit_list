import {MongoRepository, MongoSearchCriteria, MongoAggregationOptions} from '../../../../common/base/MongoRepository';
import {ThLogger, ThLogLevel} from '../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {LazyLoadRepoDO, LazyLoadMetaResponseRepoDO} from '../../../../common/repo-data-objects/LazyLoadRepoDO';
import {BookingDO, GroupBookingStatus} from '../../../data-objects/BookingDO';
import {BookingMetaRepoDO, BookingSearchCriteriaRepoDO, BookingSearchResultRepoDO} from '../../IBookingRepository';
import {MongoQueryBuilder, QueryComparisonOperator} from '../../../../common/base/MongoQueryBuilder';
import {ThDateIntervalDO} from '../../../../../utils/th-dates/data-objects/ThDateIntervalDO';
import {IndexedBookingInterval} from '../../../../price-products/utils/IndexedBookingInterval';
import {BookingAggregationResultDO} from '../utils/data-objects/BookingAggregationResultDO';
import {BookingStateChangeTriggerType} from '../../../data-objects/state-change-time/BookingStateChangeTriggerTimeDO';
import {ThDateDO} from '../../../../../utils/th-dates/data-objects/ThDateDO';

import _ = require('underscore');

export class MongoGetBookingsRepository extends MongoRepository {
    constructor(bookingGroupsEntity: Sails.Model) {
        super(bookingGroupsEntity);
    }

    public getBookingListCount(meta: BookingMetaRepoDO, searchCriteria: BookingSearchCriteriaRepoDO): Promise<LazyLoadMetaResponseRepoDO> {
        return new Promise<LazyLoadMetaResponseRepoDO>((resolve: { (result: LazyLoadMetaResponseRepoDO): void }, reject: { (err: ThError): void }) => {
            this.getBookingListCountCore(resolve, reject, meta, searchCriteria);
        });
    }
    private getBookingListCountCore(resolve: { (result: LazyLoadMetaResponseRepoDO): void }, reject: { (err: ThError): void }, meta: BookingMetaRepoDO, searchCriteria: BookingSearchCriteriaRepoDO) {
        var query = this.buildSearchCriteria(meta, searchCriteria);
        this.getAggregationDocumentCount({ criteria: query }, this.getAggregationOptions(),
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
            sortCriteria: { "bookingList.startUtcTimestamp": sortCriteria },
            lazyLoad: lazyLoad
        };
        this.getAggregationDocumentList(mongoSearchCriteria, this.getAggregationOptions(),
            (err: Error) => {
                var thError = new ThError(ThStatusCode.BookingsRepositoryErrorGettingList, err);
                ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting booking list", { meta: meta, searchCriteria: searchCriteria }, thError);
                reject(thError);
            },
            (foundBookingList: Object[]) => {
                var aggregationResultList: BookingAggregationResultDO[] = this.getQueryResult(BookingAggregationResultDO, foundBookingList);
                resolve({
                    bookingList: _.map(aggregationResultList, (aggregationResult: BookingAggregationResultDO) => { return aggregationResult.booking }),
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
                            { "bookingList.startUtcTimestamp": { $lte: queryStartUtcTimestamp } },
                            { "bookingList.endUtcTimestamp": { $gte: queryStartUtcTimestamp } }
                        ]
                    },
                    {
                        $and: [
                            { "bookingList.startUtcTimestamp": { $gte: queryStartUtcTimestamp } },
                            { "bookingList.startUtcTimestamp": { $lte: queryEndUtcTimestamp } }
                        ]
                    }
                ]);
            }
        }
        this.appendTriggerParamsIfNecessary(mongoQueryBuilder, searchCriteria);
        this.appendDateParamsIfNecessary(mongoQueryBuilder, searchCriteria);
        this.appendBeforeStartDateParamIfNecessary(mongoQueryBuilder, searchCriteria);
        mongoQueryBuilder.addMultipleSelectOptionList("bookingList.confirmationStatus", searchCriteria.confirmationStatusList);
        mongoQueryBuilder.addExactMatch("id", searchCriteria.groupBookingId);
        mongoQueryBuilder.addMultipleSelectOptionList("bookingList.bookingId", searchCriteria.bookingIdList);
        mongoQueryBuilder.addRegex("bookingList.indexedSearchTerms", searchCriteria.searchTerm);
        mongoQueryBuilder.addExactMatch("bookingList.roomId", searchCriteria.roomId);
        mongoQueryBuilder.addMultipleSelectOption("bookingList.customerIdList", searchCriteria.customerId);
        return mongoQueryBuilder.processedQuery;
    }
    private appendTriggerParamsIfNecessary(mongoQueryBuilder: MongoQueryBuilder, searchCriteria: BookingSearchCriteriaRepoDO) {
        if (this._thUtils.isUndefinedOrNull(searchCriteria.triggerParams)
            || this._thUtils.isUndefinedOrNull(searchCriteria.triggerParams.triggerName)
            || this._thUtils.isUndefinedOrNull(searchCriteria.triggerParams.cancellationHour)
            || this._thUtils.isUndefinedOrNull(searchCriteria.triggerParams.currentHotelTimestamp)) {
            return;
        }

        var triggerTypeSelector: string = "bookingList." + searchCriteria.triggerParams.triggerName + ".type";
        var triggerUtcTimestampSelector: string = "bookingList." + searchCriteria.triggerParams.triggerName + ".utcTimestamp";
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
        var fieldNameSelector: string = "bookingList." + utcTimestampFieldName;

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
        mongoQueryBuilder.addCustomQuery("bookingList.startUtcTimestamp", { $lte: overlappingUtcTimestampInterval.maxUtcTimestamp });
    }

    private getAggregationOptions(): MongoAggregationOptions {
        return {
            unwind: true,
            unwindParam: "$bookingList"
        }
    }
}