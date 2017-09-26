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
    private invoiceMeta: InvoiceMetaRepoDO;
    private invoiceId: string;

    private loadedInvoice: InvoiceDO;

    constructor(private appContext: AppContext, private sessionContext: SessionContext) {
        this.invoiceMeta = {
            hotelId: this.sessionContext.sessionDO.hotel.id
        }
    }

    public delete(invoiceId: string): Promise<InvoiceDO> {
        this.invoiceId = invoiceId;

        return new Promise<InvoiceDO>((resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void }) => {
            try {
                this.deleteCore(resolve, reject);
            } catch (error) {
                var thError = new ThError(ThStatusCode.DeleteRoomItemError, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "error deleting invoice", { invoiceId: this.invoiceId }, thError);
                reject(thError);
            }
        });
    }
    private deleteCore(resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void }) {
        var invoiceRepo = this.appContext.getRepositoryFactory().getInvoiceRepository();
        invoiceRepo.getInvoiceById(this.invoiceMeta, this.invoiceId)
            .then((result: InvoiceDO) => {
                this.loadedInvoice = result;

                if (!this.loadedInvoice.isUnpaid()) {
                    var thError = new ThError(ThStatusCode.DeleteInvoiceNotUnpaid, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "tried to delete an invoice which is not Unpaid", { invoiceId: this.invoiceId }, thError);
                    throw thError;
                }
                var payerWithPayments = _.find(this.loadedInvoice.payerList, (payer: InvoicePayerDO) => {
                    return payer.paymentList && payer.paymentList.length > 0;
                });
                if (!this.appContext.thUtils.isUndefinedOrNull(payerWithPayments)) {
                    var thError = new ThError(ThStatusCode.DeleteInvoiceHasPayments, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "tried to delete an invoice which has payments", { invoiceId: this.invoiceId }, thError);
                    throw thError;
                }
                if (this.loadedInvoice.isReinstatement()) {
                    var thError = new ThError(ThStatusCode.DeleteInvoiceIsReinstatement, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "tried to delete an invoice which is reinstatement", { invoiceId: this.invoiceId }, thError);
                    throw thError;
                }
                if (this.loadedInvoice.itemList.length > 0) {
                    var thError = new ThError(ThStatusCode.DeleteInvoiceHasItems, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "tried to delete an invoice which has items", { invoiceId: this.invoiceId }, thError);
                    throw thError;
                }
                this.loadedInvoice.status = InvoiceStatus.Deleted;
                return invoiceRepo.updateInvoice({ hotelId: this.sessionContext.sessionDO.hotel.id }, {
                    id: this.loadedInvoice.id,
                    versionId: this.loadedInvoice.versionId
                }, this.loadedInvoice);
            })
            .then((deletedInvoice: InvoiceDO) => {
                resolve(deletedInvoice);
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.DeleteRoomItemError, error);
                if (thError.isNativeError()) {
                    ThLogger.getInstance().logError(ThLogLevel.Error, "error deleting room", this.invoiceId, thError);
                }
                reject(thError);
            });
    }
}
