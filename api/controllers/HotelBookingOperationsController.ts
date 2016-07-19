import {BaseController} from './base/BaseController';
import {ThStatusCode} from '../core/utils/th-responses/ThResponse';
import {AppContext} from '../core/utils/AppContext';
import {SessionContext} from '../core/utils/SessionContext';
import {BookingPossiblePrices} from '../core/domain-layer/hotel-operations/booking/possible-prices/BookingPossiblePrices';
import {BookingPossiblePriceItems} from '../core/domain-layer/hotel-operations/booking/possible-prices/utils/BookingPossiblePriceItems';

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
}

var hotelBookingOperationsController = new HotelBookingOperationsController();
module.exports = {
    getPossiblePrices: hotelBookingOperationsController.getPossiblePrices.bind(hotelBookingOperationsController)
}