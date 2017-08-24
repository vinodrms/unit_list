import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { ThUtils } from '../../../../utils/ThUtils';
import { ThError } from '../../../../utils/th-responses/ThError';
import { ThLogger, ThLogLevel } from '../../../../utils/logging/ThLogger';
import { ThStatusCode } from '../../../../utils/th-responses/ThResponse';
import { InvoiceGroupDO } from '../../../../data-layer/invoices-deprecated/data-objects/InvoiceGroupDO';
import { InvoiceDO, InvoicePaymentStatus } from '../../../../data-layer/invoices-deprecated/data-objects/InvoiceDO';
import { InvoiceGroupMetaRepoDO, InvoiceGroupSearchResultRepoDO } from '../../../../data-layer/invoices-deprecated/repositories/IInvoiceGroupsRepository';
import { GenerateBookingInvoiceByUpdatingGroupStrategy } from './strategies/GenerateBookingInvoiceByUpdatingGroupStrategy';
import { GenerateBookingInvoiceByAddingGroupStrategy } from './strategies/GenerateBookingInvoiceByAddingGroupStrategy';
import { IGenerateBookingInvoiceActionStrategy } from './IGenerateBookingInvoiceActionStrategy';
import { BookingDO } from "../../../../data-layer/bookings/data-objects/BookingDO";

import _ = require("underscore");

export class GenerateBookingInvoiceActionFactory {
    private _thUtils: ThUtils;
    private _booking: BookingDO;
    private _bookingInvoice: InvoiceDO;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();
    }

    public getActionStrategy(booking: BookingDO, bookingInvoice: InvoiceDO): Promise<IGenerateBookingInvoiceActionStrategy> {
        this._booking = booking;
        this._bookingInvoice = bookingInvoice;
        return new Promise<IGenerateBookingInvoiceActionStrategy>((resolve: { (result: IGenerateBookingInvoiceActionStrategy): void }, reject: { (err: ThError): void }) => {
            this.getActionstrategyCore(resolve, reject);
        });
    }

    private getActionstrategyCore(resolve: { (result: IGenerateBookingInvoiceActionStrategy): void }, reject: { (err: ThError): void }) {
        var invoiceGroupMeta = this.buildInvoiceGroupMetaRepoDO();
        this._appContext.getRepositoryFactory().getInvoiceGroupsRepositoryDeprecated().getInvoiceGroupList(invoiceGroupMeta, { groupBookingId: this._booking.groupBookingId })
            .then((result: InvoiceGroupSearchResultRepoDO) => {
                var bookingInvoiceGroup: InvoiceGroupDO;
                if (_.isEmpty(result.invoiceGroupList)) {
                    bookingInvoiceGroup = this.buildInvoiceGroupDO(this._bookingInvoice);
                    resolve(new GenerateBookingInvoiceByAddingGroupStrategy(this._appContext, this._sessionContext, bookingInvoiceGroup, this._booking));
                }
                else {
                    bookingInvoiceGroup = this.buildInvoiceGroupDO(this._bookingInvoice, result.invoiceGroupList[0]);
                    resolve(new GenerateBookingInvoiceByUpdatingGroupStrategy(this._appContext, this._sessionContext, bookingInvoiceGroup, this._booking));
                }
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.GeneratInvoiceGroupActionFactoryError, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "error getting invoice group generation action (update or add new invoice group)", this._bookingInvoice, thError);
                reject(thError);
            });
    }

    private buildInvoiceGroupDO(bookingInvoice: InvoiceDO, loadedBookingInvoiceGroup?: InvoiceGroupDO): InvoiceGroupDO {
        var newInvoiceGroup = loadedBookingInvoiceGroup;

        if (this._thUtils.isUndefinedOrNull(newInvoiceGroup)) {
            newInvoiceGroup = new InvoiceGroupDO();
            newInvoiceGroup.hotelId = this._sessionContext.sessionDO.hotel.id;
            newInvoiceGroup.groupBookingId = this._booking.groupBookingId;
            newInvoiceGroup.invoiceList = [];
        }
        else {
            newInvoiceGroup.removeItemsPopulatedFromBooking();
        }
        newInvoiceGroup.invoiceList.push(bookingInvoice);
        return newInvoiceGroup;
    }

    private buildInvoiceGroupMetaRepoDO(): InvoiceGroupMetaRepoDO {
        return {
            hotelId: this._sessionContext.sessionDO.hotel.id
        };
    }
}
