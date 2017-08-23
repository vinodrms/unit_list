import { ThError } from '../../../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../../../utils/th-responses/ThResponse';
import { ABusinessValidationRule } from '../../../../common/validation-rules/ABusinessValidationRule';
import { BookingDO } from '../../../../../data-layer/bookings/data-objects/BookingDO';
import { BookingDOConstraints } from '../../../../../data-layer/bookings/data-objects/BookingDOConstraints';
import { PriceProductsContainer } from '../../../../price-products/validators/results/PriceProductsContainer';
import { InvoicePaymentMethodValidator } from '../../../../invoices-deprecated/validators/InvoicePaymentMethodValidator';
import { HotelDO } from '../../../../../data-layer/hotel/data-objects/HotelDO';
import { CustomersContainer } from '../../../../customers/validators/results/CustomersContainer';

import _ = require('underscore');

export class BookingBillingDetailsValidationRule extends ABusinessValidationRule<BookingDO> {
    constructor(private _hotelDO: HotelDO, private _priceProductsContainer: PriceProductsContainer, private _customersContainer: CustomersContainer) {
        super({
            statusCode: ThStatusCode.BookingValidationError,
            errorMessage: "error validating booking"
        });
    }

    protected isValidOnCore(resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }, businessObject: BookingDO) {
        var booking = businessObject;

        var priceProduct = this._priceProductsContainer.getPriceProductById(booking.priceProductId);
        var billedCustomer = this._customersContainer.getCustomerById(booking.defaultBillingDetails.customerId);
        if (!billedCustomer.hasAccessOnPriceProduct(priceProduct)) {
            this.logBusinessAndReject(reject, booking, {
                statusCode: ThStatusCode.BookingsValidatorBilledCustomerInvalidRightsOnPriceProduct,
                errorMessage: "billed customer does not have access on the price product"
            });
            return;
        }

        if (priceProduct.conditions.policy.hasCancellationPolicy() && !booking.defaultBillingDetails.paymentGuarantee) {
            this.logBusinessAndReject(reject, booking, {
                statusCode: ThStatusCode.BookingsValidatorMissingPaymentGuarantee,
                errorMessage: "payment guarantee missing"
            });
            return;
        }
        if (!booking.defaultBillingDetails.paymentGuarantee) {
            resolve(booking);
            return;
        }
        var invoicePMValidator = new InvoicePaymentMethodValidator(this._hotelDO, billedCustomer);
        invoicePMValidator.validate(booking.defaultBillingDetails.paymentMethod).then((validationResult: any) => {
            resolve(booking);
        }).catch((error: any) => {
            reject(error);
        });
    }
}
