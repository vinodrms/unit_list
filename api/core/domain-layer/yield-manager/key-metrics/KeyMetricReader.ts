import { ThLogger, ThLogLevel } from '../../../utils/logging/ThLogger';
import { ThError } from '../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../utils/th-responses/ThResponse';
import { AppContext } from '../../../utils/AppContext';
import { SessionContext } from '../../../utils/SessionContext';
import { KeyMetricsResult, KeyMetricsResultItem } from './utils/KeyMetricsResult';
import { YieldManagerPeriodDO } from '../utils/YieldManagerPeriodDO';
import { YieldManagerPeriodParser } from '../utils/YieldManagerPeriodParser';
import { IndexedBookingInterval } from '../../../data-layer/price-products/utils/IndexedBookingInterval';
import { RoomDO } from '../../../data-layer/rooms/data-objects/RoomDO';
import { RoomSearchResultRepoDO } from '../../../data-layer/rooms/repositories/IRoomRepository';
import { AllotmentDO, AllotmentStatus } from '../../../data-layer/allotments/data-objects/AllotmentDO';
import { AllotmentSearchResultRepoDO } from '../../../data-layer/allotments/repositories/IAllotmentRepository';
import { RoomCategoryStatsAggregator } from '../../room-categories/aggregators/RoomCategoryStatsAggregator';
import { RoomCategoryStatsDO } from '../../../data-layer/room-categories/data-objects/RoomCategoryStatsDO';
import { ThHourDO } from '../../../utils/th-dates/data-objects/ThHourDO';
import { ThTimestampDO } from '../../../utils/th-dates/data-objects/ThTimestampDO';
import { ThDateIntervalDO } from '../../../utils/th-dates/data-objects/ThDateIntervalDO';
import { HotelDO } from '../../../data-layer/hotel/data-objects/HotelDO';
import { HotelInventoryStatsReader } from '../../hotel-inventory-snapshots/stats-reader/HotelInventoryStatsReader';
import { IHotelInventoryStats } from '../../hotel-inventory-snapshots/stats-reader/data-objects/IHotelInventoryStats';
import { IMetricBuilderStrategy } from './utils/builder/IMetricBuilderStrategy';
import { MetricBuilderStrategyFactory, KeyMetricOutputType } from './utils/builder/MetricBuilderStrategyFactory';
import { ThPeriodType, ThPeriodDO } from "../../reports/key-metrics/period-converter/ThPeriodDO";
import { ThDateDO } from "../../../utils/th-dates/data-objects/ThDateDO";
import { ThDateToThPeriodConverterFactory } from "../../reports/key-metrics/period-converter/ThDateToThPeriodConverterFactory";
import { ThUtils } from "../../../utils/ThUtils";
import { KeyMetricsReaderInput } from "./utils/KeyMetricsReaderInput";
import { TaxDO } from "../../../data-layer/taxes/data-objects/TaxDO";
import { TaxResponseRepoDO } from "../../../data-layer/taxes/repositories/ITaxRepository";
import { CountryDO } from "../../../data-layer/common/data-objects/country/CountryDO";
import { KeyMetricType } from "./utils/KeyMetricType";

import _ = require('underscore');

export class KeyMetricReader {
    private _thUtils: ThUtils;
    
    private _currentIndexedInterval: IndexedBookingInterval;
    private _previousIndexedInterval: IndexedBookingInterval;

    private _loadedRoomList: RoomDO[];
    private _loadedAllotmentList: AllotmentDO[];
    private _loadedRoomCategoryStatsList: RoomCategoryStatsDO[];
    private _loadedVatTaxList: TaxDO[];
    private _loadedCountries: CountryDO[];

    private _homeCountry: CountryDO;
    private _cancellationHour: ThHourDO;
    private _checkOutHour: ThHourDO;
    private _currentHotelTimestamp: ThTimestampDO;
    private _configurationCompletedTimestamp: ThTimestampDO;

    private _input: KeyMetricsReaderInput;
    private _outputType: KeyMetricOutputType;
    private _keyMetricsResult: KeyMetricsResult;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();
    }

    public getKeyMetrics(input: KeyMetricsReaderInput, outputType: KeyMetricOutputType): Promise<KeyMetricsResult> {
        this._input = input;
        this._outputType = outputType;

        return new Promise<KeyMetricsResult>((resolve: { (result: KeyMetricsResult): void }, reject: { (err: ThError): void }) => {
            this.getKeyMetricsCore(resolve, reject);
        });
    }
    private getKeyMetricsCore(resolve: { (result: KeyMetricsResult): void }, reject: { (err: ThError): void }) {
        var ymPeriodParser = new YieldManagerPeriodParser(this._input.yieldManagerPeriodDO);
        if (!ymPeriodParser.isValid()) {
            var thError = new ThError(ThStatusCode.KeyMetricReaderInvalidInterval, null);
            ThLogger.getInstance().logError(ThLogLevel.Warning, "invalid interval for key metrics reader", this._input.yieldManagerPeriodDO, thError);
            reject(thError);
            return;
        }
        this._currentIndexedInterval = ymPeriodParser.getIndexedInterval();
        this._previousIndexedInterval = ymPeriodParser.getPrevYearIndexedInterval();

        this._appContext.getRepositoryFactory().getHotelRepository().getHotelById(this._sessionContext.sessionDO.hotel.id)
            .then((loadedHotel: HotelDO) => {
                this._homeCountry = loadedHotel.contactDetails.address.country;
                this._cancellationHour = loadedHotel.operationHours.cancellationHour;
                this._checkOutHour = loadedHotel.operationHours.checkOutTo;
                this._currentHotelTimestamp = ThTimestampDO.buildThTimestampForTimezone(loadedHotel.timezone);
                this._configurationCompletedTimestamp = loadedHotel.configurationCompletedTimestamp;
                
                var taxRepo = this._appContext.getRepositoryFactory().getTaxRepository();
                return taxRepo.getTaxList({ hotelId: this._sessionContext.sessionDO.hotel.id });
            }).then((result: TaxResponseRepoDO) => {
                this._loadedVatTaxList = result.vatList;
            
                var roomsRepo = this._appContext.getRepositoryFactory().getRoomRepository();
                return roomsRepo.getRoomList({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                    maintenanceStatusList: RoomDO.inInventoryMaintenanceStatusList
                });
            }).then((roomSearchResult: RoomSearchResultRepoDO) => {
                this._loadedRoomList = roomSearchResult.roomList;

                var allotmentsRepo = this._appContext.getRepositoryFactory().getAllotmentRepository();
                return allotmentsRepo.getAllotmentList({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                    status: AllotmentStatus.Active
                });
            }).then((allotmentsSearchResult: AllotmentSearchResultRepoDO) => {
                this._loadedAllotmentList = allotmentsSearchResult.allotmentList;

                var roomCategStatsAggregator = new RoomCategoryStatsAggregator(this._appContext, this._sessionContext);
                return roomCategStatsAggregator.getUsedRoomCategoryStatsList()
            }).then((roomCategoryStatsList: RoomCategoryStatsDO[]) => {
                this._loadedRoomCategoryStatsList = roomCategoryStatsList;

                let settingsRepo = this._appContext.getRepositoryFactory().getSettingsRepository();
                return settingsRepo.getCountries();
            }).then((countryList: CountryDO[]) => {
                this._loadedCountries = countryList;
                
                this._keyMetricsResult = new KeyMetricsResult();
                return this.getKeyMetricsResultItem(this._currentIndexedInterval, this._input.dataAggregationType);
            }).then((currentItem: KeyMetricsResultItem) => {
                this._keyMetricsResult.currentItem = currentItem;
                if (!this._input.includePreviousPeriod) {
                    return new Promise<KeyMetricsResultItem>((resolve: { (result: KeyMetricsResultItem): void }, reject: { (err: ThError): void }) => {
                        resolve(null);
                    });
                }
                return this.getKeyMetricsResultItem(this._previousIndexedInterval, this._input.dataAggregationType);
            }).then((previousItem: KeyMetricsResultItem) => {
                this._keyMetricsResult.previousItem = previousItem;
                resolve(this._keyMetricsResult);
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.KeyMetricReaderError, error);
                if (thError.isNativeError()) {
                    ThLogger.getInstance().logError(ThLogLevel.Error, "error getting key metrics", this._sessionContext, thError);
                }
                reject(thError);
            });
    }

    private getKeyMetricsResultItem(indexedInterval: IndexedBookingInterval, dataAggregationType: ThPeriodType): Promise<KeyMetricsResultItem> {
        return new Promise<KeyMetricsResultItem>((resolve: { (result: KeyMetricsResultItem): void }, reject: { (err: ThError): void }) => {
            this.getKeyMetricsResultItemCore(resolve, reject, indexedInterval, dataAggregationType);
        });
    }
    private getKeyMetricsResultItemCore(resolve: { (result: KeyMetricsResultItem): void }, reject: { (err: ThError): void }, indexedInterval: IndexedBookingInterval, dataAggregationType) {
        var statsReader = new HotelInventoryStatsReader(this._appContext, this._sessionContext, {
            currentVatTaxList: this._loadedVatTaxList,
            currentRoomList: this._loadedRoomList,
            currentAllotmentList: this._loadedAllotmentList,
            homeCountry: this._homeCountry,
            cancellationHour: this._cancellationHour,
            checkOutHour: this._checkOutHour,
            currentHotelTimestamp: this._currentHotelTimestamp,
            configurationCompletedTimestamp: this._configurationCompletedTimestamp,
            customerIdList: this._input.customerIdList
        }, this._input.excludeVat);
        statsReader.readInventoryForInterval(indexedInterval).then((inventoryStats: IHotelInventoryStats) => {
            var resultItem: KeyMetricsResultItem = new KeyMetricsResultItem();
            resultItem.dateList = indexedInterval.bookingDateList;
            resultItem.interval = ThDateIntervalDO.buildThDateIntervalDO(
                indexedInterval.getArrivalDate().buildPrototype(),
                indexedInterval.getDepartureDate().buildPrototype()
            );
            let aggregationPeriodList = this.getAggregationPeriodList(resultItem.dateList, dataAggregationType);
            resultItem.aggregationPeriodList = aggregationPeriodList;

            resultItem.metricList = [];
            var metricFactory = new MetricBuilderStrategyFactory(inventoryStats, this._loadedCountries, 
                this._input.commissionOption, this._loadedRoomCategoryStatsList);
            var metricBuilderStrategyList: IMetricBuilderStrategy[] = metricFactory.getMetricStrategies(this._outputType);

            _.forEach(metricBuilderStrategyList, (metricBuilderStrategy: IMetricBuilderStrategy) => {
                var keyMetric = metricBuilderStrategy.buildKeyMetric(indexedInterval.bookingDateList, aggregationPeriodList);
                resultItem.metricList.push(keyMetric);
            });
            resolve(resultItem);
        }).catch((error: any) => {
            reject(error);
        });
    }

    public getAggregationPeriodList(thDateList: ThDateDO[], aggregationType: ThPeriodType): ThPeriodDO[] {
        let periodConverter = ThDateToThPeriodConverterFactory.getConverter(aggregationType);
        
        let periodIdToPeriodMap: { [index: string]: ThPeriodDO; } = {};
        let periodIdList = [];
        _.forEach(thDateList, (date: ThDateDO) => {
            let period = periodConverter.convert(date);

            if (this._thUtils.isUndefinedOrNull(periodIdToPeriodMap[period.id])) {
                periodIdToPeriodMap[period.id] = period;
                periodIdList.push(period.id);
            }
        });
        
        let periodList = [];
        _.forEach(periodIdList, (periodId: string) => {
            periodList.push(periodIdToPeriodMap[periodId]);
        });

        return periodList;
    }
}