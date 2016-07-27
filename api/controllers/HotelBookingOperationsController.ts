import {BaseController} from './base/BaseController';
import {ThStatusCode} from '../core/utils/th-responses/ThResponse';
import {AppContext} from '../core/utils/AppContext';
import {SessionContext} from '../core/utils/SessionContext';
import {BookingDO} from '../core/data-layer/bookings/data-objects/BookingDO';
import {BookingPossiblePrices} from '../core/domain-layer/hotel-operations/booking/possible-prices/BookingPossiblePrices';
import {BookingPossiblePriceItems} from '../core/domain-layer/hotel-operations/booking/possible-prices/utils/BookingPossiblePriceItems';
import {BookingChangeDates} from '../core/domain-layer/hotel-operations/booking/change-dates/BookingChangeDates';
import {BookingChangeNoShowTime} from '../core/domain-layer/hotel-operations/booking/change-no-show-time/BookingChangeNoShowTime';
import {BookingChangeCapacity} from '../core/domain-layer/hotel-operations/booking/change-capacity/BookingChangeCapacity';

class HotelBookingOperationsController extends BaseController {
    public getPossiblePrices(req: Express.Request, res: Express.Response) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var bookingPrices = new BookingPossiblePrices(appContext, sessionContext);
        bookingPrices.getPossiblePrices(req.body.bookingReference).then((priceItems: BookingPossiblePriceItems) => {
            this.returnSuccesfulResponse(req, res, priceItems);
        }).catch((error: any) => {
            this.returnErrorResponse(req, res, error, ThStatusCode.HotelBookingOperationsControllerErrorGettingPossiblePrices);
        });
    }
    public changeDates(req: Express.Request, res: Express.Response) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var bookingChangeDates = new BookingChangeDates(appContext, sessionContext);
        bookingChangeDates.changeDates(req.body.booking).then((booking: BookingDO) => {
            booking.bookingHistory.translateActions(this.getThTranslation(sessionContext));
            this.returnSuccesfulResponse(req, res, { booking: booking });
        }).catch((error: any) => {
            this.returnErrorResponse(req, res, error, ThStatusCode.HotelBookingOperationsControllerErrorChangingDates);
        });
    }

    public changeNoShowTime(req: Express.Request, res: Express.Response) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var noShowTime = new BookingChangeNoShowTime(appContext, sessionContext);
        noShowTime.changeNoShowTime(req.body.booking).then((booking: BookingDO) => {
            booking.bookingHistory.translateActions(this.getThTranslation(sessionContext));
            this.returnSuccesfulResponse(req, res, { booking: booking });
        }).catch((error: any) => {
            this.returnErrorResponse(req, res, error, ThStatusCode.HotelBookingOperationsControllerErrorChangingNoShowTime);
        });
    }

    public changeCapacity(req: Express.Request, res: Express.Response) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var bookingCapacity = new BookingChangeCapacity(appContext, sessionContext);
        bookingCapacity.changeCapacity(req.body.booking).then((booking: BookingDO) => {
            booking.bookingHistory.translateActions(this.getThTranslation(sessionContext));
            this.returnSuccesfulResponse(req, res, { booking: booking });
        }).catch((error: any) => {
            this.returnErrorResponse(req, res, error, ThStatusCode.HotelBookingOperationsControllerErrorChangingCapacity);
        });
    }
}

var hotelBookingOperationsController = new HotelBookingOperationsController();
module.exports = {
    getPossiblePrices: hotelBookingOperationsController.getPossiblePrices.bind(hotelBookingOperationsController),
    changeDates: hotelBookingOperationsController.changeDates.bind(hotelBookingOperationsController),
    changeNoShowTime: hotelBookingOperationsController.changeNoShowTime.bind(hotelBookingOperationsController),
    changeCapacity: hotelBookingOperationsController.changeCapacity.bind(hotelBookingOperationsController),
}