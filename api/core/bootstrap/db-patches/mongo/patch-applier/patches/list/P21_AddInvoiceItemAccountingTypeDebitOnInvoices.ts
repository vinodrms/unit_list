import { APaginatedTransactionalMongoPatch } from "../../utils/APaginatedTransactionalMongoPatch";
import { MongoRepository } from "../../../../../../data-layer/common/base/MongoRepository";
import { MongoPatchType } from "../MongoPatchType";
import { InvoiceGroupDO } from "../../../../../../data-layer/invoices/data-objects/InvoiceGroupDO";
import { ThUtils } from "../../../../../../utils/ThUtils";
import { InvoiceDO, InvoiceAccountingType } from "../../../../../../data-layer/invoices/data-objects/InvoiceDO";
import { InvoiceItemDO, InvoiceItemAccountingType } from "../../../../../../data-layer/invoices/data-objects/items/InvoiceItemDO";

import _ = require('underscore');

export class P21_AddInvoiceItemAccountingTypeDebitOnInvoices extends APaginatedTransactionalMongoPatch {

    protected getMongoRepository(): MongoRepository {
        return this._invoiceGroupsRepository;
    }

    public getPatchType(): MongoPatchType {
        return MongoPatchType.AddInvoiceItemAccountingTypeDebitOnInvoices;
    }

    protected updateDocumentInMemory(invoiceGroup) {
        P21_AddInvoiceItemAccountingTypeDebitOnInvoices.addInvoiceItemAccountingTypeDebitOnInvoices(invoiceGroup);
        invoiceGroup.versionId++;
    }

    public static addInvoiceItemAccountingTypeDebitOnInvoices(invoiceGroup: InvoiceGroupDO) {
        let thUtils = new ThUtils();
        _.forEach(invoiceGroup.invoiceList, (invoiceDO: InvoiceDO) => {
            _.forEach(invoiceDO.itemList, (invoiceItemDO: InvoiceItemDO) => {
                if(thUtils.isUndefinedOrNull(invoiceItemDO.accountingType)) {
                    invoiceItemDO.accountingType = InvoiceItemAccountingType.Debit;
                }
            });
        });
    }

}