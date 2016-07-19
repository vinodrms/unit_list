import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {ABusinessValidationRule} from '../../../../common/validation-rules/ABusinessValidationRule';
import {BookingDO} from '../../../../../data-layer/bookings/data-objects/BookingDO';
import {PriceProductsContainer} from '../../../../price-products/validators/results/PriceProductsContainer';
import {InvoicePaymentMethodValidator} from '../../../../invoices/validators/InvoicePaymentMethodValidator';
import {HotelDO} from '../../../../../data-layer/hotel/data-objects/HotelDO';
import {CustomersContainer} from '../../../../customers/validators/results/CustomersContainer';
import {RoomCategoryStatsDO} from '../../../../../data-layer/room-categories/data-objects/RoomCategoryStatsDO';
import {RoomDO} from '../../../../../data-layer/rooms/data-objects/RoomDO';

import _ = require('underscore');

export interface BookingAllotmentValidationParams {
    priceProductsContainer: PriceProductsContainer;
    roomCategoryStatsList: RoomCategoryStatsDO[];
    roomList: RoomDO[];
}

export class BookingRoomCategoryValidationRule extends ABusinessValidationRule<BookingDO> {
    constructor(private _validationParams: BookingAllotmentValidationParams) {
        super({
            statusCode: ThStatusCode.BookingValidationError,
            errorMessage: "error validating booking"
        });
    }

    protected isValidOnCore(resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }, businessObject: BookingDO) {
        var booking = businessObject;

        var priceProduct = this._validationParams.priceProductsContainer.getPriceProductById(booking.priceProductId);
        if (!priceProduct.containsRoomCategoryId(booking.roomCategoryId)) {
            this.logBusinessAndReject(reject, booking, {
                statusCode: ThStatusCode.BookingsValidatorInvalidRoomCategoryId,
                errorMessage: "invalid room category id"
            });
            return;
        }
        if (!priceProduct.price.hasPriceConfiguredFor({
            configCapacity: booking.configCapacity,
            roomCategoryId: booking.roomCategoryId
        })) {
            this.logBusinessAndReject(reject, booking, {
                statusCode: ThStatusCode.BookingsValidatorInvalidPriceForRoomCategoryId,
                errorMessage: "invalid room category id - no price"
            });
            return;
        }

        var actualRoomCategoryId: string = booking.roomCategoryId;
        if (!this._thUtils.isUndefinedOrNull(booking.roomId) && _.isString(booking.roomId)) {
            var foundRoom = _.find(this._validationParams.roomList, (room: RoomDO) => { return room.id === booking.roomId });
            if (this._thUtils.isUndefinedOrNull(foundRoom)) {
                this.logBusinessAndReject(reject, booking, {
                    statusCode: ThStatusCode.BookingsValidatorInvalidRoomId,
                    errorMessage: "room id not found"
                });
                return;
            }
            actualRoomCategoryId = foundRoom.categoryId;
        }

        var roomCategoryStatsDO: RoomCategoryStatsDO = _.find(this._validationParams.roomCategoryStatsList, (roomCategStats: RoomCategoryStatsDO) => {
            return roomCategStats.roomCategory.id === actualRoomCategoryId;
        });
        if (this._thUtils.isUndefinedOrNull(roomCategoryStatsDO)) {
            this.logBusinessAndReject(reject, booking, {
                statusCode: ThStatusCode.BookingsValidatorRoomCategoryNotFoundInActiveInventory,
                errorMessage: "room category id not found in active room inventory"
            });
            return;
        }
        if (!roomCategoryStatsDO.capacity.canFit(booking.configCapacity)) {
            this.logBusinessAndReject(reject, booking, {
                statusCode: ThStatusCode.BookingsValidatorInsufficientRoomCategoryCapacity,
                errorMessage: "insufficient room category capacity"
            });
            return;
        }

        resolve(booking);
    }
}