import { AppContext } from '../../../../../utils/AppContext';
import { SessionContext } from '../../../../../utils/SessionContext';
import { ThLogger, ThLogLevel } from '../../../../../utils/logging/ThLogger';
import { ThError } from '../../../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../../../utils/th-responses/ThResponse';

import { InvoiceGroupMetaRepoDO, InvoiceGroupItemMetaRepoDO } from '../../../../../data-layer/invoices-deprecated/repositories/IInvoiceGroupsRepository';
import { InvoiceGroupDO } from '../../../../../data-layer/invoices-deprecated/data-objects/InvoiceGroupDO';
import { IGenerateBookingInvoiceActionStrategy } from '../IGenerateBookingInvoiceActionStrategy';
import { BookingDO } from "../../../../../data-layer/bookings/data-objects/BookingDO";
import { ThUtils } from "../../../../../utils/ThUtils";
import { BookingInvoiceSync } from "../../../../bookings/invoice-sync/BookingInvoiceSync";

export class GenerateBookingInvoiceByUpdatingGroupStrategy implements IGenerateBookingInvoiceActionStrategy {
    private _thUtils: ThUtils;

    private _invoiceGroupMeta: InvoiceGroupMetaRepoDO;
    private _loadedInvoiceGroup: InvoiceGroupDO;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext,
        private _invoiceGroupDO: InvoiceGroupDO, private _bookingDO: BookingDO) {
        this._thUtils = new ThUtils();
        this._invoiceGroupMeta = this.buildInvoiceGroupMetaRepoDO();
    }

    public generateBookingInvoice(resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) {
        var invoiceGroupRepo = this._appContext.getRepositoryFactory().getInvoiceGroupsRepository();

        invoiceGroupRepo.getInvoiceGroupById(this._invoiceGroupMeta, this._invoiceGroupDO.id)
            .then((loadedInvoiceGroup: InvoiceGroupDO) => {
                loadedInvoiceGroup.removeItemsPopulatedFromBooking();
                this._loadedInvoiceGroup = loadedInvoiceGroup;
                var itemMeta = this.buildInvoiceGroupItemMetaRepoDO();

                let invoiceGroupToSave = this._invoiceGroupDO;
                if (this.bookingAlreadyHasGeneratedInvoice()) {
                    invoiceGroupToSave = this._loadedInvoiceGroup;
                }
                return invoiceGroupRepo.updateInvoiceGroup(this._invoiceGroupMeta, itemMeta, invoiceGroupToSave);
            }).then((result: InvoiceGroupDO) => {
                // the repository may return other invoice items through its decorator => force sync total price
                let bookingInvoiceSync = new BookingInvoiceSync(this._appContext, this._sessionContext);
                return bookingInvoiceSync.syncInvoiceWithBookingPrice(this._bookingDO);
            }).then((updatedGroup: InvoiceGroupDO) => {
                resolve(updatedGroup);
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.InvoiceGroupsItemUpdateStrategyErrorUpdating, error);
                if (thError.isNativeError()) {
                    ThLogger.getInstance().logError(ThLogLevel.Error, "error updating invoice group item", this._invoiceGroupDO, thError);
                }
                reject(thError);
            });
    }

    private bookingAlreadyHasGeneratedInvoice() {
        let invoice = this._loadedInvoiceGroup.getInvoiceForBooking(this._bookingDO.id);
        return !this._thUtils.isUndefinedOrNull(invoice);
    }

    private buildInvoiceGroupMetaRepoDO(): InvoiceGroupMetaRepoDO {
        return {
            hotelId: this._sessionContext.sessionDO.hotel.id
        };
    }

    private buildInvoiceGroupItemMetaRepoDO(): InvoiceGroupItemMetaRepoDO {
        return {
            id: this._loadedInvoiceGroup.id,
            versionId: this._loadedInvoiceGroup.versionId
        }
    }
}
