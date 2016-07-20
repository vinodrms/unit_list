import {BaseController} from './base/BaseController';
import {ThStatusCode} from '../core/utils/th-responses/ThResponse';
import {AppContext} from '../core/utils/AppContext';
import {SessionContext} from '../core/utils/SessionContext';
import {AssignRoom} from '../core/domain-layer/hotel-operations/room/assign/AssignRoom';
import {AssignRoomDO} from '../core/domain-layer/hotel-operations/room/assign/AssignRoomDO';
import {BookingDO} from '../core/data-layer/bookings/data-objects/BookingDO';
import {CheckOutRoom} from '../core/domain-layer/hotel-operations/room/check-out/CheckOutRoom';
import {ChangeRoomMaintenanceStatus} from '../core/domain-layer/hotel-operations/room/change-maintenance-status/ChangeRoomMaintenanceStatus';
import {RoomDO} from '../core/data-layer/rooms/data-objects/RoomDO';

class HotelRoomOperationsController extends BaseController {

    public checkIn(req: Express.Request, res: Express.Response) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var assignRoom = new AssignRoom(appContext, sessionContext);
        assignRoom.checkIn(req.body.assignRoom).then((booking: BookingDO) => {
            booking.bookingHistory.translateActions(this.getThTranslation(sessionContext));
            this.returnSuccesfulResponse(req, res, { booking: BookingDO });
        }).catch((error: any) => {
            this.returnErrorResponse(req, res, error, ThStatusCode.HotelRoomOperationsControllerErrorCheckingIn);
        });
    }

    public reserveRoom(req: Express.Request, res: Express.Response) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var assignRoom = new AssignRoom(appContext, sessionContext);
        assignRoom.reserveRoom(req.body.assignRoom).then((booking: BookingDO) => {
            booking.bookingHistory.translateActions(this.getThTranslation(sessionContext));
            this.returnSuccesfulResponse(req, res, { booking: BookingDO });
        }).catch((error: any) => {
            this.returnErrorResponse(req, res, error, ThStatusCode.HotelRoomOperationsControllerErrorReservingRoom);
        });
    }

    public changeRoom(req: Express.Request, res: Express.Response) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var assignRoom = new AssignRoom(appContext, sessionContext);
        assignRoom.changeRoom(req.body.assignRoom).then((booking: BookingDO) => {
            booking.bookingHistory.translateActions(this.getThTranslation(sessionContext));
            this.returnSuccesfulResponse(req, res, { booking: BookingDO });
        }).catch((error: any) => {
            this.returnErrorResponse(req, res, error, ThStatusCode.HotelRoomOperationsControllerErrorChangingRoom);
        });
    }

    public checkOut(req: Express.Request, res: Express.Response) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var checkOutRoom = new CheckOutRoom(appContext, sessionContext);
        checkOutRoom.checkOut(req.body.checkOutRoom).then((booking: BookingDO) => {
            booking.bookingHistory.translateActions(this.getThTranslation(sessionContext));
            this.returnSuccesfulResponse(req, res, { booking: BookingDO });
        }).catch((error: any) => {
            this.returnErrorResponse(req, res, error, ThStatusCode.HotelRoomOperationsControllerErrorCheckingOut);
        });
    }

    public changeMaintenanceStatus(req: Express.Request, res: Express.Response) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var changeMaintenanceStatus = new ChangeRoomMaintenanceStatus(appContext, sessionContext);
        changeMaintenanceStatus.changeStatus(req.body.room).then((updatedRoom: RoomDO) => {
            updatedRoom.maintenanceHistory.translateActions(this.getThTranslation(sessionContext));
            this.returnSuccesfulResponse(req, res, { room: RoomDO });
        }).catch((error: any) => {
            this.returnErrorResponse(req, res, error, ThStatusCode.HotelRoomOperationsControllerErrorChangingMaintenanceStatus);
        });
    }
}

var hotelRoomOperationsController = new HotelRoomOperationsController();
module.exports = {
    checkIn: hotelRoomOperationsController.checkIn.bind(hotelRoomOperationsController),
    reserveRoom: hotelRoomOperationsController.reserveRoom.bind(hotelRoomOperationsController),
    changeRoom: hotelRoomOperationsController.changeRoom.bind(hotelRoomOperationsController),
    checkOut: hotelRoomOperationsController.checkOut.bind(hotelRoomOperationsController),
    changeMaintenanceStatus: hotelRoomOperationsController.changeMaintenanceStatus.bind(hotelRoomOperationsController)
}