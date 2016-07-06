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

export class RoomCategoryStatsAggregator {
    private _thUtils: ThUtils;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();
    }
    public getUsedRoomCategoryList(): Promise<RoomCategoryDO[]> {
        return new Promise<RoomCategoryDO[]>((resolve: { (result: RoomCategoryDO[]): void }, reject: { (err: ThError): void }) => {
            this.getUsedRoomCategoryListCore(resolve, reject);
        });
    }
    private getUsedRoomCategoryListCore(resolve: { (result: RoomCategoryDO[]): void }, reject: { (err: ThError): void }) {
        var roomRepository = this._appContext.getRepositoryFactory().getRoomRepository();
        var roomCategoryRepository = this._appContext.getRepositoryFactory().getRoomCategoryRepository();

        roomRepository.getRoomCategoryIdList({ hotelId: this._sessionContext.sessionDO.hotel.id }).then((categoryIdList: string[]) => {
            return roomCategoryRepository.getRoomCategoryList({ hotelId: this.hotelId }, { categoryIdList: categoryIdList });
        }).then((result: RoomCategorySearchResultRepoDO) => {
            resolve(result.roomCategoryList);
        }).catch((error: any) => {
            var thError = new ThError(ThStatusCode.RoomAggregatorGetUsedCategoriesError, error);
            if (thError.isNativeError()) {
                ThLogger.getInstance().logError(ThLogLevel.Error, "error retrieving distinct room categories for the hotel", { hotelId: this.hotelId }, thError);
            }
            reject(thError);
        });
    }
    public getRoomCategoryStatsList(roomCategoryIdList?: string[]): Promise<RoomCategoryStatsDO[]> {
        return new Promise<RoomCategoryStatsDO[]>((resolve: { (result: RoomCategoryStatsDO[]): void }, reject: { (err: ThError): void }) => {
            this.getRoomCategoryStatsListCore(resolve, reject, roomCategoryIdList);
        });
    }
    private getRoomCategoryStatsListCore(resolve: { (result: RoomCategoryStatsDO[]): void }, reject: { (err: ThError): void }, roomCategoryIdList: string[]) {
        var distinctBedIdList = [];
        var roomCategoryStatsList = [];

        this.getRoomCategoryList(roomCategoryIdList).then((result: RoomCategorySearchResultRepoDO) => {
            distinctBedIdList = this.getDistinctBedIdListFromRoomCategoryList(result.roomCategoryList);

            _.forEach(result.roomCategoryList, (roomCategory: RoomCategoryDO) => {
                var roomCategoryStats = new RoomCategoryStatsDO();
                roomCategoryStats.roomCategory = roomCategory;
                roomCategoryStatsList.push(roomCategoryStats);
            });

            return this.getRoomListByRoomCategoryIdList(roomCategoryIdList);
        }).then((roomList: RoomDO[]) => {
            var noOfRoomStatsList = this.getNoOfRoomsStatsGroupedByCategoryId(roomList);

            _.forEach(roomCategoryStatsList, (roomCategoryStats: RoomCategoryStatsDO) => {
                roomCategoryStats.noOfRooms = this.getNoOfRoomsByRoomCategory(roomCategoryStats.roomCategory, noOfRoomStatsList);
            });

            var bedRepo = this._appContext.getRepositoryFactory().getBedRepository();
            return bedRepo.getBedList({ hotelId: this.hotelId }, { bedIdList: distinctBedIdList });
        }).then((result: BedSearchResultRepoDO) => {
            _.forEach(roomCategoryStatsList, (roomCategoryStats: RoomCategoryStatsDO) => {
                roomCategoryStats.capacity = this.getRoomCategoryBedConfigCapacity(roomCategoryStats.roomCategory, result.bedList);
            });

            resolve(roomCategoryStatsList);
        }).catch((error: any) => {
            var thError = new ThError(ThStatusCode.RoomAggregatorCategoryStatsListError, error);
            if (thError.isNativeError()) {
                ThLogger.getInstance().logError(ThLogLevel.Error, "error computing category list stats", null, thError);
            }
            reject(thError);
        });
    }
    private getDistinctBedIdListFromRoomCategoryList(roomCategoryList: RoomCategoryDO[]): string[] {
        return _.chain(roomCategoryList).map((roomCategory: RoomCategoryDO) => {
            return roomCategory.bedConfig.bedMetaList;
        }).flatten().map((bedMeta: BedMetaDO) => {
            return bedMeta.bedId;
        }).flatten().uniq().value();
    }
    private getNoOfRoomsByRoomCategory(roomCategory: RoomCategoryDO, noOfRoomsStatsList: any[]): number {
        var noOfRoomsStats = _.find(noOfRoomsStatsList, ((noOfRoomsStats: any) => {
            return noOfRoomsStats.categoryId === roomCategory.id;
        }));
        if (!this._thUtils.isUndefinedOrNull(noOfRoomsStats)) {
            return noOfRoomsStats.noOfRooms;
        }
        return 0;
    }
    private getNoOfRoomsStatsGroupedByCategoryId(roomList: RoomDO[]): any[] {
        return _.chain(roomList)
            .groupBy('categoryId')
            .map(function (value, key) {
                return {
                    categoryId: key,
                    noOfRooms: value.length
                }
            }).value();
    }
    private getRoomCategoryBedConfigCapacity(roomCategory: RoomCategoryDO, allBeds: BedDO[]): RoomCategoryCapacityDO {
        var capacity: RoomCategoryCapacityDO;
        var bedList = this.getBedListFromRommCategory(roomCategory, allBeds);
        if (!_.isEmpty(bedList)) {
            capacity = new RoomCategoryCapacityDO();
            capacity.rollawayCapacity = this.getBedConfigCapacityByStorageType(roomCategory.bedConfig, bedList, BedStorageType.Rollaway);
            capacity.stationaryCapacity = this.getBedConfigCapacityByStorageType(roomCategory.bedConfig, bedList, BedStorageType.Stationary);
        }
        else {
            capacity = this.getZeroCapacityCategoryStats();
        }
        return capacity;
    }
    private getBedListFromRommCategory(roomCategory: RoomCategoryDO, allBeds: BedDO[]): BedDO[] {
        var bedIdList = _.map(roomCategory.bedConfig.bedMetaList, (bedMeta: BedMetaDO) => {
            return bedMeta.bedId;
        });
        return _.filter(allBeds, (bed: BedDO) => {
            return _.contains(bedIdList, bed.id);
        });
    }
    private getRoomListByRoomCategoryIdList(roomCategoryIdList: string[]): Promise<RoomDO[]> {
        return new Promise<RoomDO[]>((resolve: { (result: RoomDO[]): void }, reject: { (err: ThError): void }) => {
            this.getRoomListByRoomCategoryIdListCore(resolve, reject, roomCategoryIdList);
        });
    }
    private getRoomListByRoomCategoryIdListCore(resolve: { (result: RoomDO[]): void }, reject: { (err: ThError): void }, roomCategoryIdList: string[]) {
        var roomRepository = this._appContext.getRepositoryFactory().getRoomRepository();
        roomRepository.getRoomList({ hotelId: this._sessionContext.sessionDO.hotel.id }, { categoryIdList: roomCategoryIdList, maintenanceStatusList: RoomDO.inInventoryMaintenanceStatusList }).then((result: RoomSearchResultRepoDO) => {
            resolve(result.roomList);
        }).catch((error: any) => {
            var thError = new ThError(ThStatusCode.RoomAggregatorGetRoomsByCategoryIdListError, error);
            if (thError.isNativeError()) {
                ThLogger.getInstance().logError(ThLogLevel.Error, "error getting rooms by category id list", { roomCategoryIdList: roomCategoryIdList }, thError);
            }
            reject(thError);
        });
    }
    private getRoomCategoryList(roomCategoryIdList?: string[]) {
        return new Promise<RoomCategorySearchResultRepoDO>((resolve: { (result: RoomCategorySearchResultRepoDO): void }, reject: { (err: ThError): void }) => {
            this.getRoomCategoryListCore(resolve, reject, roomCategoryIdList);
        });
    }
    private getRoomCategoryListCore(resolve: { (result: RoomCategorySearchResultRepoDO): void }, reject: { (err: ThError): void }, roomCategoryIdList?: string[]) {
        var roomRepository = this._appContext.getRepositoryFactory().getRoomRepository();
        var roomCategoryRepository = this._appContext.getRepositoryFactory().getRoomCategoryRepository();

        var roomCategoriesPromise: Promise<RoomCategorySearchResultRepoDO>;

        if (this._thUtils.isUndefinedOrNull(roomCategoryIdList)) {
            roomCategoriesPromise = roomCategoryRepository.getRoomCategoryList({ hotelId: this.hotelId });
        }
        else {
            roomCategoriesPromise = roomCategoryRepository.getRoomCategoryList({ hotelId: this.hotelId }, { categoryIdList: roomCategoryIdList });
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
    private get hotelId(): string {
        return this._sessionContext.sessionDO.hotel.id;
    }
}