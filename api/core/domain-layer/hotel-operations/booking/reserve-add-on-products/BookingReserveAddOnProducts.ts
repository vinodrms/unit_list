import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';
import { BookingDO, AddOnProductBookingReservedItem } from '../../../../data-layer/bookings/data-objects/BookingDO';
import {BookingDOConstraints} from '../../../../data-layer/bookings/data-objects/BookingDOConstraints';
import {DocumentActionDO} from '../../../../data-layer/common/data-objects/document-history/DocumentActionDO';
import {ValidationResultParser} from '../../../common/ValidationResultParser';
import {AddOnProductIdValidator} from '../../../add-on-products/validators/AddOnProductIdValidator';
import {AddOnProductsContainer} from '../../../add-on-products/validators/results/AddOnProductsContainer';
import {BookingReserveAddOnProductsDO} from './BookingReserveAddOnProductsDO';
import {BookingUtils} from '../../../bookings/utils/BookingUtils';

import _ = require('underscore');

export class BookingReserveAddOnProducts {
    private _bookingUtils: BookingUtils;

    private _reserveAddOnProductsDO: BookingReserveAddOnProductsDO;

    private _loadedAddOnProductsContainer: AddOnProductsContainer;
    private _loadedBooking: BookingDO;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._bookingUtils = new BookingUtils();
    }

    public reserve(reserveAddOnProductsDO: BookingReserveAddOnProductsDO): Promise<BookingDO> {
        this._reserveAddOnProductsDO = reserveAddOnProductsDO;
        return new Promise<BookingDO>((resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) => {
            this.reserveCore(resolve, reject);
        });
    }
    private reserveCore(resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) {
        var validationResult = BookingReserveAddOnProductsDO.getValidationStructure().validateStructure(this._reserveAddOnProductsDO);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this._reserveAddOnProductsDO);
            parser.logAndReject("Error validating reserve add on products", reject);
            return;
        }
        var uniqueAddOnProductIdList = _.map(this._reserveAddOnProductsDO.reservedAddOnProductList, (addOnProduct: AddOnProductBookingReservedItem) => {return addOnProduct.aopId;});
        var addOnProductValidator = new AddOnProductIdValidator(this._appContext, this._sessionContext);
        addOnProductValidator.validateAddOnProductIdList(uniqueAddOnProductIdList).then((addOnProductsContainer: AddOnProductsContainer) => {
            this._loadedAddOnProductsContainer = addOnProductsContainer;

            var bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
            return bookingsRepo.getBookingById({ hotelId: this._sessionContext.sessionDO.hotel.id }, this._reserveAddOnProductsDO.groupBookingId, this._reserveAddOnProductsDO.id)
        }).then((booking: BookingDO) => {
            this._loadedBooking = booking;

            if (!this.bookingHasValidStatus()) {
                var thError = new ThError(ThStatusCode.BookingReserveAddOnProductsInvalidState, null);
                ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "reserve add on products: invalid booking state", this._reserveAddOnProductsDO, thError);
                throw thError;
            }

            this.updateBooking();

            var bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
            return bookingsRepo.updateBooking({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                groupBookingId: this._loadedBooking.groupBookingId,
                bookingId: this._loadedBooking.id,
                versionId: this._loadedBooking.versionId
            }, this._loadedBooking);
        }).then((updatedBooking: BookingDO) => {
            resolve(updatedBooking);
        }).catch((error: any) => {
            var thError = new ThError(ThStatusCode.BookingReserveAddOnProductsError, error);
            if (thError.isNativeError()) {
                ThLogger.getInstance().logError(ThLogLevel.Error, "error reserving add on products", this._reserveAddOnProductsDO, thError);
            }
            reject(thError);
        });
    }
    private bookingHasValidStatus(): boolean {
        return _.contains(BookingDOConstraints.ConfirmationStatuses_CanReserveAddOnProducts, this._loadedBooking.confirmationStatus);
    }
    private updateBooking() {
        this._loadedBooking.reservedAddOnProductList = this._reserveAddOnProductsDO.reservedAddOnProductList;
        this._loadedBooking.bookingHistory.logDocumentAction(DocumentActionDO.buildDocumentActionDO({
            actionParameterMap: { noReservedAddOnProducts: this._reserveAddOnProductsDO.reservedAddOnProductList.length },
            actionString: "%noReservedAddOnProducts% add on product(s) have been reserved for the booking",
            userId: this._sessionContext.sessionDO.user.id
        }));
    }
}