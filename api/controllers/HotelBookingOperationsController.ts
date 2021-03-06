import { BaseController } from './base/BaseController';
import { ThStatusCode } from '../core/utils/th-responses/ThResponse';
import { AppContext } from '../core/utils/AppContext';
import { SessionContext } from '../core/utils/SessionContext';
import { BookingDO } from '../core/data-layer/bookings/data-objects/BookingDO';
import { BookingPossiblePrices } from '../core/domain-layer/hotel-operations/booking/possible-prices/BookingPossiblePrices';
import { BookingPossiblePriceItems } from '../core/domain-layer/hotel-operations/booking/possible-prices/utils/BookingPossiblePriceItems';
import { BookingChangeDates } from '../core/domain-layer/hotel-operations/booking/change-dates/BookingChangeDates';
import { BookingChangeNoShowTime } from '../core/domain-layer/hotel-operations/booking/change-no-show-time/BookingChangeNoShowTime';
import { BookingChangeCapacity } from '../core/domain-layer/hotel-operations/booking/change-capacity/BookingChangeCapacity';
import { BookingPaymentGuarantee } from '../core/domain-layer/hotel-operations/booking/payment-guarantee/BookingPaymentGuarantee';
import { BookingChangeDetails } from '../core/domain-layer/hotel-operations/booking/change-details/BookingChangeDetails';
import { BookingChangeCustomers } from '../core/domain-layer/hotel-operations/booking/change-customers/BookingChangeCustomers';
import { BookingCancel } from '../core/domain-layer/hotel-operations/booking/cancel-booking/BookingCancel';
import { BookingReactivate } from '../core/domain-layer/hotel-operations/booking/reactivate-booking/BookingReactivate';
import { BookingReserveAddOnProducts } from '../core/domain-layer/hotel-operations/booking/reserve-add-on-products/BookingReserveAddOnProducts';
import { BookingChangePriceProduct } from '../core/domain-layer/hotel-operations/booking/change-price-product/BookingChangePriceProduct';
import { BookingUndoCheckIn } from '../core/domain-layer/hotel-operations/booking/undo-check-in/BookingUndoCheckIn';
import { BookingChangeGuestOnInvoice } from "../core/domain-layer/hotel-operations/booking/change-guest-invoice/BookingChangeGuestOnInvoice";
import { GenerateBookingInvoice } from "../core/domain-layer/invoices/generate-booking-invoice/GenerateBookingInvoice";
import { InvoiceDO } from "../core/data-layer/invoices/data-objects/InvoiceDO";

class HotelBookingOperationsController extends BaseController {
    public getPossiblePrices(req: any, res: any) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var bookingPrices = new BookingPossiblePrices(appContext, sessionContext);
        bookingPrices.getPossiblePrices(req.body.booking).then((priceItems: BookingPossiblePriceItems) => {
            this.returnSuccesfulResponse(req, res, priceItems);
        }).catch((error: any) => {
            this.returnErrorResponse(req, res, error, ThStatusCode.HotelBookingOperationsControllerErrorGettingPossiblePrices);
        });
    }
    public changeDates(req: any, res: any) {
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

    public changeNoShowTime(req: any, res: any) {
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

    public changeCapacity(req: any, res: any) {
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

    public addPaymentGuarantee(req: any, res: any) {
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

    public changeDetails(req: any, res: any) {
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

    public changeGuestCustomerDisplayedOnInvoice(req: any, res: any) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var bookingChangeGuestOnInvoice = new BookingChangeGuestOnInvoice(appContext, sessionContext);
        bookingChangeGuestOnInvoice.changeGuestDisplayedOnInvoice(req.body.booking).then((booking: BookingDO) => {
            booking.bookingHistory.translateActions(this.getThTranslation(sessionContext));
            this.returnSuccesfulResponse(req, res, { booking: booking });
        }).catch((error: any) => {
            this.returnErrorResponse(req, res, error, ThStatusCode.HotelBookingOperationsControllerErrorChangingGuestOnInvoice);
        });
    }

    public changeCustomers(req: any, res: any) {
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

    public cancel(req: any, res: any) {
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

    public reactivate(req: any, res: any) {
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

    public reserveAddOnProducts(req: any, res: any) {
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

    public changePriceProduct(req: any, res: any) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var changePriceProduct = new BookingChangePriceProduct(appContext, sessionContext);
        changePriceProduct.changePriceProduct(req.body.booking).then((booking: BookingDO) => {
            booking.bookingHistory.translateActions(this.getThTranslation(sessionContext));
            this.returnSuccesfulResponse(req, res, { booking: booking });
        }).catch((error: any) => {
            this.returnErrorResponse(req, res, error, ThStatusCode.HotelBookingOperationsControllerErrorReservingAddOnProducts);
        });
    }

    public undoCheckIn(req: any, res: any) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var undoCheckIn = new BookingUndoCheckIn(appContext, sessionContext);
        undoCheckIn.undo(req.body.booking).then((booking: BookingDO) => {
            booking.bookingHistory.translateActions(this.getThTranslation(sessionContext));
            this.returnSuccesfulResponse(req, res, { booking: booking });
        }).catch((error: any) => {
            this.returnErrorResponse(req, res, error, ThStatusCode.HotelBookingOperationsControllerErrorUndoCheckIn);
        });
    }

    public generateInvoice(req: any, res: any) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        let generateBookingInvoice = new GenerateBookingInvoice(appContext, sessionContext);
        generateBookingInvoice.generate(req.body.booking).then((invoice: InvoiceDO) => {
            this.returnSuccesfulResponse(req, res, { invoice: invoice });
        }).catch((error: any) => {
            this.returnErrorResponse(req, res, error, ThStatusCode.HotelBookingOperationsControllerErrorUndoCheckIn);
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
    changeGuestCustomerDisplayedOnInvoice: hotelBookingOperationsController.changeGuestCustomerDisplayedOnInvoice.bind(hotelBookingOperationsController),
    changeCustomers: hotelBookingOperationsController.changeCustomers.bind(hotelBookingOperationsController),
    cancel: hotelBookingOperationsController.cancel.bind(hotelBookingOperationsController),
    reactivate: hotelBookingOperationsController.reactivate.bind(hotelBookingOperationsController),
    reserveAddOnProducts: hotelBookingOperationsController.reserveAddOnProducts.bind(hotelBookingOperationsController),
    changePriceProduct: hotelBookingOperationsController.changePriceProduct.bind(hotelBookingOperationsController),
    undoCheckIn: hotelBookingOperationsController.undoCheckIn.bind(hotelBookingOperationsController),
    generateInvoice: hotelBookingOperationsController.generateInvoice.bind(hotelBookingOperationsController)

}
