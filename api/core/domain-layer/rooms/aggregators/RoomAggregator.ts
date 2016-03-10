import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThUtils} from '../../../utils/ThUtils';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {RoomDO} from '../../../data-layer/rooms/data-objects/RoomDO';
import {RoomCategoryDO} from '../../../data-layer/room-categories/data-objects/RoomCategoryDO';
import {BedDO} from '../../../data-layer/common/data-objects/bed/BedDO';
import {RoomCategorySearchResultRepoDO} from '../../../data-layer/room-categories/repositories/IRoomCategoryRepository';
import {RoomCategoryStatsDO} from './data-objects/RoomCategoryStatsDO';
import {RoomStatsDO} from './data-objects/RoomStatsDO';
import {RoomMetaRepoDO, RoomSearchResultRepoDO} from '../../../data-layer/rooms/repositories/IRoomRepository';

import _ = require('underscore');

export interface RoomAggregatorMetaDO {
    hotelId: string;
}

export class RoomAggregator {
    private _thUtils: ThUtils;

    constructor(private _appContext: AppContext) {
        this._thUtils = new ThUtils();
    }

    public getUsedRoomCategoryList(roomAggregatorMeta: RoomAggregatorMetaDO): Promise<RoomCategoryDO[]> {
        return new Promise<RoomCategoryDO[]>((resolve: { (result: RoomCategoryDO[]): void }, reject: { (err: ThError): void }) => {
            this.getUsedRoomCategoryListCore(resolve, reject, roomAggregatorMeta);
        });
    }

    private getUsedRoomCategoryListCore(resolve: { (result: RoomCategoryDO[]): void }, reject: { (err: ThError): void }, roomAggregatorMeta: RoomAggregatorMetaDO) {
        var roomRepository = this._appContext.getRepositoryFactory().getRoomRepository();
        var roomCategoryRepository = this._appContext.getRepositoryFactory().getRoomCategoryRepository();

        roomRepository.getRoomCategoryIdList({ hotelId: roomAggregatorMeta.hotelId }).then((categoryIdList: string[]) => {
            return roomCategoryRepository.getRoomCategoryList({ hotelId: roomAggregatorMeta.hotelId }, { categoryIdList: categoryIdList });
        }).then((result: RoomCategorySearchResultRepoDO) => {
            resolve(result.roomCategoryList);
        }).catch((error: any) => {
            var thError = new ThError(ThStatusCode.RoomAggregatorGetUsedCategoriesError, error);
            if (thError.isNativeError()) {
                ThLogger.getInstance().logError(ThLogLevel.Error, "error retrieving distinct room categories for the hotel", roomAggregatorMeta, thError);
            }
            reject(thError);
        });
    }

    public getRoomCategoryStatsList(roomAggregatorMeta: RoomAggregatorMetaDO, roomCategoryIdList: string[]): Promise<RoomCategoryStatsDO[]> {
        return new Promise<RoomCategoryStatsDO[]>((resolve: { (result: RoomCategoryStatsDO[]): void }, reject: { (err: ThError): void }) => {
            this.getRoomCategoryStatsListCore(resolve, reject, roomAggregatorMeta, roomCategoryIdList);
        });
    }

    private getRoomCategoryStatsListCore(resolve: { (result: RoomCategoryStatsDO[]): void }, reject: { (err: ThError): void }, roomAggregatorMeta: RoomAggregatorMetaDO, roomCategoryIdList: string[]) {
        var roomRepository = this._appContext.getRepositoryFactory().getRoomRepository();
        var roomCategoryRepository = this._appContext.getRepositoryFactory().getRoomCategoryRepository();
        roomCategoryRepository.getRoomCategoryList({ hotelId: roomAggregatorMeta.hotelId }, { categoryIdList: roomCategoryIdList }).then((result: RoomCategorySearchResultRepoDO) => {
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
        roomRepository.getRoomList({ hotelId: categoryDO.hotelId }, { categoryId: categoryDO.id }).then((result: RoomSearchResultRepoDO) => {
            var computeRoomStatsPromiseList = [];
            result.roomList.forEach((room) => {
                computeRoomStatsPromiseList.push(this.getRoomStats(room));
            });
            return Promise.all(computeRoomStatsPromiseList);
        }).then((roomStatsList: RoomStatsDO[]) => {
            var roomCategoryStats = new RoomCategoryStatsDO();
            roomCategoryStats.roomCategory = categoryDO;
            roomCategoryStats.maxNoAdults = _.max(roomStatsList, (roomStats) => {
                return roomStats.maxNoAdults;
            }).maxNoAdults;
            roomCategoryStats.maxNoChildren = _.max(roomStatsList, (roomStats) => {
                return roomStats.maxNoChildren;
            }).maxNoChildren;
            resolve(roomCategoryStats);
        }).catch((error: any) => {
            var thError = new ThError(ThStatusCode.RoomAggregatorCategoryStatsError, error);
            if (thError.isNativeError()) {
                ThLogger.getInstance().logError(ThLogLevel.Error, "error computing category stats", categoryDO, thError);
            }
            reject(thError);
        });
    }

    private getRoomStats(roomDO: RoomDO): Promise<RoomStatsDO> {
        return new Promise<RoomStatsDO>((resolve: { (result: RoomStatsDO): void }, reject: { (err: ThError): void }) => {
            this.getRoomStatsCore(resolve, reject, roomDO);
        });
    }

    private getRoomStatsCore(resolve: { (result: RoomStatsDO): void }, reject: { (err: ThError): void }, roomDO: RoomDO) {
        var bedRepository = this._appContext.getRepositoryFactory().getBedRepository();

        bedRepository.getBedList({ hotelId: roomDO.hotelId }, { bedIdList: roomDO.bedIdList }).then((bedList: BedDO[]) => {
            var noOfAdults = bedList.reduce((sum, bed) => {
                return sum + bed.maxNoAdults;
            }, 0);

            var noOfChildren = bedList.reduce((sum, bed) => {
                return sum + bed.maxNoChildren;
            }, 0);

            var roomStats = new RoomStatsDO();
            roomStats.room = roomDO;
            roomStats.maxNoAdults = noOfAdults;
            roomStats.maxNoChildren = noOfChildren;
            resolve(roomStats);
        }).catch((error: any) => {
            var thError = new ThError(ThStatusCode.RoomAggregatorRoomStatsError, error);
            if (thError.isNativeError()) {
                ThLogger.getInstance().logError(ThLogLevel.Error, "error computing room stats", roomDO, thError);
            }
            reject(thError);
        });
    }
}