import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {ABusinessValidationRule} from '../../../../common/validation-rules/ABusinessValidationRule';
import {BookingDO} from '../../../../../data-layer/bookings/data-objects/BookingDO';
import {PriceProductsContainer} from '../../../../price-products/validators/results/PriceProductsContainer';
import {InvoicePaymentMethodValidator} from '../../../../invoices/validators/InvoicePaymentMethodValidator';
import {HotelDO} from '../../../../../data-layer/hotel/data-objects/HotelDO';
import {CustomersContainer} from '../../../../customers/validators/results/CustomersContainer';

export class BookingRoomCategoryValidationRule extends ABusinessValidationRule<BookingDO> {
    constructor(private _priceProductsContainer: PriceProductsContainer) {
        super({
            statusCode: ThStatusCode.BookingValidationError,
            errorMessage: "error validating booking"
        });
    }

    protected isValidOnCore(resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }, businessObject: BookingDO) {
        var booking = businessObject;

        var priceProduct = this._priceProductsContainer.getPriceProductById(booking.priceProductId);
        if (!priceProduct.containsRoomCategoryId(booking.roomCategoryId)) {
            this.logBusinessAndReject(reject, booking, {
                statusCode: ThStatusCode.BookingsValidatorInvalidRoomCategoryId,
                errorMessage: "invalid room category id"
            });
            return;
        }
        resolve(booking);
    }
}