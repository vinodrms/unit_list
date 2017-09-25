import { IValidationStructure } from "../../../utils/th-validation/structure/core/IValidationStructure";
import { ObjectValidationStructure } from "../../../utils/th-validation/structure/ObjectValidationStructure";
import { PrimitiveValidationStructure } from "../../../utils/th-validation/structure/PrimitiveValidationStructure";
import { StringValidationRule } from "../../../utils/th-validation/rules/StringValidationRule";
import { AppContext } from "../../../utils/AppContext";
import { SessionContext } from "../../../utils/SessionContext";
import { InvoiceMetaRepoDO } from "../../../data-layer/invoices/repositories/IInvoiceRepository";
import { InvoiceDO, InvoicePaymentStatus, InvoiceStatus } from "../../../data-layer/invoices/data-objects/InvoiceDO";
import { ThError } from "../../../utils/th-responses/ThError";
import { ThStatusCode } from "../../../utils/th-responses/ThResponse";
import { ThLogLevel, ThLogger } from "../../../utils/logging/ThLogger";
import { InvoicePayerDO } from "../../../data-layer/invoices/data-objects/payer/InvoicePayerDO";
import { ThUtils } from "../../../utils/ThUtils";

import _ = require('underscore');

export class DeleteInvoice {
    private _invoiceMeta: InvoiceMetaRepoDO;
    private _invoiceId: string;

    private _loadedInvoice: InvoiceDO;
    private _thUtils: ThUtils;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._invoiceMeta = {
            hotelId: this._sessionContext.sessionDO.hotel.id
        }
        this._thUtils = new ThUtils();
    }

    public delete(invoiceId: string): Promise<InvoiceDO> {
        this._invoiceId = invoiceId;

        return new Promise<InvoiceDO>((resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void }) => {
            try {
                this.deleteCore(resolve, reject);
            } catch (error) {
                var thError = new ThError(ThStatusCode.DeleteRoomItemError, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "error deleting invoice", this._invoiceId, thError);
                reject(thError);
            }
        });
    }
    private deleteCore(resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void }) {
        var invoiceRepo = this._appContext.getRepositoryFactory().getInvoiceRepository();
        invoiceRepo.getInvoiceById(this._invoiceMeta, this._invoiceId)
            .then((result: InvoiceDO) => {
                this._loadedInvoice = result;

                if (!this._loadedInvoice.isUnpaid()) {
                    var thError = new ThError(ThStatusCode.DeleteInvoiceNotUnpaid, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "tried to delete an invoice which is not Unpaid", { invoiceId: this._invoiceId }, thError);
                    throw thError;
                }
                var payerWithPayments = _.find(this._loadedInvoice.payerList, (payer: InvoicePayerDO) => {
                    return payer.paymentList && payer.paymentList.length > 0;
                });
                if (!this._thUtils.isUndefinedOrNull(payerWithPayments)) {
                    var thError = new ThError(ThStatusCode.DeleteInvoiceHasPayments, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "tried to delete an invoice which has payments", { invoiceId: this._invoiceId }, thError);
                    throw thError;   
                }
                if (this._loadedInvoice.isReinstatement()) {
                    var thError = new ThError(ThStatusCode.DeleteInvoiceIsReinstatement, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "tried to delete an invoice which is reinstatement", { invoiceId: this._invoiceId }, thError);
                    throw thError;                     
                }
                if (this._loadedInvoice.itemList.length > 0) {
                    var thError = new ThError(ThStatusCode.DeleteInvoiceHasItems, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "tried to delete an invoice which has items", { invoiceId: this._invoiceId }, thError);
                    throw thError;                     
                }
                this._loadedInvoice.status = InvoiceStatus.Deleted;
                return invoiceRepo.updateInvoice({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                    id: this._loadedInvoice.id,
                    versionId: this._loadedInvoice.versionId
                }, this._loadedInvoice);
            })
            .then((deletedInvoice: InvoiceDO) => {
                resolve(deletedInvoice);
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.DeleteRoomItemError, error);
                if (thError.isNativeError()) {
                    ThLogger.getInstance().logError(ThLogLevel.Error, "error deleting room", this._invoiceId, thError);
                }
                reject(thError);
            });
    }
}