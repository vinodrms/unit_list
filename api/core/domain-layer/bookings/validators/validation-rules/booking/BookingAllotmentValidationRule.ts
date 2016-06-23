import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../../utils/AppContext';
import {SessionContext} from '../../../../../utils/SessionContext';
import {ThUtils} from '../../../../../utils/ThUtils';
import {ABusinessValidationRule} from '../../../../common/validation-rules/ABusinessValidationRule';
import {RoomDO} from '../../../../../data-layer/rooms/data-objects/RoomDO';
import {BookingDO} from '../../../../../data-layer/bookings/data-objects/BookingDO';
import {AllotmentDO} from '../../../../../data-layer/allotments/data-objects/AllotmentDO';
import {AllotmentsContainer} from '../../../../allotments/validators/results/AllotmentsContainer';
import {AllotmentConstraintsParams, AllotmentConstraintsValidationRule} from '../allotment/AllotmentConstraintsValidationRule';
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
    private _thUtils: ThUtils;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext, private _validationParams: BookingAllotmentValidationParams) {
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

        var allotmentConstraintsValidationRule: AllotmentConstraintsValidationRule = new AllotmentConstraintsValidationRule(this._validationParams.allotmentConstraintsParam);
        allotmentConstraintsValidationRule.isValidOn(allotment).then((validatedAllotment: AllotmentDO) => {
            var occupancyCalculator = new BookingOccupancyCalculator(this._appContext, this._sessionContext, this._validationParams.roomList);
            return occupancyCalculator.compute(booking.interval, this._validationParams.transientBookingList);
        }).then((bookingOccupancy: IBookingOccupancy) => {
            var allotmentOccupancyNo = bookingOccupancy.getOccupancyForAllotmentId(booking.allotmentId);
            var allotmentAvailabilityNo = allotment.availability.getAllotmentAvailabilityForInterval(new IndexedBookingInterval(booking.interval));
            if (allotmentOccupancyNo >= allotmentAvailabilityNo) {
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
}