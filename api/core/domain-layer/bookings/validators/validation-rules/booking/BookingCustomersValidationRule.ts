import { ThError } from '../../../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../../../utils/th-responses/ThResponse';
import { ABusinessValidationRule } from '../../../../common/validation-rules/ABusinessValidationRule';
import { BookingDO } from '../../../../../data-layer/bookings/data-objects/BookingDO';
import { BookingDOConstraints } from '../../../../../data-layer/bookings/data-objects/BookingDOConstraints';
import { PriceProductsContainer } from '../../../../price-products/validators/results/PriceProductsContainer';
import { HotelDO } from '../../../../../data-layer/hotel/data-objects/HotelDO';
import { CustomersContainer } from '../../../../customers/validators/results/CustomersContainer';

import _ = require('underscore');

export class BookingCustomersValidationRule extends ABusinessValidationRule<BookingDO> {
    constructor(private _customersContainer: CustomersContainer) {
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
        var noOfTaOrComp = this.getNumberOfTravelAgenciesOrCompanies(booking);
        if (noOfTaOrComp > BookingDOConstraints.MaxNoOfCompaniesOrTravelAgenciesOnBooking) {
            this.logBusinessAndReject(reject, booking, {
                statusCode: ThStatusCode.BookingsValidatorNoCompaniesOrTALimit,
                errorMessage: "too many companies or travel agencies"
            });
            return;
        }

        resolve(booking);
    }
    private billingCustomerIsInCustomerIdList(booking: BookingDO): boolean {
        return _.contains(booking.customerIdList, booking.defaultBillingDetails.customerId);
    }
    private getNumberOfTravelAgenciesOrCompanies(booking: BookingDO): number {
        var noTaOrComp = 0;
        _.forEach(booking.customerIdList, (customerId: string) => {
            var customer = this._customersContainer.getCustomerById(customerId);
            if (customer.isCompanyOrTravelAgency()) {
                noTaOrComp++;
            }
        });
        return noTaOrComp;
    }
}
