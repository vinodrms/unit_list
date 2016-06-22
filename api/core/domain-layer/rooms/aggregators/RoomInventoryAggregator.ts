import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {RoomsInventoryContainer} from './results/RoomsInventoryContainer';
import {RoomSearchResultRepoDO} from '../../../data-layer/rooms/repositories/IRoomRepository';
import {RoomDO} from '../../../data-layer/rooms/data-objects/RoomDO';
import {RoomCategorySearchResultRepoDO} from '../../../data-layer/room-categories/repositories/IRoomCategoryRepository';

export class RoomInventoryAggregator {
    private _loadedRoomList: RoomDO[];

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
    }

    public aggregateRooms(): Promise<RoomsInventoryContainer> {
        return new Promise<RoomsInventoryContainer>((resolve: { (result: RoomsInventoryContainer): void }, reject: { (err: ThError): void }) => {
            this.aggregateRoomsCore(resolve, reject);
        });
    }
    private aggregateRoomsCore(resolve: { (result: RoomsInventoryContainer): void }, reject: { (err: ThError): void }) {
        var roomsRepo = this._appContext.getRepositoryFactory().getRoomRepository();
        roomsRepo.getRoomList({ hotelId: this._sessionContext.sessionDO.hotel.id })
            .then((roomSearchResult: RoomSearchResultRepoDO) => {
                this._loadedRoomList = roomSearchResult.roomList;

                var roomCategoryIdList = this.getUniqueRoomCategoryIdList();
                var roomCategoryRepository = this._appContext.getRepositoryFactory().getRoomCategoryRepository();
                return roomCategoryRepository.getRoomCategoryList({ hotelId: this._sessionContext.sessionDO.hotel.id }, { categoryIdList: roomCategoryIdList });
            }).then((roomCategSearchResult: RoomCategorySearchResultRepoDO) => {
                var roomsInventoryContainer = new RoomsInventoryContainer(this._loadedRoomList, roomCategSearchResult.roomCategoryList);
                resolve(roomsInventoryContainer);
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.RoomInventoryAggregatorError, error);
                if (thError.isNativeError()) {
                    ThLogger.getInstance().logError(ThLogLevel.Error, "error aggregating the rooms", this._sessionContext, thError);
                }
                reject(thError);
            });
    }
    private getUniqueRoomCategoryIdList(): string[] {
        return _.uniq(_.map(this._loadedRoomList, (room: RoomDO) => { return room.categoryId }));
    }
}