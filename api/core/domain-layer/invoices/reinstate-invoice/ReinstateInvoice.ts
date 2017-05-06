import { ReinstateInvoiceMetaDO } from "./ReinstateInvoiceMetaDO";
import { AppContext } from "../../../utils/AppContext";
import { SessionContext } from "../../../utils/SessionContext";
import { ThUtils } from "../../../utils/ThUtils";
import { InvoiceGroupDO } from "../../../data-layer/invoices/data-objects/InvoiceGroupDO";
import { ThError } from "../../../utils/th-responses/ThError";
import { InvoiceDO, InvoiceAccountingType, InvoicePaymentStatus } from "../../../data-layer/invoices/data-objects/InvoiceDO";
import { InvoiceGroupMetaRepoDO, InvoiceGroupItemMetaRepoDO } from "../../../data-layer/invoices/repositories/IInvoiceGroupsRepository";
import { ThStatusCode } from "../../../utils/th-responses/ThResponse";
import { ThLogLevel, ThLogger } from "../../../utils/logging/ThLogger";
import { InvoiceItemDO, InvoiceItemAccountingType } from "../../../data-layer/invoices/data-objects/items/InvoiceItemDO";
import { InvoicePayerDO } from "../../../data-layer/invoices/data-objects/payers/InvoicePayerDO";

import _ = require('underscore');

export class ReinstateInvoice {
    private _thUtils: ThUtils;
    private _reinstatedInvoiceMeta: ReinstateInvoiceMetaDO;
    private _loadedInvoiceGroup: InvoiceGroupDO;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();

    }

    public reinstate(reinstatedInvoiceMeta: ReinstateInvoiceMetaDO) {
        this._reinstatedInvoiceMeta = reinstatedInvoiceMeta;

        return new Promise<InvoiceGroupDO>((resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) => {
            this.reinstateCore(resolve, reject);
        });
    }

    public reinstateCore(resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) {
        let invoiceToBeReinstated: InvoiceDO;
        let invoiceToBeReinstatedIndex: number;

        let invoiceGroupRepo = this._appContext.getRepositoryFactory().getInvoiceGroupsRepository();
        invoiceGroupRepo.getInvoiceGroupById(this.invoiceGroupMeta,
            this._reinstatedInvoiceMeta.invoiceGroupId).then((loadedInvoiceGroup: InvoiceGroupDO) => {
                this._loadedInvoiceGroup = loadedInvoiceGroup;

                _.forEach(this._loadedInvoiceGroup.invoiceList, (invoiceDO: InvoiceDO, index: number) => {
                    if(invoiceDO.id === this._reinstatedInvoiceMeta.invoiceId) {
                        invoiceToBeReinstated = invoiceDO;
                        invoiceToBeReinstatedIndex = index;
                    }
                });

                let creditInvoice = this.getCreditInvoice(invoiceToBeReinstated);
                this._loadedInvoiceGroup.invoiceList.splice(invoiceToBeReinstatedIndex + 1, 0, creditInvoice);

                let reinstatementInvoice = this.getReinstatementInvoice(invoiceToBeReinstated);
                this._loadedInvoiceGroup.invoiceList.splice(invoiceToBeReinstatedIndex + 2, 0, reinstatementInvoice);

                this._loadedInvoiceGroup.removeItemsPopulatedFromBooking();

                let invoiceGroupitemMeta = this.buildInvoiceGroupItemMetaRepoDO();
                return invoiceGroupRepo.updateInvoiceGroup(this.invoiceGroupMeta, invoiceGroupitemMeta, this._loadedInvoiceGroup);

            }).then((updatedInvoiceGroupDO: InvoiceGroupDO) => {
                resolve(updatedInvoiceGroupDO);
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.ReinstateInvoiceError, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "error reinstating invoice", this._reinstatedInvoiceMeta, thError);
                reject(thError);
            });
    }

    private getReinstatementInvoice(invoiceToBeReinstated: InvoiceDO): InvoiceDO {
        let reinstatementInvoice = new InvoiceDO();
        reinstatementInvoice.buildFromObject(invoiceToBeReinstated);
        reinstatementInvoice.reinstatedInvoiceId = invoiceToBeReinstated.id;
        reinstatementInvoice.accountingType = InvoiceAccountingType.Debit;
        reinstatementInvoice.paymentStatus = InvoicePaymentStatus.Unpaid;

        _.forEach(reinstatementInvoice.itemList, (item: InvoiceItemDO) => {
            item.accountingType = InvoiceItemAccountingType.Debit;
        });

        delete reinstatementInvoice.id;
        delete reinstatementInvoice.paidDateUtcTimestamp;
        delete reinstatementInvoice.paidDateTimeUtcTimestamp;
        delete reinstatementInvoice.invoiceReference;
        delete reinstatementInvoice.paidDate;
        return reinstatementInvoice;
    }

    private getCreditInvoice(invoiceToBeCredited: InvoiceDO): InvoiceDO {
        let creditInvoice = new InvoiceDO();
        creditInvoice.buildFromObject(invoiceToBeCredited);
        creditInvoice.accountingType = InvoiceAccountingType.Credit;
        creditInvoice.paymentStatus = InvoicePaymentStatus.Unpaid;

        _.forEach(creditInvoice.itemList, (item: InvoiceItemDO) => {
            item.accountingType = InvoiceItemAccountingType.Credit;
        });
        
        _.forEach(creditInvoice.payerList, (payer: InvoicePayerDO) => {
            let transactionFee = this._thUtils.roundNumberToTwoDecimals(payer.priceToPayPlusTransactionFee - payer.priceToPay);
            payer.shouldApplyTransactionFee = false;
            payer.priceToPay = payer.priceToPay * -1;
            payer.priceToPayPlusTransactionFee = this._thUtils.roundNumberToTwoDecimals(payer.priceToPay + transactionFee);
        });

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