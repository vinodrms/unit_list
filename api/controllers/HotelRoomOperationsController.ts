import { BaseController } from './base/BaseController';
import { ThStatusCode } from '../core/utils/th-responses/ThResponse';
import { AppContext } from '../core/utils/AppContext';
import { SessionContext } from '../core/utils/SessionContext';
import { AssignRoom } from '../core/domain-layer/hotel-operations/room/assign/AssignRoom';
import { AssignRoomDO } from '../core/domain-layer/hotel-operations/room/assign/AssignRoomDO';
import { BookingDO } from '../core/data-layer/bookings/data-objects/BookingDO';
import { CheckOutRoom } from '../core/domain-layer/hotel-operations/room/check-out/CheckOutRoom';
import { ChangeRoomMaintenanceStatus } from '../core/domain-layer/hotel-operations/room/change-maintenance-status/ChangeRoomMaintenanceStatus';
import { ChangeRollawayBedStatus } from '../core/domain-layer/hotel-operations/room/change-rollaway-bed-status/ChangeRollawayBedStatus';
import { RoomDO } from '../core/data-layer/rooms/data-objects/RoomDO';
import { RoomAttachedBooking } from '../core/domain-layer/hotel-operations/room/attached-booking/RoomAttachedBooking';
import { RoomAttachedBookingDO } from '../core/domain-layer/hotel-operations/room/attached-booking/RoomAttachedBookingDO';
import { RoomAttachedBookingResult, RoomAttachedBookingResultType } from '../core/domain-layer/hotel-operations/room/attached-booking/utils/RoomAttachedBookingResult';
import { UnreserveRoom } from "../core/domain-layer/hotel-operations/room/unreserve/UnreserveRoom";

class HotelRoomOperationsController extends BaseController {

    public checkIn(req: any, res: any) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var assignRoom = new AssignRoom(appContext, sessionContext);
        assignRoom.checkIn(req.body.assignRoom).then((booking: BookingDO) => {
            booking.bookingHistory.translateActions(this.getThTranslation(sessionContext));
            this.returnSuccesfulResponse(req, res, { booking: booking });
        }).catch((error: any) => {
            this.returnErrorResponse(req, res, error, ThStatusCode.HotelRoomOperationsControllerErrorCheckingIn);
        });
    }

    public reserveRoom(req: any, res: any) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var assignRoom = new AssignRoom(appContext, sessionContext);
        assignRoom.reserveRoom(req.body.assignRoom).then((booking: BookingDO) => {
            booking.bookingHistory.translateActions(this.getThTranslation(sessionContext));
            this.returnSuccesfulResponse(req, res, { booking: booking });
        }).catch((error: any) => {
            this.returnErrorResponse(req, res, error, ThStatusCode.HotelRoomOperationsControllerErrorReservingRoom);
        });
    }

    public unreserveRoom(req: any, res: any) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var unreserveRoom = new UnreserveRoom(appContext, sessionContext);
        unreserveRoom.unreserve(req.body.unreserveRoom).then((booking: BookingDO) => {
            booking.bookingHistory.translateActions(this.getThTranslation(sessionContext));
            this.returnSuccesfulResponse(req, res, { booking: booking });
        }).catch((error: any) => {
            this.returnErrorResponse(req, res, error, ThStatusCode.HotelRoomOperationsControllerErrorUnreservingRoom);
        });
    }

    public changeRoom(req: any, res: any) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var assignRoom = new AssignRoom(appContext, sessionContext);
        assignRoom.changeRoom(req.body.assignRoom).then((booking: BookingDO) => {
            booking.bookingHistory.translateActions(this.getThTranslation(sessionContext));
            this.returnSuccesfulResponse(req, res, { booking: booking });
        }).catch((error: any) => {
            this.returnErrorResponse(req, res, error, ThStatusCode.HotelRoomOperationsControllerErrorChangingRoom);
        });
    }

    public checkOut(req: any, res: any) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var checkOutRoom = new CheckOutRoom(appContext, sessionContext);
        checkOutRoom.checkOut(req.body.checkOutRoom).then((booking: BookingDO) => {
            booking.bookingHistory.translateActions(this.getThTranslation(sessionContext));
            this.returnSuccesfulResponse(req, res, { booking: booking });
        }).catch((error: any) => {
            this.returnErrorResponse(req, res, error, ThStatusCode.HotelRoomOperationsControllerErrorCheckingOut);
        });
    }

    public changeMaintenanceStatus(req: any, res: any) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var changeMaintenanceStatus = new ChangeRoomMaintenanceStatus(appContext, sessionContext);
        changeMaintenanceStatus.changeStatus(req.body.room).then((updatedRoom: RoomDO) => {
            updatedRoom.maintenanceHistory.translateActions(this.getThTranslation(sessionContext));
            this.returnSuccesfulResponse(req, res, { room: updatedRoom });
        }).catch((error: any) => {
            this.returnErrorResponse(req, res, error, ThStatusCode.HotelRoomOperationsControllerErrorChangingMaintenanceStatus);
        });
    }

    public changeRollawayBedStatus(req: any, res: any) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var changeRollawayBedStatus = new ChangeRollawayBedStatus(appContext, sessionContext);
        changeRollawayBedStatus.changeStatus(req.body.room).then((updatedRoom: RoomDO) => {
            updatedRoom.maintenanceHistory.translateActions(this.getThTranslation(sessionContext));
            this.returnSuccesfulResponse(req, res, { room: updatedRoom });
        }).catch((error: any) => {
            this.returnErrorResponse(req, res, error, ThStatusCode.HotelRoomOperationsControllerErrorChangingRollawayStatus);
        });
    }

    public getAttachedBooking(req: any, res: any) {
        if (!this.precheckGETParameters(req, res, ['roomId'])) { return };

        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;
        var roomId = req.query.roomId;

        var roomAttachedBooking = new RoomAttachedBooking(appContext, sessionContext);
        roomAttachedBooking.getBooking(new RoomAttachedBookingDO(roomId)).then((attachedBookingResult: RoomAttachedBookingResult) => {
            if (attachedBookingResult.resultType != RoomAttachedBookingResultType.NoBooking && attachedBookingResult.booking) {
                attachedBookingResult.booking.bookingHistory.translateActions(this.getThTranslation(sessionContext));
            }
            this.returnSuccesfulResponse(req, res, { attachedBookingResult: attachedBookingResult });
        }).catch((error: any) => {
            this.returnErrorResponse(req, res, error, ThStatusCode.HotelRoomOperationsControllerErrorGettingAttachedBooking);
        });
    }
}

var hotelRoomOperationsController = new HotelRoomOperationsController();
module.exports = {
    checkIn: hotelRoomOperationsController.checkIn.bind(hotelRoomOperationsController),
    reserveRoom: hotelRoomOperationsController.reserveRoom.bind(hotelRoomOperationsController),
    unreserveRoom: hotelRoomOperationsController.unreserveRoom.bind(hotelRoomOperationsController),
    changeRoom: hotelRoomOperationsController.changeRoom.bind(hotelRoomOperationsController),
    checkOut: hotelRoomOperationsController.checkOut.bind(hotelRoomOperationsController),
    changeMaintenanceStatus: hotelRoomOperationsController.changeMaintenanceStatus.bind(hotelRoomOperationsController),
    changeRollawayBedStatus: hotelRoomOperationsController.changeRollawayBedStatus.bind(hotelRoomOperationsController),
    getAttachedBooking: hotelRoomOperationsController.getAttachedBooking.bind(hotelRoomOperationsController),
}