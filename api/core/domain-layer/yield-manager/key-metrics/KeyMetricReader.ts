import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {KeyMetricsResult, KeyMetricsResultItem} from './utils/KeyMetricsResult';
import {YieldManagerPeriodDO} from '../utils/YieldManagerPeriodDO';
import {YieldManagerPeriodParser} from '../utils/YieldManagerPeriodParser';
import {IndexedBookingInterval} from '../../../data-layer/price-products/utils/IndexedBookingInterval';
import {RoomDO} from '../../../data-layer/rooms/data-objects/RoomDO';
import {RoomSearchResultRepoDO} from '../../../data-layer/rooms/repositories/IRoomRepository';
import {AllotmentDO, AllotmentStatus} from '../../../data-layer/allotments/data-objects/AllotmentDO';
import {AllotmentSearchResultRepoDO} from '../../../data-layer/allotments/repositories/IAllotmentRepository';
import {ThHourDO} from '../../../utils/th-dates/data-objects/ThHourDO';
import {ThTimestampDO} from '../../../utils/th-dates/data-objects/ThTimestampDO';
import {ThDateIntervalDO} from '../../../utils/th-dates/data-objects/ThDateIntervalDO';
import {HotelDO} from '../../../data-layer/hotel/data-objects/HotelDO';
import {HotelInventoryStatsReader} from '../../hotel-inventory-snapshots/stats-reader/HotelInventoryStatsReader';
import {IHotelInventoryStats} from '../../hotel-inventory-snapshots/stats-reader/data-objects/IHotelInventoryStats';
import {IMetricBuilderStrategy} from './utils/builder/IMetricBuilderStrategy';
import {MetricBuilderStrategyFactory} from './utils/builder/MetricBuilderStrategyFactory';

export class KeyMetricReader {
    private _currentIndexedInterval: IndexedBookingInterval;
    private _previousIndexedInterval: IndexedBookingInterval;

    private _loadedRoomList: RoomDO[];
    private _loadedAllotmentList: AllotmentDO[];
    private _cancellationHour: ThHourDO;
    private _currentHotelTimestamp: ThTimestampDO;

    private _keyMetricsResult: KeyMetricsResult;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
    }

    public getKeyMetrics(yieldManagerPeriodDO: YieldManagerPeriodDO): Promise<KeyMetricsResult> {
        return new Promise<KeyMetricsResult>((resolve: { (result: KeyMetricsResult): void }, reject: { (err: ThError): void }) => {
            this.getKeyMetricsCore(resolve, reject, yieldManagerPeriodDO);
        });
    }
    private getKeyMetricsCore(resolve: { (result: KeyMetricsResult): void }, reject: { (err: ThError): void }, yieldManagerPeriodDO: YieldManagerPeriodDO) {
        var ymPeriodParser = new YieldManagerPeriodParser(yieldManagerPeriodDO);
        if (!ymPeriodParser.isValid()) {
            var thError = new ThError(ThStatusCode.KeyMetricReaderInvalidInterval, null);
            ThLogger.getInstance().logError(ThLogLevel.Warning, "invalid interval for key metrics reader", yieldManagerPeriodDO, thError);
            reject(thError);
            return;
        }
        this._currentIndexedInterval = ymPeriodParser.getIndexedInterval();
        this._previousIndexedInterval = ymPeriodParser.getPrevYearIndexedInterval();

        this._appContext.getRepositoryFactory().getHotelRepository().getHotelById(this._sessionContext.sessionDO.hotel.id)
            .then((loadedHotel: HotelDO) => {
                this._cancellationHour = loadedHotel.operationHours.cancellationHour;
                this._currentHotelTimestamp = ThTimestampDO.buildThTimestampForTimezone(loadedHotel.timezone);

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

                this._keyMetricsResult = new KeyMetricsResult();
                return this.getKeyMetricsResultItem(this._currentIndexedInterval);
            }).then((currentItem: KeyMetricsResultItem) => {
                this._keyMetricsResult.currentItem = currentItem;
                return this.getKeyMetricsResultItem(this._previousIndexedInterval);
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

    private getKeyMetricsResultItem(indexedInterval: IndexedBookingInterval): Promise<KeyMetricsResultItem> {
        return new Promise<KeyMetricsResultItem>((resolve: { (result: KeyMetricsResultItem): void }, reject: { (err: ThError): void }) => {
            this.getKeyMetricsResultItemCore(resolve, reject, indexedInterval);
        });
    }
    private getKeyMetricsResultItemCore(resolve: { (result: KeyMetricsResultItem): void }, reject: { (err: ThError): void }, indexedInterval: IndexedBookingInterval) {
        var statsReader = new HotelInventoryStatsReader(this._appContext, this._sessionContext, {
            currentRoomList: this._loadedRoomList,
            currentAllotmentList: this._loadedAllotmentList,
            cancellationHour: this._cancellationHour,
            currentHotelTimestamp: this._currentHotelTimestamp
        });
        statsReader.readInventoryForInterval(indexedInterval).then((inventoryStats: IHotelInventoryStats) => {
            var resultItem: KeyMetricsResultItem = new KeyMetricsResultItem();
            resultItem.dateList = indexedInterval.bookingDateList;
            resultItem.interval = ThDateIntervalDO.buildThDateIntervalDO(
                indexedInterval.getArrivalDate().buildPrototype(),
                indexedInterval.getDepartureDate().buildPrototype()
            );
            resultItem.metricList = [];
            var metricFactory = new MetricBuilderStrategyFactory(inventoryStats);
            var metricBuilderStrategyList: IMetricBuilderStrategy[] = metricFactory.getMetricStrategies();
            _.forEach(metricBuilderStrategyList, (metricBuilderStrategy: IMetricBuilderStrategy) => {
                var keyMetric = metricBuilderStrategy.buildKeyMetric(indexedInterval.bookingDateList);
                resultItem.metricList.push(keyMetric);
            });
            resolve(resultItem);
        }).catch((error: any) => {
            reject(error);
        });
    }
}