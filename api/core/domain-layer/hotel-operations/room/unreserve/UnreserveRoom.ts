import _ = require('underscore');

import { ThLogger, ThLogLevel } from '../../../../utils/logging/ThLogger';
import { ThError } from '../../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../../utils/th-responses/ThResponse';
import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { ThUtils } from '../../../../utils/ThUtils';
import { ValidationResultParser } from '../../../common/ValidationResultParser';
import { UnreserveRoomDO } from "./UnreserveRoomDO";
import { BookingWithDependencies } from "../../booking/utils/BookingWithDependencies";
import { BookingDO } from "../../../../data-layer/bookings/data-objects/BookingDO";
import { BookingWithDependenciesLoader } from "../../booking/utils/BookingWithDependenciesLoader";
import { BookingDOConstraints } from "../../../../data-layer/bookings/data-objects/BookingDOConstraints";
import { DocumentActionDO } from "../../../../data-layer/common/data-objects/document-history/DocumentActionDO";

export class UnreserveRoom {
    private thUtils: ThUtils;

    private unreserveRoomDO: UnreserveRoomDO;
    private bookingWithDependencies: BookingWithDependencies;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this.thUtils = new ThUtils();
    }

    public unreserve(unreserveRoomDO: UnreserveRoomDO): Promise<BookingDO> {
        this.unreserveRoomDO = unreserveRoomDO;
        return new Promise<BookingDO>((resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) => {
            this.unreserveCore(resolve, reject);
        });
    }

    private unreserveCore(resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) {
        var validationResult = UnreserveRoomDO.getValidationStructure().validateStructure(this.unreserveRoomDO);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this.unreserveRoomDO);
            parser.logAndReject("Error validating unreserve room fields", reject);
            return;
        }
        var bookingLoader = new BookingWithDependenciesLoader(this._appContext, this._sessionContext);
        return bookingLoader.load(this.unreserveRoomDO.groupBookingId, this.unreserveRoomDO.bookingId)
            .then((bookingWithDependencies: BookingWithDependencies) => {
                this.bookingWithDependencies = bookingWithDependencies;

                if (!this.bookingHasValidStatus()) {
                    var thError = new ThError(ThStatusCode.UnreserveRoomInvalidState, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "unreserve room: invalid booking state", this.unreserveRoomDO, thError);
                    throw thError;
                }

                if (this.thUtils.isUndefinedOrNull(this.bookingWithDependencies.bookingDO.roomId)
                    || _.isEmpty(this.bookingWithDependencies.bookingDO.roomId)) {
                    var thError = new ThError(ThStatusCode.UnreserveRoomNoRoom, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "unreserve room: no room", this.unreserveRoomDO, thError);
                    throw thError;
                }

                this.updateBooking();

                var bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
                return bookingsRepo.updateBooking({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                    groupBookingId: this.bookingWithDependencies.bookingDO.groupBookingId,
                    bookingId: this.bookingWithDependencies.bookingDO.id,
                    versionId: this.bookingWithDependencies.bookingDO.versionId
                }, this.bookingWithDependencies.bookingDO);
            }).then((updatedBooking: BookingDO) => {
                resolve(updatedBooking);
            }).catch((error: any) => {
                reject(error);
            });
    }

    private bookingHasValidStatus(): boolean {
        return _.contains(BookingDOConstraints.ConfirmationStatuses_CanBeCheckedIn, this.bookingWithDependencies.bookingDO.confirmationStatus);
    }
    private updateBooking() {
        this.bookingWithDependencies.bookingDO.roomId = null;
        let roomName = this.bookingWithDependencies.getRoom().name;
        this.bookingWithDependencies.bookingDO.bookingHistory.logDocumentAction(DocumentActionDO.buildDocumentActionDO({
            actionParameterMap: { room: roomName },
            actionString: "%room% was unreserved from the booking.",
            userId: this._sessionContext.sessionDO.user.id
        }));
    }
}