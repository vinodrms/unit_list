import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';
import {HotelDO} from '../../../../data-layer/hotel/data-objects/HotelDO';
import {PriceProductDO} from '../../../../data-layer/price-products/data-objects/PriceProductDO';
import {PriceProductsContainer} from '../../../price-products/validators/results/PriceProductsContainer';
import {CustomerDO} from '../../../../data-layer/customers/data-objects/CustomerDO';
import {AllotmentDO} from '../../../../data-layer/allotments/data-objects/AllotmentDO';
import {AllotmentsContainer} from '../../../allotments/validators/results/AllotmentsContainer';
import {BookingDO} from '../../../../data-layer/bookings/data-objects/BookingDO';
import {YieldIntervalsValidator} from '../../../yield-manager/validators/YieldIntervalsValidator';
import {CustomersContainer} from '../../../customers/validators/results/CustomersContainer';

import _ = require('underscore');

export class BookingsValidatorParams {
    loadedHotel: HotelDO;
    priceProductsContainer: PriceProductsContainer;
    customersContainer: CustomersContainer;
    allotmentsContainer: AllotmentsContainer;
}

export class BookingsValidator {
    constructor(private _appContext: AppContext, private _sessionContext: SessionContext, private _validatorParams: BookingsValidatorParams) {
    }

    public validateBookingList(bookingList: BookingDO[]): Promise<BookingDO[]> {
        var individualBookingPromise: Promise<BookingDO>[] = [];
        _.forEach(bookingList, (booking: BookingDO) => {
            individualBookingPromise.push(this.validateBooking(booking));
        });
        return Promise.all(individualBookingPromise);
    }

    private validateBooking(booking: BookingDO): Promise<BookingDO> {
        return new Promise<BookingDO>((resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) => {
            this.validateBookingCore(resolve, reject, booking);
        });
    }

    private validateBookingCore(resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }, booking: BookingDO) {
        var priceProduct = this._validatorParams.priceProductsContainer.getPriceProductById(booking.priceProductId);
        var yieldValidator = new YieldIntervalsValidator(priceProduct, booking.interval);
        if (!yieldValidator.isOpenOnAllYieldAttributes()) {
            var thError = new ThError(ThStatusCode.BookingsValidatorYieldingClosed, null);
            ThLogger.getInstance().logError(ThLogLevel.Warning, "invalid yielding for period", booking, thError);
            reject(thError);
            return;
        }


    }

}