import { AppContext } from '../../../../../utils/AppContext';
import { SessionContext } from '../../../../../utils/SessionContext';
import { ThUtils } from '../../../../../utils/ThUtils';
import { ThLogger, ThLogLevel } from '../../../../../utils/logging/ThLogger';
import { ThError } from '../../../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../../../utils/th-responses/ThResponse';
import { ThTimestampDO } from '../../../../../utils/th-dates/data-objects/ThTimestampDO';
import { HotelDO } from '../../../../../data-layer/hotel/data-objects/HotelDO';

import { InvoiceGroupDO } from '../../../../../data-layer/invoices/data-objects/InvoiceGroupDO';
import { InvoiceDO, InvoicePaymentStatus } from '../../../../../data-layer/invoices/data-objects/InvoiceDO';
import { ISaveInvoiceGroupActionStrategy } from '../ISaveInvoiceGroupActionStrategy';
import { InvoiceGroupMetaRepoDO, InvoiceGroupItemMetaRepoDO } from '../../../../../data-layer/invoices/repositories/IInvoiceGroupsRepository';

export class InvoiceGroupUpdateStrategy implements ISaveInvoiceGroupActionStrategy {
    private _loadedInvoiceGroup: InvoiceGroupDO;

    private _thUtils: ThUtils;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext,
        private _invoiceGroupDO: InvoiceGroupDO) {
        this._thUtils = new ThUtils();
    }

    public saveInvoiceGroup(resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) {
        var invoiceGroupMeta = this.buildInvoiceGroupMetaRepoDO();
        var invoiceGroupRepo = this._appContext.getRepositoryFactory().getInvoiceGroupsRepository();

        invoiceGroupRepo.getInvoiceGroupById(invoiceGroupMeta, this._invoiceGroupDO.id)
            .then((loadedInvoiceGroup: InvoiceGroupDO) => {
                this._loadedInvoiceGroup = loadedInvoiceGroup;

                return this.savePaymentTimestampForMarkedAsPaidInvoices();
            }).then((result: InvoiceGroupDO) => {
                var invoiceGroupItemMeta = this.buildInvoiceGroupItemMetaRepoDO();

                var invoiceGroupRepo = this._appContext.getRepositoryFactory().getInvoiceGroupsRepository();
                return invoiceGroupRepo.updateInvoiceGroup(invoiceGroupMeta, invoiceGroupItemMeta, this._invoiceGroupDO);
            }).then((result: InvoiceGroupDO) => {
                resolve(result);
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.BookingInvoiceGroupUpdateStrategyErrorUpdating, error);
                if (thError.isNativeError()) {
                    ThLogger.getInstance().logError(ThLogLevel.Error, "error updating booking invoice group", this._invoiceGroupDO, thError);
                }
                reject(thError);
            });
    }

    private savePaymentTimestampForMarkedAsPaidInvoices(): Promise<InvoiceGroupDO> {
        return new Promise<InvoiceGroupDO>((resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) => {
            this.savePaymentTimestampForMarkedAsPaidInvoicesCore(resolve, reject);
        });
    }

    private savePaymentTimestampForMarkedAsPaidInvoicesCore(resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) {
        this._appContext.getRepositoryFactory().getHotelRepository().getHotelById(this._sessionContext.sessionDO.hotel.id)
            .then((loadedHotel: HotelDO) => {
                _.forEach(this._invoiceGroupDO.invoiceList, (invoice: InvoiceDO) => {
                    if (invoice.isClosed() && this._thUtils.isUndefinedOrNull(invoice.paidDate) && this._thUtils.isUndefinedOrNull(invoice.paidDateUtcTimestamp)) {
                        var thTimestamp = ThTimestampDO.buildThTimestampForTimezone(loadedHotel.timezone);
                        invoice.paidDate = thTimestamp.thDateDO;
                        invoice.paidDateUtcTimestamp = invoice.paidDate.getUtcTimestamp();
                        invoice.paidDateTimeUtcTimestamp = thTimestamp.getUtcTimestamp();
                    }
                });
                resolve(this._invoiceGroupDO);
            })
            .catch((error: any) => {
                var thError = new ThError(ThStatusCode.BookingInvoiceGroupUpdateStrategyErrorSavingPaymentDate, error);
                if (thError.isNativeError()) {
                    ThLogger.getInstance().logError(ThLogLevel.Error, "Error saving the payment date an timestamp", this._invoiceGroupDO, thError);
                }
                reject(thError);
            });
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
        };
    }
}