import { APaginatedTransactionalMongoPatch } from "../../utils/APaginatedTransactionalMongoPatch";
import { MongoRepository } from "../../../../../../data-layer/common/base/MongoRepository";
import { MongoPatchType } from "../MongoPatchType";
import { InvoiceGroupDO } from "../../../../../../data-layer/invoices/data-objects/InvoiceGroupDO";
import { InvoiceDO } from "../../../../../../data-layer/invoices/data-objects/InvoiceDO";
import { ThUtils } from "../../../../../../utils/ThUtils";
import { InvoicePayerDO } from "../../../../../../data-layer/invoices/data-objects/payers/InvoicePayerDO";

import _ = require('underscore');

export class P25_SetShouldApplyTransactionFeeOnInvoicePayer extends APaginatedTransactionalMongoPatch {

    protected getMongoRepository(): MongoRepository {
        return this._invoiceGroupsRepository;
    }

    public getPatchType(): MongoPatchType {
        return MongoPatchType.SetShouldApplyTransactionFeeOnInvoicePayer;
    }

    protected updateDocumentInMemory(invoiceGroup) {
        P25_SetShouldApplyTransactionFeeOnInvoicePayer.setShouldApplyTransactionFee(invoiceGroup);
        invoiceGroup.versionId++;
    }

    public static setShouldApplyTransactionFee(invoiceGroup: InvoiceGroupDO) {
        let thUtils = new ThUtils();
        _.forEach(invoiceGroup.invoiceList, (invoiceDO: InvoiceDO) => {
            _.forEach(invoiceDO.payerList, (invoicePayer: InvoicePayerDO) => {
                if(!_.isBoolean(invoicePayer.shouldApplyTransactionFee)) {
                    invoicePayer.shouldApplyTransactionFee = true;
                }    
            });
        });
    }

}