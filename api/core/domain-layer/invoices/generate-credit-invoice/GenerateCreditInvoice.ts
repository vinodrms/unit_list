import { CreditedInvoiceMetaDO } from "./CreditedInvoiceMetaDO";
import { AppContext } from "../../../utils/AppContext";
import { SessionContext } from "../../../utils/SessionContext";
import { ThUtils } from "../../../utils/ThUtils";
import { InvoiceGroupDO } from "../../../data-layer/invoices/data-objects/InvoiceGroupDO";
import { ThError } from "../../../utils/th-responses/ThError";
import { InvoiceDO, InvoiceAccountingType, InvoicePaymentStatus } from "../../../data-layer/invoices/data-objects/InvoiceDO";
import { InvoiceGroupMetaRepoDO, InvoiceGroupItemMetaRepoDO } from "../../../data-layer/invoices/repositories/IInvoiceGroupsRepository";
import { ThStatusCode } from "../../../utils/th-responses/ThResponse";
import { ThLogLevel, ThLogger } from "../../../utils/logging/ThLogger";

import _ = require('underscore');

export class GenerateCreditInvoice {
    private _thUtils: ThUtils;
    private _creditedInvoiceMeta: CreditedInvoiceMetaDO;
    private _loadedInvoiceGroup: InvoiceGroupDO;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();

    }

    public generate(creditedInvoiceMeta: CreditedInvoiceMetaDO) {
        this._creditedInvoiceMeta = creditedInvoiceMeta;

        return new Promise<InvoiceGroupDO>((resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) => {
            this.generateCore(resolve, reject);
        });
    }

    public generateCore(resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) {
        let invoiceGroupRepo = this._appContext.getRepositoryFactory().getInvoiceGroupsRepository();

        invoiceGroupRepo.getInvoiceGroupById(this.invoiceGroupMeta,
            this._creditedInvoiceMeta.invoiceGroupId).then((loadedInvoiceGroup: InvoiceGroupDO) => {
                this._loadedInvoiceGroup = loadedInvoiceGroup;

                let invoiceToBeCredited: InvoiceDO;
                let invoiceToBeCreditedIndex: number;
                _.forEach(this._loadedInvoiceGroup.invoiceList, (invoiceDO: InvoiceDO, index: number) => {
                    if(invoiceDO.id === this._creditedInvoiceMeta.invoiceId) {
                        invoiceToBeCredited = invoiceDO;
                        invoiceToBeCreditedIndex = index;
                    }
                });

                let creditInvoice = this.getCreditInvoice(invoiceToBeCredited);
                this._loadedInvoiceGroup.invoiceList.splice(invoiceToBeCreditedIndex + 1, 0, creditInvoice);

                this._loadedInvoiceGroup.removeItemsPopulatedFromBooking();

                let invoiceGroupitemMeta = this.buildInvoiceGroupItemMetaRepoDO();
                return invoiceGroupRepo.updateInvoiceGroup(this.invoiceGroupMeta, invoiceGroupitemMeta, this._loadedInvoiceGroup);

            }).then((updatedInvoiceGroupDO: InvoiceGroupDO) => {
                resolve(updatedInvoiceGroupDO);
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.GenerateCreditInvoiceError, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "error crediting invoice", this._creditedInvoiceMeta, thError);
                reject(thError);
            });
    }

    private getCreditInvoice(invoiceToBeCredited: InvoiceDO): InvoiceDO {
        let creditInvoice = new InvoiceDO();
        creditInvoice.buildFromObject(invoiceToBeCredited);
        creditInvoice.accountingType = InvoiceAccountingType.Credit;
        creditInvoice.paymentStatus = InvoicePaymentStatus.Unpaid;
        delete creditInvoice.id;
        return creditInvoice;
    }

    private get invoiceGroupMeta(): InvoiceGroupMetaRepoDO {
        return {
            hotelId: this._sessionContext.sessionDO.hotel.id
        }
    }

    private buildInvoiceGroupItemMetaRepoDO(): InvoiceGroupItemMetaRepoDO {
        return {
            id: this._loadedInvoiceGroup.id,
			versionId: this._loadedInvoiceGroup.versionId
        }
    }
}