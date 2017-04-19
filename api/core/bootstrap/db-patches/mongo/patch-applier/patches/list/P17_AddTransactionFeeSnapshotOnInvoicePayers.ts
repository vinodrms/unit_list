import { APaginatedTransactionalMongoPatch } from "../../utils/APaginatedTransactionalMongoPatch";
import { MongoRepository } from "../../../../../../data-layer/common/base/MongoRepository";
import { MongoPatchType } from "../MongoPatchType";
import { InvoiceGroupDO } from "../../../../../../data-layer/invoices/data-objects/InvoiceGroupDO";
import { InvoiceDO } from "../../../../../../data-layer/invoices/data-objects/InvoiceDO";
import { InvoicePayerDO } from "../../../../../../data-layer/invoices/data-objects/payers/InvoicePayerDO";
import { TransactionFeeDO } from "../../../../../../data-layer/common/data-objects/payment-method/TransactionFeeDO";

import _ = require('underscore');

export class P17_AddTransactionFeeSnapshotOnInvoicePayers extends APaginatedTransactionalMongoPatch {

    protected getMongoRepository(): MongoRepository {
        return this._invoiceGroupsRepository;
    }

    public getPatchType(): MongoPatchType {
        return MongoPatchType.AddTransactionFeeSnapshotOnInvoicePayers;
    }

    protected updateDocumentInMemory(invoiceGroup) {
        P17_AddTransactionFeeSnapshotOnInvoicePayers.replacePMIdListWithPMInstanceList(invoiceGroup);
        invoiceGroup.versionId++;
    }

    public static replacePMIdListWithPMInstanceList(invoiceGroup: InvoiceGroupDO) {
        _.forEach(invoiceGroup.invoiceList, (invoiceDO: InvoiceDO) => {
            _.forEach(invoiceDO.payerList, (invoicePayerDO: InvoicePayerDO) => {
                if (_.isUndefined(invoicePayerDO["priceToPayPlusTransactionFee"])) {
                    invoicePayerDO.priceToPayPlusTransactionFee = invoicePayerDO.priceToPay;
                }
                if (_.isUndefined(invoicePayerDO["transactionFeeSnapshot"])) {
                    invoicePayerDO.transactionFeeSnapshot = TransactionFeeDO.getDefaultTransactionFee();
                }
            });
        });
    }

}