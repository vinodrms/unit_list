import {ThError} from '../../../../utils/th-responses/ThError';
import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';
import {ThDateDO} from '../../../../utils/th-dates/data-objects/ThDateDO';
import {HotelDO} from '../../../../data-layer/hotel/data-objects/HotelDO';
import {RoomDO} from '../../../../data-layer/rooms/data-objects/RoomDO';
import {PriceProductDO} from '../../../../data-layer/price-products/data-objects/PriceProductDO';
import {PriceProductsContainer} from '../../../price-products/validators/results/PriceProductsContainer';
import {AllotmentsContainer} from '../../../allotments/validators/results/AllotmentsContainer';
import {BookingDO} from '../../../../data-layer/bookings/data-objects/BookingDO';
import {RoomCategoryStatsDO} from '../../../../data-layer/room-categories/data-objects/RoomCategoryStatsDO';
import {CustomersContainer} from '../../../customers/validators/results/CustomersContainer';
import {BusinessValidationRuleContainer} from '../../../common/validation-rules/BusinessValidationRuleContainer';
import {BookingBillingDetailsValidationRule} from '../../validators/validation-rules/booking/BookingBillingDetailsValidationRule';
import {BookingAllotmentValidationRule, BookingAllotmentValidationParams} from '../../validators/validation-rules/booking/BookingAllotmentValidationRule';
import {BookingRoomCategoryValidationRule} from '../../validators/validation-rules/booking/BookingRoomCategoryValidationRule';
import {PriceProductYieldIntervalsValidationRule} from '../../validators/validation-rules/price-product/PriceProductYieldIntervalsValidationRule';
import {PriceProductConstraintsValidationRule, PriceProductConstraintsParams} from '../../validators/validation-rules/price-product/PriceProductConstraintsValidationRule';
import {BookingUtils} from '../../utils/BookingUtils';

import _ = require('underscore');

export class ValidationParams {
    hotel: HotelDO;
    priceProductsContainer: PriceProductsContainer;
    customersContainer: CustomersContainer;
    allotmentsContainer: AllotmentsContainer;
    roomList: RoomDO[];
    roomCategoryStatsList: RoomCategoryStatsDO[];
}

export class NewBookingsValidationRules {
    private _currentHotelThDate: ThDateDO;
    private _roomCategoryIdListFromBookings: string[];
    private _transientBookingList: BookingDO[];

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext, private _validatorParams: ValidationParams) {
        var bookingUtils = new BookingUtils();
        this._currentHotelThDate = bookingUtils.getCurrentThDateForHotel(_validatorParams.hotel);
    }

    public validateBookingList(bookingList: BookingDO[]): Promise<BookingDO[]> {
        this._transientBookingList = bookingList;
        this.indexRoomCategoryIdListFromBookings(bookingList);
        var individualBookingPromise: Promise<BookingDO>[] = [];
        _.forEach(bookingList, (booking: BookingDO) => {
            individualBookingPromise.push(this.validateBooking(booking));
        });
        return Promise.all(individualBookingPromise);
    }
    private indexRoomCategoryIdListFromBookings(bookingList: BookingDO[]) {
        this._roomCategoryIdListFromBookings = _.map(bookingList, (booking: BookingDO) => { return booking.roomCategoryId });
    }

    private validateBooking(booking: BookingDO): Promise<BookingDO> {
        return new Promise<BookingDO>((resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) => {
            this.validateBookingCore(resolve, reject, booking);
        });
    }
    private validateBookingCore(resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }, booking: BookingDO) {
        var bookingValidationRule = new BusinessValidationRuleContainer([
            new BookingBillingDetailsValidationRule(this._validatorParams.hotel, this._validatorParams.priceProductsContainer, this._validatorParams.customersContainer),
            new BookingAllotmentValidationRule(this._appContext, this._sessionContext, this.getBookingAllotmentValidationParams(booking)),
            new BookingRoomCategoryValidationRule({
                priceProductsContainer: this._validatorParams.priceProductsContainer,
                roomCategoryStatsList: this._validatorParams.roomCategoryStatsList,
                roomList: this._validatorParams.roomList
            })
        ]);
        bookingValidationRule.isValidOn(booking).then((validatedBooking: BookingDO) => {
            var priceProductValidationRule = new BusinessValidationRuleContainer([
                new PriceProductConstraintsValidationRule(this.getPriceProductConstraintsParams(booking))
            ]);
            if (!booking.isMadeThroughAllotment()) {
                priceProductValidationRule.addBusinessValidationRule(new PriceProductYieldIntervalsValidationRule(booking.interval));
            }

            var priceProduct = this._validatorParams.priceProductsContainer.getPriceProductById(booking.priceProductId);
            return priceProductValidationRule.isValidOn(priceProduct);
        }).then((validatedPriceProduct: PriceProductDO) => {
            resolve(booking);
        }).catch((error: ThError) => {
            reject(error);
        })
    }

    private getBookingAllotmentValidationParams(booking: BookingDO): BookingAllotmentValidationParams {
        return {
            allotmentsContainer: this._validatorParams.allotmentsContainer,
            allotmentConstraintsParam: {
                bookingInterval: booking.interval,
                bookingCreationDate: booking.creationDate
            },
            transientBookingList: this._transientBookingList,
            roomList: this._validatorParams.roomList
        };
    }
    private getPriceProductConstraintsParams(booking: BookingDO): PriceProductConstraintsParams {
        return {
            bookingInterval: booking.interval,
            bookingCreationDate: booking.creationDate,
            configCapacity: booking.configCapacity,
            roomCategoryIdListFromBookings: this._roomCategoryIdListFromBookings
        };
    }
}