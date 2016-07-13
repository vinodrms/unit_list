import {BaseController} from './base/BaseController';
import {ThStatusCode} from '../core/utils/th-responses/ThResponse';
import {AppContext} from '../core/utils/AppContext';
import {SessionContext} from '../core/utils/SessionContext';
import {SaveRoomItem} from '../core/domain-layer/rooms/SaveRoomItem';
import {RoomCategoryStatsAggregator} from '../core/domain-layer/room-categories/aggregators/RoomCategoryStatsAggregator';
import {DeleteRoomItem} from '../core/domain-layer/rooms/DeleteRoomItem';
import {RoomMetaRepoDO, RoomSearchResultRepoDO} from '../core/data-layer/rooms/repositories/IRoomRepository';
import {RoomDO} from '../core/data-layer/rooms/data-objects/RoomDO';
import {RoomCategoryDO} from '../core/data-layer/room-categories/data-objects/RoomCategoryDO';
import {LazyLoadRepoDO, LazyLoadMetaResponseRepoDO} from '../core/data-layer/common/repo-data-objects/LazyLoadRepoDO';

class RoomsController extends BaseController {

    public getRoomList(req: Express.Request, res: Express.Response) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var roomMeta = this.getRoomMetaRepoDOFrom(sessionContext);
		var roomRepo = appContext.getRepositoryFactory().getRoomRepository();
		roomRepo.getRoomList(roomMeta, req.body.searchCriteria, req.body.lazyLoad).then((rooms: RoomSearchResultRepoDO) => {
			this.returnSuccesfulResponse(req, res, rooms);
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.RoomsControllerErrorGettingRooms);
		});
	}

    public getRoomListCount(req: Express.Request, res: Express.Response) {
		var appContext: AppContext = req.appContext;
		var sessionContext: SessionContext = req.sessionContext;

		var roomMeta = this.getRoomMetaRepoDOFrom(sessionContext);
		var roomRepo = appContext.getRepositoryFactory().getRoomRepository();
		roomRepo.getRoomListCount(roomMeta, req.body.searchCriteria).then((lazyLoadMeta: LazyLoadMetaResponseRepoDO) => {
			this.returnSuccesfulResponse(req, res, lazyLoadMeta);
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.RoomsControllerErrorGettingCount);
		});
	}

    public saveRoomItem(req: Express.Request, res: Express.Response) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

		var saveRoomItem = new SaveRoomItem(appContext, sessionContext);
		saveRoomItem.save(req.body.room).then((updatedRoom: RoomDO) => {
			this.returnSuccesfulResponse(req, res, { room: updatedRoom });
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.RoomsControllerErrorSavingRoom);
		});
	}

    public deleteRoomItem(req: Express.Request, res: Express.Response) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

		var deleteRoomItem = new DeleteRoomItem(appContext, sessionContext);
		deleteRoomItem.delete(req.body.room).then((deletedRoom: RoomDO) => {
			this.returnSuccesfulResponse(req, res, { room: deletedRoom });
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.RoomsControllerErrorDeletingRoom);
		});
	}

    public getRoomById(req: Express.Request, res: Express.Response) {
		if (!this.precheckGETParameters(req, res, ['id'])) { return };

        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

		var roomId = req.query.id;
		var roomMeta = this.getRoomMetaRepoDOFrom(sessionContext);

		var roomRepo = appContext.getRepositoryFactory().getRoomRepository();
		roomRepo.getRoomById(roomMeta, roomId).then((room: RoomDO) => {
			this.returnSuccesfulResponse(req, res, { room: room });
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.RoomsControllerErrorGettingRoomById);
		});
	}

    public getUsedRoomCategoryList(req: Express.Request, res: Express.Response) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var roomAggregator = new RoomCategoryStatsAggregator(appContext, sessionContext);

        roomAggregator.getUsedRoomCategoryList().then((roomCategoryList: RoomCategoryDO[]) => {
			this.returnSuccesfulResponse(req, res, { result: { roomCategoryList: roomCategoryList } });
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.RoomsControllerErrorGettingRoomCategories);
		});
    }

    private getRoomMetaRepoDOFrom(sessionContext: SessionContext): RoomMetaRepoDO {
		return { hotelId: sessionContext.sessionDO.hotel.id };
	}
}

var roomsController = new RoomsController();
module.exports = {
    getRoomById: roomsController.getRoomById.bind(roomsController),
	getRoomList: roomsController.getRoomList.bind(roomsController),
    getRoomListCount: roomsController.getRoomListCount.bind(roomsController),
    saveRoomItem: roomsController.saveRoomItem.bind(roomsController),
    deleteRoomItem: roomsController.deleteRoomItem.bind(roomsController),
    getUsedRoomCategoryList: roomsController.getUsedRoomCategoryList.bind(roomsController)
}