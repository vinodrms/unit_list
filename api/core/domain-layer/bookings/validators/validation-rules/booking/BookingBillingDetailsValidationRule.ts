import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {ABusinessValidationRule} from '../../../../common/validation-rules/ABusinessValidationRule';
import {BookingDO} from '../../../../../data-layer/bookings/data-objects/BookingDO';
import {PriceProductsContainer} from '../../../../price-products/validators/results/PriceProductsContainer';
import {InvoicePaymentMethodValidator} from '../../../../invoices/validators/InvoicePaymentMethodValidator';
import {HotelDO} from '../../../../../data-layer/hotel/data-objects/HotelDO';
import {CustomersContainer} from '../../../../customers/validators/results/CustomersContainer';

export class BookingBillingDetailsValidationRule extends ABusinessValidationRule<BookingDO> {
    constructor(private _hotelDO: HotelDO, private _priceProductsContainer: PriceProductsContainer, private _customersContainer: CustomersContainer) {
        super({
            statusCode: ThStatusCode.BookingValidationError,
            errorMessage: "error validating booking"
        });
    }

    protected isValidOnCore(resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }, businessObject: BookingDO) {
        var booking = businessObject;

        if (!this.billingCustomerIsInCustomerIdList(booking)) {
            this.logBusinessAndReject(reject, booking, {
                statusCode: ThStatusCode.BookingsValidatorBillingCustomerMissing,
                errorMessage: "missing billing customer from customer list"
            });
            return;
        }
        var priceProduct = this._priceProductsContainer.getPriceProductById(booking.priceProductId);
        if (!priceProduct.conditions.policy.hasCancellationPolicy()) {
            resolve(booking);
            return;
        }
        if (!booking.defaultBillingDetails.paymentGuarantee) {
            this.logBusinessAndReject(reject, booking, {
                statusCode: ThStatusCode.BookingsValidatorMissingPaymentGuarantee,
                errorMessage: "payment guarantee missing"
            });
            return;
        }
        var customer = this._customersContainer.getCustomerById(booking.defaultBillingDetails.customerId);
        var invoicePMValidator = new InvoicePaymentMethodValidator(this._hotelDO, customer);
        invoicePMValidator.validate(booking.defaultBillingDetails.paymentMethod).then((validationResult: any) => {
            resolve(booking);
        }).catch((error: any) => {
            reject(error);
        });
    }
    private billingCustomerIsInCustomerIdList(booking: BookingDO): boolean {
        return _.contains(booking.customerIdList, booking.defaultBillingDetails.customerId);
    }
}