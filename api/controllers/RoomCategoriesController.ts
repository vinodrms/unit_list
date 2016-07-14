import {BaseController} from './base/BaseController';
import {ThStatusCode} from '../core/utils/th-responses/ThResponse';
import {AppContext} from '../core/utils/AppContext';
import {SessionContext} from '../core/utils/SessionContext';
import {RoomCategoryStatsAggregator} from '../core/domain-layer/room-categories/aggregators/RoomCategoryStatsAggregator';
import {RoomCategoryStatsDO} from '../core/data-layer/room-categories/data-objects/RoomCategoryStatsDO';
import {DeleteRoomCategoryItem} from '../core/domain-layer/room-categories/DeleteRoomCategoryItem';
import {SaveRoomCategoryItem} from '../core/domain-layer/room-categories/SaveRoomCategoryItem';
import {RoomDO} from '../core/data-layer/rooms/data-objects/RoomDO';
import {RoomCategoryDO} from '../core/data-layer/room-categories/data-objects/RoomCategoryDO';
import {RoomCategoryMetaRepoDO, RoomCategorySearchResultRepoDO} from '../core/data-layer/room-categories/repositories/IRoomCategoryRepository';
import {ThUtils} from '../core/utils/ThUtils';

class RoomCategoriesController extends BaseController {

    public getRoomCategoryList(req: Express.Request, res: Express.Response) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var roomCategoryMeta = this.getRoomCategoryMetaRepoDOFrom(sessionContext);
        var roomCategoryRepo = appContext.getRepositoryFactory().getRoomCategoryRepository();
        roomCategoryRepo.getRoomCategoryList(roomCategoryMeta).then((result: RoomCategorySearchResultRepoDO) => {
            this.returnSuccesfulResponse(req, res, { result: result });
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, ThStatusCode.RoomsControllerErrorGettingRooms);
        });
    }

    public saveRoomCategoryItem(req: Express.Request, res: Express.Response) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var saveRoomcategoryItem = new SaveRoomCategoryItem(appContext, sessionContext);
        saveRoomcategoryItem.save(req.body.roomCategory).then((updatedRoomCategory: RoomCategoryDO) => {
            this.returnSuccesfulResponse(req, res, { roomCategory: updatedRoomCategory });
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, ThStatusCode.RoomCategoriesControllerErrorSavingRoomCategory);
        });
    }

    public deleteRoomCategoryItem(req: Express.Request, res: Express.Response) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var deleteRoomItem = new DeleteRoomCategoryItem(appContext, sessionContext);
        deleteRoomItem.delete(req.body.roomCategory).then((deletedRoomCategory: RoomCategoryDO) => {
            this.returnSuccesfulResponse(req, res, { roomCategory: deletedRoomCategory });
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, ThStatusCode.RoomCategoriesControllerErrorDeletingRoomCategory);
        });
    }

    public getRoomCategoryById(req: Express.Request, res: Express.Response) {
        if (!this.precheckGETParameters(req, res, ['id'])) { return };

        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var roomCategoryId = req.query.id;
        var roomCategoryMeta = this.getRoomCategoryMetaRepoDOFrom(sessionContext);

        var roomCategoryRepo = appContext.getRepositoryFactory().getRoomCategoryRepository();
        roomCategoryRepo.getRoomCategoryById(roomCategoryMeta, roomCategoryId).then((roomCategory: RoomCategoryDO) => {
            this.returnSuccesfulResponse(req, res, { roomCategory: roomCategory });
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, ThStatusCode.RoomCategoriesControllerErrorGettingRoomCategoryById);
        });
    }

    public getRoomCategoryStatsList(req: Express.Request, res: Express.Response) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var roomCategStatsAggregator = new RoomCategoryStatsAggregator(appContext, sessionContext);
        var roomCategoryIdList = req.body.roomCategoryIdList;

        roomCategStatsAggregator.getRoomCategoryStatsList(req.body.roomCategoryIdList).then((roomCategoryStatsList: RoomCategoryStatsDO[]) => {
            this.returnSuccesfulResponse(req, res, { roomCategoryStatsList: roomCategoryStatsList });
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, ThStatusCode.RoomCategoriesControllerErrorGettingRoomCategoriesStats);
        });
    }

    public geUsedRoomCategoryStatsList(req: Express.Request, res: Express.Response) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var roomCategStatsAggregator = new RoomCategoryStatsAggregator(appContext, sessionContext);
        roomCategStatsAggregator.getUsedRoomCategoryStatsList().then((roomCategoryStatsList: RoomCategoryStatsDO[]) => {
            this.returnSuccesfulResponse(req, res, { roomCategoryStatsList: roomCategoryStatsList });
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, ThStatusCode.RoomCategoriesControllerErrorGettingUsedRoomCategoriesStats);
        });
    }

    private getRoomCategoryMetaRepoDOFrom(sessionContext: SessionContext): RoomCategoryMetaRepoDO {
        return { hotelId: sessionContext.sessionDO.hotel.id };
    }
}

var roomCategoriesController = new RoomCategoriesController();
module.exports = {
    getRoomCategoryList: roomCategoriesController.getRoomCategoryList.bind(roomCategoriesController),
    saveRoomCategoryItem: roomCategoriesController.saveRoomCategoryItem.bind(roomCategoriesController),
    deleteRoomCategoryItem: roomCategoriesController.deleteRoomCategoryItem.bind(roomCategoriesController),
    getRoomCategoryById: roomCategoriesController.getRoomCategoryById.bind(roomCategoriesController),
    getRoomCategoryStatsList: roomCategoriesController.getRoomCategoryStatsList.bind(roomCategoriesController),
    geUsedRoomCategoryStatsList: roomCategoriesController.geUsedRoomCategoryStatsList.bind(roomCategoriesController),
}