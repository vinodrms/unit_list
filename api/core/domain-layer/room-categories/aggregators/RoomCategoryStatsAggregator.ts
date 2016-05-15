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
import {RoomCategoryStatsDO, RoomCategoryCapacityDO, BedConfigCapacityDO} from '../../../data-layer/room-categories/data-objects/RoomCategoryStatsDO';
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

    public getRoomCategoryStatsList(roomCategoryAggregatorMeta: RoomCategoryStatsAggregatorMetaDO, roomCategoryIdList: string[]): Promise<RoomCategoryStatsDO[]> {
        return new Promise<RoomCategoryStatsDO[]>((resolve: { (result: RoomCategoryStatsDO[]): void }, reject: { (err: ThError): void }) => {
            this.getRoomCategoryStatsListCore(resolve, reject, roomCategoryAggregatorMeta, roomCategoryIdList);
        });
    }

    private getRoomCategoryStatsListCore(resolve: { (result: RoomCategoryStatsDO[]): void }, reject: { (err: ThError): void }, roomCategoryAggregatorMeta: RoomCategoryStatsAggregatorMetaDO, roomCategoryIdList: string[]) {
        var roomRepository = this._appContext.getRepositoryFactory().getRoomRepository();
        var roomCategoryRepository = this._appContext.getRepositoryFactory().getRoomCategoryRepository();
        roomCategoryRepository.getRoomCategoryList({ hotelId: roomCategoryAggregatorMeta.hotelId }, { categoryIdList: roomCategoryIdList }).then((result: RoomCategorySearchResultRepoDO) => {
            if (_.isEmpty(result.roomCategoryList) || roomCategoryIdList.length != result.roomCategoryList.length) {
                var thError = new ThError(ThStatusCode.RoomAggregatorCategoryStatsListInvalidCatgoryIdListError, null);
                ThLogger.getInstance().logError(ThLogLevel.Error, "Invalid category id list", { categoryIdList: roomCategoryIdList }, thError);
                reject(thError);
                return;
            }

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
                ThLogger.getInstance().logError(ThLogLevel.Error, "error computing category list stats", roomCategoryIdList, thError);
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

    private getBedConfigCapacityByStorageType(bedConfig: BedConfigDO, bedList: BedDO[], bedStorageType: BedStorageType): BedConfigCapacityDO {

        var bedConfigCapacity = new BedConfigCapacityDO();
        bedConfigCapacity.maxNoBabies = 0;
        bedConfigCapacity.maxNoAdults = 0;
        bedConfigCapacity.maxNoChildren = 0;
        
        var bedListToAggregate: BedDO[] = this.filterBedListByStorageType(bedList, bedStorageType);

        _.forEach(bedListToAggregate, (bed: BedDO) => {
            var bedMeta = _.findWhere(bedConfig.bedMetaList, { bedId: bed.id });

            if (bed.accommodationType === BedAccommodationType.Babies) {
                bedConfigCapacity.maxNoBabies += bedMeta.noOfInstances;
            }
            else {
                bedConfigCapacity.maxNoAdults += bedMeta.noOfInstances * bed.capacity.maxNoAdults;
                bedConfigCapacity.maxNoChildren += bedMeta.noOfInstances * bed.capacity.maxNoChildren;
            }
        });

        return bedConfigCapacity;
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
        var emptyCapacity = new BedConfigCapacityDO();

        emptyCapacity.maxNoAdults = 0;
        emptyCapacity.maxNoBabies = 0;
        emptyCapacity.maxNoChildren = 0;
        zeroCapacity.stationaryCapacity = emptyCapacity;
        zeroCapacity.rollawayCapacity = emptyCapacity;

        return zeroCapacity;
    }
}