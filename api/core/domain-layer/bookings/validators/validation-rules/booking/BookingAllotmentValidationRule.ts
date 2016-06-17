import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {ThUtils} from '../../../../../utils/ThUtils';
import {ABusinessValidationRule} from '../../../../common/validation-rules/ABusinessValidationRule';
import {BookingDO} from '../../../../../data-layer/bookings/data-objects/BookingDO';
import {AllotmentDO} from '../../../../../data-layer/allotments/data-objects/AllotmentDO';
import {AllotmentsContainer} from '../../../../allotments/validators/results/AllotmentsContainer';
import {AllotmentConstraintsParams, AllotmentConstraintsValidationRule} from '../allotment/AllotmentConstraintsValidationRule';

export interface BookingAllotmentValidationParams {
    allotmentsContainer: AllotmentsContainer;
    checkAllotmentConstraints: boolean;
    allotmentConstraintsParam?: AllotmentConstraintsParams;
}

export class BookingAllotmentValidationRule extends ABusinessValidationRule<BookingDO> {
    private _thUtils: ThUtils;

    constructor(private _validationParams: BookingAllotmentValidationParams) {
        super({
            statusCode: ThStatusCode.BookingValidationError,
            errorMessage: "error validating booking"
        });
        this._thUtils = new ThUtils();
    }

    protected isValidOnCore(resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }, businessObject: BookingDO) {
        var booking = businessObject;
        if (!booking.isMadeThroughAllotment()) {
            resolve(booking);
            return;
        }
        var allotment = this._validationParams.allotmentsContainer.getAllotmentById(booking.allotmentId);
        if (allotment.customerId !== booking.defaultBillingDetails.customerId) {
            this.logBusinessAndReject(reject, booking, {
                statusCode: ThStatusCode.BookingsValidatorAllotmentCustomer,
                errorMessage: "billable customer not from allotment"
            });
            return;
        }
        if (allotment.roomCategoryId !== booking.roomCategoryId) {
            this.logBusinessAndReject(reject, booking, {
                statusCode: ThStatusCode.BookingsValidatorAllotmentInvalidRoomCategory,
                errorMessage: "room category id mismatch between allotment and selected"
            });
            return;
        }
        if (!this._validationParams.checkAllotmentConstraints) {
            resolve(booking);
            return;
        }
        var allotmentConstraintsValidationRule: AllotmentConstraintsValidationRule = new AllotmentConstraintsValidationRule(this._validationParams.allotmentConstraintsParam);
        allotmentConstraintsValidationRule.isValidOn(allotment).then((validatedAllotment: AllotmentDO) => {
            resolve(booking);
        }).catch((error: ThError) => {
            reject(error);
        });
    }
}