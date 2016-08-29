import {ThLogger, ThLogLevel} from '../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../../utils/AppContext';
import {SessionContext} from '../../../../../utils/SessionContext';
import {IAssignRoomStrategy, AssignRoomValidationDO} from './IAssignRoomStrategy';
import {BookingDO, BookingConfirmationStatus} from '../../../../../data-layer/bookings/data-objects/BookingDO';
import {AAssignRoomStrategy} from './AAssignRoomStrategy';
import {GenerateBookingInvoice} from '../../../../invoices/generate-booking-invoice/GenerateBookingInvoice';
import {InvoiceGroupDO} from '../../../../../data-layer/invoices/data-objects/InvoiceGroupDO';
import {GenerateBookingInvoiceAopMeta} from '../../../../invoices/generate-booking-invoice/GenerateBookingInvoiceDO';
import {AddOnProductLoader, AddOnProductItemContainer, AddOnProductItem} from '../../../../add-on-products/validators/AddOnProductLoader';

import _ = require('underscore');

export class CheckInStrategy extends AAssignRoomStrategy {
    constructor(private _appContext: AppContext, sessionContext: SessionContext) {
        super(sessionContext);
    }

    protected updateAdditionalFieldsCore(resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }, validationDO: AssignRoomValidationDO) {
        var bookingDO = validationDO.booking;
        if (bookingDO.confirmationStatus !== BookingConfirmationStatus.Confirmed && bookingDO.confirmationStatus !== BookingConfirmationStatus.Guaranteed) {
            var thError = new ThError(ThStatusCode.CheckInStrategyOnlyConfirmedOrGuaranteed, null);
            ThLogger.getInstance().logBusiness(ThLogLevel.Error, "Tried to check in a booking with status != {Confirmed,Guaranteed}", { sessionContext: this._sessionContext, bookingId: bookingDO.bookingId }, thError);
            reject(thError);
            return;
        }
        if (!bookingDO.defaultBillingDetails.paymentGuarantee) {
            var thError = new ThError(ThStatusCode.CheckInStrategyNoPaymentGuarantee, null);
            ThLogger.getInstance().logBusiness(ThLogLevel.Error, "Tried to check in a booking without payment guarantee", { sessionContext: this._sessionContext, bookingId: bookingDO.bookingId }, thError);
            reject(thError);
            return;
        }
        if (bookingDO.interval.start.isAfter(validationDO.currentHotelTimestamp.thDateDO)) {
            var thError = new ThError(ThStatusCode.CheckInStrategyStartDateInFuture, null);
            ThLogger.getInstance().logBusiness(ThLogLevel.Error, "Tried to check in a booking that starts in the future", { sessionContext: this._sessionContext, bookingId: bookingDO.bookingId }, thError);
            reject(thError);
            return;
        }
        if (bookingDO.interval.end.isBefore(validationDO.currentHotelTimestamp.thDateDO)) {
            var thError = new ThError(ThStatusCode.CheckInStrategyEndDateInPast, null);
            ThLogger.getInstance().logBusiness(ThLogLevel.Error, "Tried to check in a booking that has end date in the past", { sessionContext: this._sessionContext, bookingId: bookingDO.bookingId }, thError);
            reject(thError);
            return;
        }
        bookingDO.confirmationStatus = BookingConfirmationStatus.CheckedIn;
        this.logRoomChangedOnBooking(bookingDO, "The customers were checked in room %roomName%", validationDO.roomList);
        resolve(bookingDO);
    }
    public validateAlreadyCheckedInBooking(): boolean {
        return true;
    }
    protected generateInvoiceIfNecessaryCore(resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }, booking: BookingDO) {
        var addOnProductLoader = new AddOnProductLoader(this._appContext, this._sessionContext);
        addOnProductLoader.load(booking.reservedAddOnProductIdList)
            .then((addOnProductItemContainer: AddOnProductItemContainer) => {
                var generateBookingInvoice = new GenerateBookingInvoice(this._appContext, this._sessionContext);
                return generateBookingInvoice.generate({
                    groupBookingId: booking.groupBookingId,
                    bookingId: booking.bookingId,
                    initialAddOnProducts: this.getGenerateBookingInvoiceAop(booking.reservedAddOnProductIdList, addOnProductItemContainer)
                });
            }).then((invoiceGroup: InvoiceGroupDO) => {
                resolve(booking);
            }).catch((error: ThError) => {
                reject(error);
            });
    }

    private getGenerateBookingInvoiceAop(addOnProductIdList: string[], addOnProductsContainer: AddOnProductItemContainer): GenerateBookingInvoiceAopMeta[] {
        var initialAddOnProducts: GenerateBookingInvoiceAopMeta[] = [];
        if (this._thUtils.isUndefinedOrNull(addOnProductIdList) || !_.isArray(addOnProductIdList)) {
            return initialAddOnProducts;
        }
        var aopCountMap: { [id: string]: number; } = _.countBy(addOnProductIdList, (aopId: string) => { return aopId });
        var aopIdList: string[] = Object.keys(aopCountMap);
        _.forEach(aopIdList, (aopId: string) => {
            var addOnProductItem: AddOnProductItem = addOnProductsContainer.getAddOnProductItemById(aopId);
            if (!this._thUtils.isUndefinedOrNull(addOnProductItem)) {
                var noOfItems = aopCountMap[aopId];
                initialAddOnProducts.push({
                    addOnProductDO: addOnProductItem.addOnProduct,
                    noOfItems: noOfItems
                });
            }
        });
        return initialAddOnProducts;
    }
}