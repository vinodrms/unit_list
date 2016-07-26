import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../../utils/AppContext';
import {SessionContext} from '../../../../../utils/SessionContext';
import {ABusinessValidationRule} from '../../../../common/validation-rules/ABusinessValidationRule';
import {RoomDO} from '../../../../../data-layer/rooms/data-objects/RoomDO';
import {BookingDO} from '../../../../../data-layer/bookings/data-objects/BookingDO';
import {AllotmentDO, AllotmentStatus} from '../../../../../data-layer/allotments/data-objects/AllotmentDO';
import {AllotmentsContainer} from '../../../../allotments/validators/results/AllotmentsContainer';
import {AllotmentConstraintsParams, AllotmentConstraintsValidationRule} from '../allotment/AllotmentConstraintsValidationRule';
import {AllotmentOpenIntervalValidationRule} from '../allotment/AllotmentOpenIntervalValidationRule';
import {BusinessValidationRuleContainer} from '../../../../common/validation-rules/BusinessValidationRuleContainer';
import {BookingOccupancyCalculator} from '../../../search-bookings/utils/occupancy-calculator/BookingOccupancyCalculator';
import {IBookingOccupancy} from '../../../search-bookings/utils/occupancy-calculator/results/IBookingOccupancy';
import {IndexedBookingInterval} from '../../../../../data-layer/price-products/utils/IndexedBookingInterval';

export interface BookingAllotmentValidationParams {
    allotmentsContainer: AllotmentsContainer;
    allotmentConstraintsParam: AllotmentConstraintsParams;
    transientBookingList: BookingDO[];
    roomList: RoomDO[];
}

export class BookingAllotmentValidationRule extends ABusinessValidationRule<BookingDO> {
    constructor(private _appContext: AppContext, private _sessionContext: SessionContext, private _validationParams: BookingAllotmentValidationParams) {
        super({
            statusCode: ThStatusCode.BookingValidationError,
            errorMessage: "error validating booking"
        });
    }

    protected isValidOnCore(resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }, businessObject: BookingDO) {
        var booking = businessObject;
        if (!booking.isMadeThroughAllotment()) {
            resolve(booking);
            return;
        }
        var allotment = this._validationParams.allotmentsContainer.getAllotmentById(booking.allotmentId);
        if (allotment.status === AllotmentStatus.Archived) {
            resolve(booking);
            return;
        }

        if (allotment.customerId !== booking.defaultBillingDetails.customerId) {
            this.logBusinessAndReject(reject, booking, {
                statusCode: ThStatusCode.BookingsValidatorAllotmentCustomer,
                errorMessage: "billable customer not from allotment"
            });
            return;
        }

        if (allotment.roomCategoryId !== booking.roomCategoryId && this.isNewBooking(booking)) {
            this.logBusinessAndReject(reject, booking, {
                statusCode: ThStatusCode.BookingsValidatorAllotmentInvalidRoomCategory,
                errorMessage: "room category id mismatch between allotment and selected"
            });
            return;
        }

        var allotmentValidationRule = new BusinessValidationRuleContainer([
            new AllotmentConstraintsValidationRule(this._validationParams.allotmentConstraintsParam),
            new AllotmentOpenIntervalValidationRule({ bookingInterval: this._validationParams.allotmentConstraintsParam.bookingInterval })
        ]);
        allotmentValidationRule.isValidOn(allotment).then((validatedAllotment: AllotmentDO) => {
            var occupancyCalculator = new BookingOccupancyCalculator(this._appContext, this._sessionContext, this._validationParams.roomList);
            return occupancyCalculator.compute(booking.interval, this._validationParams.transientBookingList, booking.bookingId);
        }).then((bookingOccupancy: IBookingOccupancy) => {
            var allotmentOccupancyNo = bookingOccupancy.getOccupancyForAllotmentId(booking.allotmentId);
            var allotmentAvailabilityNo = allotment.availability.getAllotmentAvailabilityForInterval(new IndexedBookingInterval(booking.interval));
            if (allotmentOccupancyNo > allotmentAvailabilityNo) {
                this.logBusinessAndReject(reject, booking, {
                    statusCode: ThStatusCode.BookingsValidatorAllotmentInsufficientInventory,
                    errorMessage: "insufficient inventory to add booking with allotment"
                });
                return;
            }
            resolve(booking);
        }).catch((error: ThError) => {
            reject(error);
        });
    }
    private isNewBooking(booking: BookingDO): boolean {
        return this._thUtils.isUndefinedOrNull(booking.groupBookingId);
    }
}