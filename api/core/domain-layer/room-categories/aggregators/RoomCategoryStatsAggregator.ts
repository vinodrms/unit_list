import { ThLogger, ThLogLevel } from '../../../utils/logging/ThLogger';
import { ThError } from '../../../utils/th-responses/ThError';
import { ThUtils } from '../../../utils/ThUtils';
import { ThStatusCode } from '../../../utils/th-responses/ThResponse';
import { AppContext } from '../../../utils/AppContext';
import { SessionContext } from '../../../utils/SessionContext';
import { RoomDO } from '../../../data-layer/rooms/data-objects/RoomDO';
import { RoomCategoryDO } from '../../../data-layer/room-categories/data-objects/RoomCategoryDO';
import { BedConfigDO } from '../../../data-layer/room-categories/data-objects/bed-config/BedConfigDO';
import { BedMetaDO } from '../../../data-layer/room-categories/data-objects/bed-config/BedMetaDO';
import { BedDO, BedStorageType, BedAccommodationType } from '../../../data-layer/common/data-objects/bed/BedDO';
import { RoomCategorySearchResultRepoDO } from '../../../data-layer/room-categories/repositories/IRoomCategoryRepository';
import { ConfigCapacityDO } from '../../../data-layer/common/data-objects/bed-config/ConfigCapacityDO';
import { RoomCategoryStatsDO, RoomCategoryCapacityDO } from '../../../data-layer/room-categories/data-objects/RoomCategoryStatsDO';
import { BedStatsDO } from '../../../data-layer/room-categories/data-objects/bed-stats/BedStatsDO';
import { RoomMetaRepoDO, RoomSearchResultRepoDO } from '../../../data-layer/rooms/repositories/IRoomRepository';
import { BedSearchResultRepoDO } from '../../../data-layer/beds/repositories/IBedRepository';

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

        roomRepository.getUsedRoomCategoryIdList({ hotelId: this._sessionContext.sessionDO.hotel.id }).then((categoryIdList: string[]) => {
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

    public getUsedRoomCategoryStatsList(): Promise<RoomCategoryStatsDO[]> {
        return new Promise<RoomCategoryStatsDO[]>((resolve: { (result: RoomCategoryStatsDO[]): void }, reject: { (err: ThError): void }) => {
            this.getUsedRoomCategoryStatsListCore(resolve, reject);
        });
    }
    private getUsedRoomCategoryStatsListCore(resolve: { (result: RoomCategoryStatsDO[]): void }, reject: { (err: ThError): void }) {
        var roomRepository = this._appContext.getRepositoryFactory().getRoomRepository();
        roomRepository.getUsedRoomCategoryIdList({ hotelId: this._sessionContext.sessionDO.hotel.id }).then((usedCategoryIdList: string[]) => {
            return this.getRoomCategoryStatsList(usedCategoryIdList);
        }).then((roomCategoryStatsList: RoomCategoryStatsDO[]) => {
            resolve(roomCategoryStatsList);
        }).catch((error: any) => {
            reject(error);
        });
    }

    public getRoomCategoryStatsList(roomCategoryIdList?: string[]): Promise<RoomCategoryStatsDO[]> {
        return new Promise<RoomCategoryStatsDO[]>((resolve: { (result: RoomCategoryStatsDO[]): void }, reject: { (err: ThError): void }) => {
            this.getRoomCategoryStatsListCore(resolve, reject, roomCategoryIdList);
        });
    }
    private getRoomCategoryStatsListCore(resolve: { (result: RoomCategoryStatsDO[]): void }, reject: { (err: ThError): void }, roomCategoryIdList: string[]) {
        var distinctBedIdList: string[] = [];
        var roomCategoryStatsList: RoomCategoryStatsDO[] = [];

        this.getRoomCategoryList(roomCategoryIdList).then((result: RoomCategorySearchResultRepoDO) => {
            distinctBedIdList = this.getDistinctBedIdListFromRoomCategoryList(result.roomCategoryList);

            _.forEach(result.roomCategoryList, (roomCategory: RoomCategoryDO) => {
                var roomCategoryStats = new RoomCategoryStatsDO();
                roomCategoryStats.roomCategory = roomCategory;
                roomCategoryStatsList.push(roomCategoryStats);
            });

            return this.getRoomListByRoomCategoryIdList(roomCategoryIdList);
        }).then((roomList: RoomDO[]) => {
            let indexedNoRoomsByCategId = this.getIndexedNoOfRoomsIndexedByCategoryId(roomList);

            _.forEach(roomCategoryStatsList, (roomCategoryStats: RoomCategoryStatsDO) => {
                roomCategoryStats.noOfRooms = this.getNoOfRoomsByRoomCategory(roomCategoryStats.roomCategory, indexedNoRoomsByCategId);
            });

            var bedRepo = this._appContext.getRepositoryFactory().getBedRepository();
            return bedRepo.getBedList({ hotelId: this.hotelId }, { bedIdList: distinctBedIdList });
        }).then((result: BedSearchResultRepoDO) => {
            _.forEach(roomCategoryStatsList, (roomCategoryStats: RoomCategoryStatsDO) => {
                let bedConfigDetails = this.getRoomCategoryBedConfigDetails(roomCategoryStats.roomCategory, result.bedList);
                roomCategoryStats.capacity = bedConfigDetails.roomCategCapacity;
                roomCategoryStats.bedStatsList = bedConfigDetails.bedStatsList;
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
    private getNoOfRoomsByRoomCategory(roomCategory: RoomCategoryDO, indexedNoRoomsByCategId: { [index: string]: number; }): number {
        let noOfRooms = indexedNoRoomsByCategId[roomCategory.id];
        if (!this._thUtils.isUndefinedOrNull(noOfRooms)) {
            return noOfRooms;
        }
        return 0;
    }
    private getIndexedNoOfRoomsIndexedByCategoryId(roomList: RoomDO[]): { [index: string]: number; } {
        let indexedNoRoomsByCategId: { [index: string]: number; } = {};
        _.chain(roomList).groupBy('categoryId').forEach((value: RoomDO[], key: string) => {
            indexedNoRoomsByCategId[key] = value.length;
        });
        return indexedNoRoomsByCategId;
    }
    private getRoomCategoryBedConfigDetails(roomCategory: RoomCategoryDO, allBeds: BedDO[]): { roomCategCapacity: RoomCategoryCapacityDO, bedStatsList: BedStatsDO[] } {
        var capacity: RoomCategoryCapacityDO;
        var bedList = this.filterBedListForRoomCategory(roomCategory, allBeds);
        var bedStatsList: BedStatsDO[] = [];
        if (!_.isEmpty(bedList)) {
            capacity = new RoomCategoryCapacityDO();

            let stationaryBedDetails = this.getBedDetailsByStorageType(roomCategory.bedConfig, bedList, BedStorageType.Stationary);
            capacity.stationaryCapacity = stationaryBedDetails.capacity;
            bedStatsList = bedStatsList.concat(stationaryBedDetails.bedStatsList);

            let rollawayBedDetais = this.getBedDetailsByStorageType(roomCategory.bedConfig, bedList, BedStorageType.Rollaway);
            capacity.rollawayCapacity = rollawayBedDetais.capacity;
            bedStatsList = bedStatsList.concat(rollawayBedDetais.bedStatsList);
        }
        else {
            capacity = this.getZeroCapacityCategoryStats();
        }
        return {
            roomCategCapacity: capacity,
            bedStatsList: bedStatsList
        }
    }
    private filterBedListForRoomCategory(roomCategory: RoomCategoryDO, allBeds: BedDO[]): BedDO[] {
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
    private getRoomCategoryList(roomCategoryIdList?: string[]): Promise<RoomCategorySearchResultRepoDO> {
        let roomCategoryRepository = this._appContext.getRepositoryFactory().getRoomCategoryRepository();
        if (this._thUtils.isUndefinedOrNull(roomCategoryIdList)) {
            return roomCategoryRepository.getRoomCategoryList({ hotelId: this.hotelId });
        }
        return roomCategoryRepository.getRoomCategoryList({ hotelId: this.hotelId }, { categoryIdList: roomCategoryIdList });
    }

    private getBedDetailsByStorageType(bedConfig: BedConfigDO, bedList: BedDO[], bedStorageType: BedStorageType): { capacity: ConfigCapacityDO, bedStatsList: BedStatsDO[] } {
        var configCapacity = new ConfigCapacityDO();
        configCapacity.noAdults = 0;
        configCapacity.noChildren = 0;
        configCapacity.noBabies = 0;
        configCapacity.noBabyBeds = 0;

        var bedListToAggregate: BedDO[] = this.filterBedListByStorageType(bedList, bedStorageType);
        var bedStatsList: BedStatsDO[] = [];

        _.forEach(bedListToAggregate, (bed: BedDO) => {
            var bedMeta = _.findWhere(bedConfig.bedMetaList, { bedId: bed.id });

            let bedCapacity = this.getZeroCapacity();
            if (bed.accommodationType === BedAccommodationType.Babies) {
                configCapacity.noBabyBeds += bedMeta.noOfInstances;
                bedCapacity.noBabyBeds = 1;
            }
            else {
                configCapacity.noAdults += bedMeta.noOfInstances * bed.capacity.maxNoAdults;
                configCapacity.noChildren += bedMeta.noOfInstances * bed.capacity.maxNoChildren;
                configCapacity.noBabies += bedMeta.noOfInstances * bed.capacity.maxNoBabies;

                bedCapacity.noAdults = bed.capacity.maxNoAdults;
                bedCapacity.noChildren = bed.capacity.maxNoChildren;
                bedCapacity.noBabies = bed.capacity.maxNoBabies;
            }
            bedStatsList = bedStatsList.concat(this.buildBedStatsList(bedCapacity, bedMeta.noOfInstances, bed));
        });
        return {
            capacity: configCapacity,
            bedStatsList: bedStatsList
        };
    }
    private filterBedListByStorageType(bedList: BedDO[], bedStorageType: BedStorageType): BedDO[] {
        switch (bedStorageType) {
            case BedStorageType.Rollaway: return this.filterRollawayBeds(bedList);
            case BedStorageType.Stationary: return this.filterStationaryBeds(bedList);
            default: return [];
        }
    }
    private filterStationaryBeds(bedList: BedDO[]): BedDO[] {
        return _.filter(bedList, (bed: BedDO) => {
            return bed.storageType === BedStorageType.Stationary;
        });
    }
    private filterRollawayBeds(bedList: BedDO[]): BedDO[] {
        return _.filter(bedList, (bed: BedDO) => {
            return bed.storageType === BedStorageType.Rollaway;
        });
    }
    private buildBedStatsList(bedCapacity: ConfigCapacityDO, noBeds: number, bed: BedDO): BedStatsDO[] {
        var bedStatsList: BedStatsDO[] = [];
        for (var i = 0; i < noBeds; i++) {
            let stats = new BedStatsDO();
            stats.capacity = bedCapacity.buildPrototype();
            stats.storageType = bed.storageType;
            bedStatsList.push(stats);
        }
        return bedStatsList;
    }
    private getZeroCapacityCategoryStats(): RoomCategoryCapacityDO {
        var zeroCapacity: RoomCategoryCapacityDO = new RoomCategoryCapacityDO();
        var emptyCapacity = this.getZeroCapacity();
        zeroCapacity.stationaryCapacity = emptyCapacity;
        zeroCapacity.rollawayCapacity = emptyCapacity;
        return zeroCapacity;
    }
    private getZeroCapacity(): ConfigCapacityDO {
        var emptyCapacity = new ConfigCapacityDO();
        emptyCapacity.noAdults = 0;
        emptyCapacity.noChildren = 0;
        emptyCapacity.noBabies = 0;
        emptyCapacity.noBabyBeds = 0;
        return emptyCapacity;
    }
    private get hotelId(): string {
        return this._sessionContext.sessionDO.hotel.id;
    }
}