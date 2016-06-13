import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThUtils} from '../../../utils/ThUtils';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {RoomDO} from '../../../data-layer/rooms/data-objects/RoomDO';
import {RoomCategoryDO} from '../../../data-layer/room-categories/data-objects/RoomCategoryDO';
import {BedConfigDO} from '../../../data-layer/room-categories/data-objects/bed-config/BedConfigDO';
import {BedMetaDO} from '../../../data-layer/room-categories/data-objects/bed-config/BedMetaDO';
import {BedDO, BedStorageType, BedAccommodationType} from '../../../data-layer/common/data-objects/bed/BedDO';
import {RoomCategorySearchResultRepoDO} from '../../../data-layer/room-categories/repositories/IRoomCategoryRepository';
import {ConfigCapacityDO} from '../../../data-layer/common/data-objects/bed-config/ConfigCapacityDO';
import {RoomCategoryStatsDO, RoomCategoryCapacityDO} from '../../../data-layer/room-categories/data-objects/RoomCategoryStatsDO';
import {RoomMetaRepoDO, RoomSearchResultRepoDO} from '../../../data-layer/rooms/repositories/IRoomRepository';
import {BedSearchResultRepoDO} from '../../../data-layer/beds/repositories/IBedRepository';

import _ = require('underscore');

export interface RoomCategoryStatsAggregatorMetaDO {
    hotelId: string;
}

export class RoomCategoryStatsAggregator {
    private _thUtils: ThUtils;

    constructor(private _appContext: AppContext) {
        this._thUtils = new ThUtils();
    }

    public getUsedRoomCategoryList(roomCategoryAggregatorMeta: RoomCategoryStatsAggregatorMetaDO): Promise<RoomCategoryDO[]> {
        return new Promise<RoomCategoryDO[]>((resolve: { (result: RoomCategoryDO[]): void }, reject: { (err: ThError): void }) => {
            this.getUsedRoomCategoryListCore(resolve, reject, roomCategoryAggregatorMeta);
        });
    }

    private getUsedRoomCategoryListCore(resolve: { (result: RoomCategoryDO[]): void }, reject: { (err: ThError): void }, roomCategoryAggregatorMeta: RoomCategoryStatsAggregatorMetaDO) {
        var roomRepository = this._appContext.getRepositoryFactory().getRoomRepository();
        var roomCategoryRepository = this._appContext.getRepositoryFactory().getRoomCategoryRepository();

        // TODO return only distinct room categories
        roomRepository.getRoomCategoryIdList({ hotelId: roomCategoryAggregatorMeta.hotelId }).then((categoryIdList: string[]) => {
            return roomCategoryRepository.getRoomCategoryList({ hotelId: roomCategoryAggregatorMeta.hotelId }, { categoryIdList: categoryIdList });
        }).then((result: RoomCategorySearchResultRepoDO) => {
            resolve(result.roomCategoryList);
        }).catch((error: any) => {
            var thError = new ThError(ThStatusCode.RoomAggregatorGetUsedCategoriesError, error);
            if (thError.isNativeError()) {
                ThLogger.getInstance().logError(ThLogLevel.Error, "error retrieving distinct room categories for the hotel", roomCategoryAggregatorMeta, thError);
            }
            reject(thError);
        });
    }

    public getRoomCategoryStatsList(roomCategoryAggregatorMeta: RoomCategoryStatsAggregatorMetaDO, roomCategoryIdList?: string[]): Promise<RoomCategoryStatsDO[]> {
        return new Promise<RoomCategoryStatsDO[]>((resolve: { (result: RoomCategoryStatsDO[]): void }, reject: { (err: ThError): void }) => {
            this.getRoomCategoryStatsListCore(resolve, reject, roomCategoryAggregatorMeta, roomCategoryIdList);
        });
    }

    public getRoomCategoryStatsListCore(resolve: { (result: RoomCategoryStatsDO[]): void }, reject: { (err: ThError): void }, roomCategoryAggregatorMeta: RoomCategoryStatsAggregatorMetaDO, roomCategoryIdList: string[]) {
        this.getRoomCategoryList(roomCategoryAggregatorMeta, roomCategoryIdList).then((result: RoomCategorySearchResultRepoDO) => {
            var computeCategoryStatsPromiseList = [];
            result.roomCategoryList.forEach((roomCategory) => {
                computeCategoryStatsPromiseList.push(this.getRoomCategoryStats(roomCategory));
            });
            return Promise.all(computeCategoryStatsPromiseList);
        }).then((rommCategoryStatsList: RoomCategoryStatsDO[]) => {
            resolve(rommCategoryStatsList);
        }).catch((error: any) => {
            var thError = new ThError(ThStatusCode.RoomAggregatorCategoryStatsListError, error);
            if (thError.isNativeError()) {
                ThLogger.getInstance().logError(ThLogLevel.Error, "error computing category list stats", null, thError);
            }
            reject(thError);
        });
    }

    private getRoomCategoryList(roomCategoryAggregatorMeta: RoomCategoryStatsAggregatorMetaDO, roomCategoryIdList?: string[]) {
        return new Promise<RoomCategorySearchResultRepoDO>((resolve: { (result: RoomCategorySearchResultRepoDO): void }, reject: { (err: ThError): void }) => {
            this.getRoomCategoryListCore(resolve, reject, roomCategoryAggregatorMeta, roomCategoryIdList);
        });
    }

    private getRoomCategoryListCore(resolve: { (result: RoomCategorySearchResultRepoDO): void }, reject: { (err: ThError): void }, roomCategoryAggregatorMeta: RoomCategoryStatsAggregatorMetaDO, roomCategoryIdList?: string[]) {
        var roomRepository = this._appContext.getRepositoryFactory().getRoomRepository();
        var roomCategoryRepository = this._appContext.getRepositoryFactory().getRoomCategoryRepository();
        
        var roomCategoriesPromise: Promise<RoomCategorySearchResultRepoDO>;
        
        if(this._thUtils.isUndefinedOrNull(roomCategoryIdList)) {
            roomCategoriesPromise = roomCategoryRepository.getRoomCategoryList({ hotelId: roomCategoryAggregatorMeta.hotelId });
        }
        else {
            roomCategoriesPromise = roomCategoryRepository.getRoomCategoryList({ hotelId: roomCategoryAggregatorMeta.hotelId }, { categoryIdList: roomCategoryIdList });    
        }
        
        roomCategoriesPromise.then((result: RoomCategorySearchResultRepoDO) => {
            resolve(result);
        }).catch((error: any) => {
            var thError = new ThError(ThStatusCode.RoomAggregatorCategoryStatsListError, error);
            if (thError.isNativeError()) {
                ThLogger.getInstance().logError(ThLogLevel.Error, "error getting room category list", null, thError);
            }
            reject(thError);
        });
    }
    
    private getRoomCategoryStats(categoryDO: RoomCategoryDO): Promise<RoomCategoryStatsDO> {
        return new Promise<RoomCategoryStatsDO>((resolve: { (result: RoomCategoryStatsDO): void }, reject: { (err: ThError): void }) => {
            this.getRoomCategoryStatsCore(resolve, reject, categoryDO);
        });
    }

    private getRoomCategoryStatsCore(resolve: { (result: RoomCategoryStatsDO): void }, reject: { (err: ThError): void }, categoryDO: RoomCategoryDO) {
        var roomRepository = this._appContext.getRepositoryFactory().getRoomRepository();
        var bedRepository = this._appContext.getRepositoryFactory().getBedRepository();

        var bedIdList = _.map(categoryDO.bedConfig.bedMetaList, (bedMeta: BedMetaDO) => {
            return bedMeta.bedId;
        });

        var getBedListPromise: Promise<BedSearchResultRepoDO> = bedRepository.getBedList({ hotelId: categoryDO.hotelId }, { bedIdList: bedIdList });
        var getRoomListPromise: Promise<RoomSearchResultRepoDO> = roomRepository.getRoomList({ hotelId: categoryDO.hotelId }, { categoryId: categoryDO.id });
        var queries = [];
        queries.push(getBedListPromise);
        queries.push(getRoomListPromise);

        Promise.all(queries).then((result: any[]) => {
            var bedSearchResult: BedSearchResultRepoDO = result[0];
            var roomSearchResult: RoomSearchResultRepoDO = result[1];

            var roomCategoryStats = new RoomCategoryStatsDO();
            roomCategoryStats.roomCategory = categoryDO;
            roomCategoryStats.noOfRooms = roomSearchResult.roomList.length;

            if (!_.isEmpty(bedSearchResult.bedList)) {
                roomCategoryStats.capacity = new RoomCategoryCapacityDO();
                roomCategoryStats.capacity.rollawayCapacity = this.getBedConfigCapacityByStorageType(categoryDO.bedConfig, bedSearchResult.bedList, BedStorageType.Rollaway);
                roomCategoryStats.capacity.stationaryCapacity = this.getBedConfigCapacityByStorageType(categoryDO.bedConfig, bedSearchResult.bedList, BedStorageType.Stationary);
            }
            else {
                roomCategoryStats.capacity = this.getZeroCapacityCategoryStats();
            }
            resolve(roomCategoryStats);
        }).catch((error: any) => {
            var thError = new ThError(ThStatusCode.RoomAggregatorCategoryStatsError, error);
            if (thError.isNativeError()) {
                ThLogger.getInstance().logError(ThLogLevel.Error, "error computing category stats", categoryDO, thError);
            }
            reject(thError);
        });
    }

    private getBedConfigCapacityByStorageType(bedConfig: BedConfigDO, bedList: BedDO[], bedStorageType: BedStorageType): ConfigCapacityDO {

        var configCapacity = new ConfigCapacityDO();
        configCapacity.noBabies = 0;
        configCapacity.noAdults = 0;
        configCapacity.noChildren = 0;

        var bedListToAggregate: BedDO[] = this.filterBedListByStorageType(bedList, bedStorageType);

        _.forEach(bedListToAggregate, (bed: BedDO) => {
            var bedMeta = _.findWhere(bedConfig.bedMetaList, { bedId: bed.id });

            if (bed.accommodationType === BedAccommodationType.Babies) {
                configCapacity.noBabies += bedMeta.noOfInstances;
            }
            else {
                configCapacity.noAdults += bedMeta.noOfInstances * bed.capacity.maxNoAdults;
                configCapacity.noChildren += bedMeta.noOfInstances * bed.capacity.maxNoChildren;
            }
        });

        return configCapacity;
    }

    private filterBedListByStorageType(bedList: BedDO[], bedStorageType: BedStorageType): BedDO[] {
        switch (bedStorageType) {
            case BedStorageType.Rollaway: return this.getRollawayBeds(bedList);
            case BedStorageType.Stationary: return this.getStationaryBeds(bedList);
            default: return [];
        }
    }

    private getStationaryBeds(bedList: BedDO[]): BedDO[] {
        return _.filter(bedList, (bed: BedDO) => {
            return bed.storageType === BedStorageType.Stationary;
        });
    }

    private getRollawayBeds(bedList: BedDO[]): BedDO[] {
        return _.filter(bedList, (bed: BedDO) => {
            return bed.storageType === BedStorageType.Rollaway;
        });
    }

    private getZeroCapacityCategoryStats(): RoomCategoryCapacityDO {
        var zeroCapacity: RoomCategoryCapacityDO = new RoomCategoryCapacityDO();
        var emptyCapacity = new ConfigCapacityDO();

        emptyCapacity.noAdults = 0;
        emptyCapacity.noBabies = 0;
        emptyCapacity.noChildren = 0;
        zeroCapacity.stationaryCapacity = emptyCapacity;
        zeroCapacity.rollawayCapacity = emptyCapacity;

        return zeroCapacity;
    }
}