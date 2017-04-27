import { CreditedInvoiceMetaDO } from "./CreditedInvoiceMetaDO";
import { AppContext } from "../../../utils/AppContext";
import { SessionContext } from "../../../utils/SessionContext";
import { ThUtils } from "../../../utils/ThUtils";
import { InvoiceGroupDO } from "../../../data-layer/invoices/data-objects/InvoiceGroupDO";
import { ThError } from "../../../utils/th-responses/ThError";
import { InvoiceDO } from "../../../data-layer/invoices/data-objects/InvoiceDO";
import { InvoiceGroupMetaRepoDO } from "../../../data-layer/invoices/repositories/IInvoiceGroupsRepository";
import { ThStatusCode } from "../../../utils/th-responses/ThResponse";
import { ThLogLevel, ThLogger } from "../../../utils/logging/ThLogger";

import _ = require('underscore');

export class GenerateCreditInvoice {
    private _thUtils: ThUtils;
    private _creditedInvoiceMeta: CreditedInvoiceMetaDO;
    private _creditedInvoiceGroup: InvoiceDO;

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
        this._appContext.getRepositoryFactory().getInvoiceGroupsRepository().getInvoiceGroupById(this.invoiceGroupMeta,
            this._creditedInvoiceMeta.invoiceGroupId).then((invoiceGroup: InvoiceGroupDO) => {
                let invoiceToBeCredited = _.find(invoiceGroup.invoiceList, (invoiceDO: InvoiceDO) => {
                    return invoiceDO.id === this._creditedInvoiceMeta.invoiceId;
                });

                resolve(invoiceGroup);
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.GenerateCreditInvoiceError, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "error crediting invoice", this._creditedInvoiceMeta, thError);
                reject(thError);
            });
    }

    public get invoiceGroupMeta(): InvoiceGroupMetaRepoDO {
        return {
            hotelId: this._sessionContext.sessionDO.hotel.id
        }
    }
}