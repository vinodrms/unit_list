import { APaginatedTransactionalMongoPatch } from "../../utils/APaginatedTransactionalMongoPatch";
import { MongoRepository } from "../../../../../../data-layer/common/base/MongoRepository";
import { MongoPatchType } from "../MongoPatchType";
import { InvoiceGroupDO } from "../../../../../../data-layer/invoices/data-objects/InvoiceGroupDO";
import { ThUtils } from "../../../../../../utils/ThUtils";
import { InvoiceDO, InvoiceAccountingType } from "../../../../../../data-layer/invoices/data-objects/InvoiceDO";

export class P20_AddInvoiceAccountingTypeDebitOnInvoices extends APaginatedTransactionalMongoPatch {

    protected getMongoRepository(): MongoRepository {
        return this._invoiceGroupsRepository;
    }

    public getPatchType(): MongoPatchType {
        return MongoPatchType.AddInvoiceAccountingTypeDebitOnInvoices;
    }

    protected updateDocumentInMemory(invoiceGroup) {
        P20_AddInvoiceAccountingTypeDebitOnInvoices.addInvoiceAccountingTypeDebitOnInvoices(invoiceGroup);
        invoiceGroup.versionId++;
    }

    public static addInvoiceAccountingTypeDebitOnInvoices(invoiceGroup: InvoiceGroupDO) {
        let thUtils = new ThUtils();
        _.forEach(invoiceGroup.invoiceList, (invoiceDO: InvoiceDO) => {
            if(thUtils.isUndefinedOrNull(invoiceDO.accountingType)) {
                invoiceDO.accountingType = InvoiceAccountingType.Debit;
            }    
        });
    }

}