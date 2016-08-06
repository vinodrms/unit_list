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
import {BookingPaymentGuarantee} from '../core/domain-layer/hotel-operations/booking/payment-guarantee/BookingPaymentGuarantee';
import {BookingChangeDetails} from '../core/domain-layer/hotel-operations/booking/change-details/BookingChangeDetails';
import {BookingChangeCustomers} from '../core/domain-layer/hotel-operations/booking/change-customers/BookingChangeCustomers';
import {BookingCancel} from '../core/domain-layer/hotel-operations/booking/cancel-booking/BookingCancel';
import {BookingReactivate} from '../core/domain-layer/hotel-operations/booking/reactivate-booking/BookingReactivate';
import {BookingRemoveRollawayCapacityWarning} from '../core/domain-layer/hotel-operations/booking/rollaway-capacity/BookingRemoveRollawayCapacityWarning';
import {BookingReserveAddOnProducts} from '../core/domain-layer/hotel-operations/booking/reserve-add-on-products/BookingReserveAddOnProducts';

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

    public addPaymentGuarantee(req: Express.Request, res: Express.Response) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var paymentGuarantee = new BookingPaymentGuarantee(appContext, sessionContext);
        paymentGuarantee.addPaymentGuarantee(req.body.booking).then((booking: BookingDO) => {
            booking.bookingHistory.translateActions(this.getThTranslation(sessionContext));
            this.returnSuccesfulResponse(req, res, { booking: booking });
        }).catch((error: any) => {
            this.returnErrorResponse(req, res, error, ThStatusCode.HotelBookingOperationsControllerErrorAddingPaymentGuarantee);
        });
    }

    public changeDetails(req: Express.Request, res: Express.Response) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var bookingChangeDetails = new BookingChangeDetails(appContext, sessionContext);
        bookingChangeDetails.changeDetails(req.body.booking).then((booking: BookingDO) => {
            booking.bookingHistory.translateActions(this.getThTranslation(sessionContext));
            this.returnSuccesfulResponse(req, res, { booking: booking });
        }).catch((error: any) => {
            this.returnErrorResponse(req, res, error, ThStatusCode.HotelBookingOperationsControllerErrorChangingDetails);
        });
    }

    public changeCustomers(req: Express.Request, res: Express.Response) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var bookingChangeCustomers = new BookingChangeCustomers(appContext, sessionContext);
        bookingChangeCustomers.changeCustomers(req.body.booking).then((booking: BookingDO) => {
            booking.bookingHistory.translateActions(this.getThTranslation(sessionContext));
            this.returnSuccesfulResponse(req, res, { booking: booking });
        }).catch((error: any) => {
            this.returnErrorResponse(req, res, error, ThStatusCode.HotelBookingOperationsControllerErrorChangingCustomers);
        });
    }

    public cancel(req: Express.Request, res: Express.Response) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var bookingCancel = new BookingCancel(appContext, sessionContext);
        bookingCancel.cancel(req.body.booking).then((booking: BookingDO) => {
            booking.bookingHistory.translateActions(this.getThTranslation(sessionContext));
            this.returnSuccesfulResponse(req, res, { booking: booking });
        }).catch((error: any) => {
            this.returnErrorResponse(req, res, error, ThStatusCode.HotelBookingOperationsControllerErrorCancelling);
        });
    }

    public reactivate(req: Express.Request, res: Express.Response) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var bookingReactivate = new BookingReactivate(appContext, sessionContext);
        bookingReactivate.reactivate(req.body.booking).then((booking: BookingDO) => {
            booking.bookingHistory.translateActions(this.getThTranslation(sessionContext));
            this.returnSuccesfulResponse(req, res, { booking: booking });
        }).catch((error: any) => {
            this.returnErrorResponse(req, res, error, ThStatusCode.HotelBookingOperationsControllerErrorReactivating);
        });
    }

    public removeRollawayCapacityWarning(req: Express.Request, res: Express.Response) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var rollawayCapacity = new BookingRemoveRollawayCapacityWarning(appContext, sessionContext);
        rollawayCapacity.removeRollawayCapacityWarning(req.body.booking).then((booking: BookingDO) => {
            booking.bookingHistory.translateActions(this.getThTranslation(sessionContext));
            this.returnSuccesfulResponse(req, res, { booking: booking });
        }).catch((error: any) => {
            this.returnErrorResponse(req, res, error, ThStatusCode.HotelBookingOperationsControllerErrorRemovingRollawayCapacity);
        });
    }

    public reserveAddOnProducts(req: Express.Request, res: Express.Response) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var reserveAddOnProducts = new BookingReserveAddOnProducts(appContext, sessionContext);
        reserveAddOnProducts.reserve(req.body.booking).then((booking: BookingDO) => {
            booking.bookingHistory.translateActions(this.getThTranslation(sessionContext));
            this.returnSuccesfulResponse(req, res, { booking: booking });
        }).catch((error: any) => {
            this.returnErrorResponse(req, res, error, ThStatusCode.HotelBookingOperationsControllerErrorReservingAddOnProducts);
        });
    }
}

var hotelBookingOperationsController = new HotelBookingOperationsController();
module.exports = {
    getPossiblePrices: hotelBookingOperationsController.getPossiblePrices.bind(hotelBookingOperationsController),
    changeDates: hotelBookingOperationsController.changeDates.bind(hotelBookingOperationsController),
    changeNoShowTime: hotelBookingOperationsController.changeNoShowTime.bind(hotelBookingOperationsController),
    changeCapacity: hotelBookingOperationsController.changeCapacity.bind(hotelBookingOperationsController),
    addPaymentGuarantee: hotelBookingOperationsController.addPaymentGuarantee.bind(hotelBookingOperationsController),
    changeDetails: hotelBookingOperationsController.changeDetails.bind(hotelBookingOperationsController),
    changeCustomers: hotelBookingOperationsController.changeCustomers.bind(hotelBookingOperationsController),
    cancel: hotelBookingOperationsController.cancel.bind(hotelBookingOperationsController),
    reactivate: hotelBookingOperationsController.reactivate.bind(hotelBookingOperationsController),
    removeRollawayCapacityWarning: hotelBookingOperationsController.removeRollawayCapacityWarning.bind(hotelBookingOperationsController),
    reserveAddOnProducts: hotelBookingOperationsController.reserveAddOnProducts.bind(hotelBookingOperationsController),
}