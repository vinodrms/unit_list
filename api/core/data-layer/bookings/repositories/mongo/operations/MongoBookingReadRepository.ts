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

    constructor(bookingsEntity: any) {
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
            lazyLoad: lazyLoad
        };

        // mongo can't obtain the sort index via scan index, so we only sort when we require lazy loading
        // you can read more here: https://docs.mongodb.com/manual/reference/method/cursor.sort/#limit-results
        var lazyLoadValidationStructure = LazyLoadRepoDO.getValidationStructure().validateStructure(lazyLoad);
        if (lazyLoadValidationStructure.isValid()) {
            mongoSearchCriteria.sortCriteria = { "startUtcTimestamp": sortCriteria };
        }

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
        this.appendStartDateLtParamIfNecessary(mongoQueryBuilder, searchCriteria);
        this.appendEndDateGtParamIfNecessary(mongoQueryBuilder, searchCriteria);

        this.appendCheckOutUtcTimestampNullOrGreaterThanIfNecessary(mongoQueryBuilder, searchCriteria);
        this.appendCreationDateTimestampParamsIfNecessary(mongoQueryBuilder, searchCriteria);
        mongoQueryBuilder.addMultipleSelectOptionList("confirmationStatus", searchCriteria.confirmationStatusList);
        mongoQueryBuilder.addExactMatch("groupBookingId", searchCriteria.groupBookingId);
        mongoQueryBuilder.addMultipleSelectOptionList("groupBookingId", searchCriteria.groupBookingIdList);
        mongoQueryBuilder.addMultipleSelectOptionList("id", searchCriteria.bookingIdList);
        this.appendSearchTermParams(mongoQueryBuilder, searchCriteria.searchTerm);
        mongoQueryBuilder.addExactMatch("roomId", searchCriteria.roomId);
        mongoQueryBuilder.addMultipleSelectOption("customerIdList", searchCriteria.customerId);
        mongoQueryBuilder.addMultipleSelectOptionList("customerIdList", searchCriteria.customerIdList);
        mongoQueryBuilder.addMultipleSelectOption("reservedAddOnProductIdList", searchCriteria.reservedAddOnProductId);
        mongoQueryBuilder.addExactMatch("priceProductId", searchCriteria.priceProductId);
        return mongoQueryBuilder.processedQuery;
    }
    private appendCreationDateTimestampParamsIfNecessary(mongoQueryBuilder: MongoQueryBuilder, searchCriteria: BookingSearchCriteriaRepoDO) {
        if (!this._thUtils.isUndefinedOrNull(searchCriteria.creationInterval)) {
            var andQuery: Object[] = (mongoQueryBuilder.processedQuery["$and"]) ? mongoQueryBuilder.processedQuery["$and"] : [];
            andQuery.push({ "creationDateUtcTimestamp": { $gte: searchCriteria.creationInterval.start.getUtcTimestamp() } });
            andQuery.push({ "creationDateUtcTimestamp": { $lte: searchCriteria.creationInterval.end.getUtcTimestamp() } });

            mongoQueryBuilder.addCustomQuery(
                "$and", andQuery
            );
        }
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
        this.appendDateParamsIfNecessaryCore(mongoQueryBuilder, BookingDO.StartUtcTimestampName, searchCriteria.startDateEq);
        this.appendDateParamsIfNecessaryCore(mongoQueryBuilder, BookingDO.EndUtcTimestampName, searchCriteria.endDateEq);
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
    private appendStartDateLtParamIfNecessary(mongoQueryBuilder: MongoQueryBuilder, searchCriteria: BookingSearchCriteriaRepoDO) {
        if (this._thUtils.isUndefinedOrNull(searchCriteria.startDateLte) && this._thUtils.isUndefinedOrNull(searchCriteria.startDateLt)) {
            return;
        }

        let lte = this._thUtils.isUndefinedOrNull(searchCriteria.startDateLt);
        var maxThDate = new ThDateDO();
        maxThDate.buildFromObject(lte ? searchCriteria.startDateLte : searchCriteria.startDateLt);
        if (!maxThDate.isValid()) {
            return;
        }

        let maxThDateInterval = IndexedBookingInterval.getOverlappingUtcTimestampIntervalForDate(maxThDate);
        let query = {};
        query["startUtcTimestamp"] = lte ? { $lte: maxThDateInterval.maxUtcTimestamp } : { $lt: maxThDateInterval.minUtcTimestamp };

        var andQuery: Object[] = (mongoQueryBuilder.processedQuery["$and"]) ? mongoQueryBuilder.processedQuery["$and"] : [];
        andQuery.push(query);
        mongoQueryBuilder.addCustomQuery("$and", andQuery);
    }
    private appendEndDateGtParamIfNecessary(mongoQueryBuilder: MongoQueryBuilder, searchCriteria: BookingSearchCriteriaRepoDO) {
        if (this._thUtils.isUndefinedOrNull(searchCriteria.endDateGt) && this._thUtils.isUndefinedOrNull(searchCriteria.endDateGte)) {
            return;
        }

        let gte = this._thUtils.isUndefinedOrNull(searchCriteria.endDateGt);
        var minThDate = new ThDateDO();
        minThDate.buildFromObject(gte ? searchCriteria.endDateGte : searchCriteria.endDateGt);
        if (!minThDate.isValid()) {
            return;
        }

        let minThDateInterval = IndexedBookingInterval.getOverlappingUtcTimestampIntervalForDate(minThDate);
        let query = {};
        query["endUtcTimestamp"] = gte ? { $gte: minThDateInterval.minUtcTimestamp } : { $gt: minThDateInterval.maxUtcTimestamp };

        var andQuery: Object[] = (mongoQueryBuilder.processedQuery["$and"]) ? mongoQueryBuilder.processedQuery["$and"] : [];
        andQuery.push(query);
        mongoQueryBuilder.addCustomQuery("$and", andQuery);
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
    private appendSearchTermParams(mongoQueryBuilder: MongoQueryBuilder, searchTerm: string) {
        if (this._thUtils.isUndefinedOrNull(searchTerm) || !_.isString(searchTerm)) {
            return;
        }
        let regexValue = '/*' + searchTerm + '/*';
        let regexQuery = { "$regex": regexValue, "$options": "i" };
        
        var andQuery: Object[] = (mongoQueryBuilder.processedQuery["$and"]) ? mongoQueryBuilder.processedQuery["$and"] : [];
        andQuery.push({"$or": [
            { "indexedSearchTerms": regexQuery },
            { "externalBookingReference": regexQuery },
            { "notes": regexQuery },
            { "invoiceNotes": regexQuery },
        ]});
        mongoQueryBuilder.addCustomQuery("$and", andQuery);
    }
}
