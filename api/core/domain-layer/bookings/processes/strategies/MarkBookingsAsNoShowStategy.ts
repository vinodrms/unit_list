import { AppContext } from "../../../../utils/AppContext";
import { SessionContext } from "../../../../utils/SessionContext";
import { ThError } from "../../../../utils/th-responses/ThError";
import { IBookingProcessStrategy, BookingStrategyMatchParams } from './IBookingProcessStrategy';
import { BookingSearchCriteriaRepoDO } from '../../../../data-layer/bookings/repositories/IBookingRepository';
import { BookingDO, BookingConfirmationStatus } from '../../../../data-layer/bookings/data-objects/BookingDO';
import { DocumentActionDO } from '../../../../data-layer/common/data-objects/document-history/DocumentActionDO';
import { BookingPriceType } from '../../../../data-layer/bookings/data-objects/price/BookingPriceDO';
import { BookingUtils } from '../../utils/BookingUtils';
import { BookingWithDependenciesLoader } from "../../../hotel-operations/booking/utils/BookingWithDependenciesLoader";

export class MarkBookingsAsNoShowStategy implements IBookingProcessStrategy {
    private _bookingUtils: BookingUtils;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._bookingUtils = new BookingUtils();
    }

    public getMatchingSearchCriteria(params: BookingStrategyMatchParams): BookingSearchCriteriaRepoDO {
        return {
            confirmationStatusList: [BookingConfirmationStatus.Confirmed, BookingConfirmationStatus.Guaranteed],
            triggerParams: {
                triggerName: BookingDO.NoShowTriggerName,
                cancellationHour: params.cancellationHour,
                currentHotelTimestamp: params.referenceTimestamp
            }
        };
    }

    public updateMatchedBooking(bookingDO: BookingDO, params: BookingStrategyMatchParams): Promise<BookingDO> {
        return new Promise<BookingDO>((resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) => {
            this.updateMatchedBookingCore(resolve, reject, bookingDO, params);
        });
    }
    private updateMatchedBookingCore(resolve: { (result: BookingDO): void }, reject: { (err: ThError): void },
        bookingDO: BookingDO, params: BookingStrategyMatchParams) {
        if (!this.hasPenalty(bookingDO, params)) {
            this.updateBookingAsNoShow(bookingDO);
            resolve(bookingDO);
            return;
        }

        let loader = new BookingWithDependenciesLoader(this._appContext, this._sessionContext);
        loader.load(bookingDO.groupBookingId, bookingDO.id)
            .then(bookingWithDeps => {
                // only update the penalty if the booking's invoice is not paid
                if (!bookingWithDeps.hasClosedInvoice()) {
                    this.updateBookingAsNoShowWithPenalty(bookingDO);
                }
                else {
                    // if the booking already has a paid invoice just log an according message
                    this.updateBookingAsNoShowWithWarning(bookingDO);
                }
                resolve(bookingDO);
            }).catch(e => {
                reject(e);
            });
    }

    private hasPenalty(bookingDO: BookingDO, params: BookingStrategyMatchParams): boolean {
        return this._bookingUtils.hasPenalty(bookingDO, {
            cancellationHour: params.cancellationHour,
            currentHotelTimestamp: params.referenceTimestamp
        });
    }

    private updateBookingAsNoShow(bookingDO: BookingDO) {
        bookingDO.confirmationStatus = BookingConfirmationStatus.NoShow;
        bookingDO.bookingHistory.logDocumentAction(DocumentActionDO.buildDocumentActionDO({
            actionParameterMap: {},
            actionString: "Booking was marked as No Show by the System"
        }));
    }
    private updateBookingAsNoShowWithPenalty(bookingDO: BookingDO) {
        bookingDO.confirmationStatus = BookingConfirmationStatus.NoShowWithPenalty;
        if (bookingDO.price.priceType === BookingPriceType.BookingStay) {
            bookingDO.price = bookingDO.priceProductSnapshot.conditions.penalty.computePenaltyPrice(bookingDO.price);
        }
        bookingDO.bookingHistory.logDocumentAction(DocumentActionDO.buildDocumentActionDO({
            actionParameterMap: {},
            actionString: "Booking was marked as No Show by the System. The booking has a penalty on the attached invoice."
        }));
    }
    private updateBookingAsNoShowWithWarning(bookingDO: BookingDO) {
        bookingDO.confirmationStatus = BookingConfirmationStatus.NoShow;
        bookingDO.bookingHistory.logDocumentAction(DocumentActionDO.buildDocumentActionDO({
            actionParameterMap: {},
            actionString: "Booking was marked as No Show by the System. The penalty could not be generated because the invoice is already closed."
        }));
    }
}