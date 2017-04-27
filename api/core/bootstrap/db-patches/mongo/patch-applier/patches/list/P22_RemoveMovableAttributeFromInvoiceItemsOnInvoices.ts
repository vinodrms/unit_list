import { APaginatedTransactionalMongoPatch } from "../../utils/APaginatedTransactionalMongoPatch";
import { MongoRepository } from "../../../../../../data-layer/common/base/MongoRepository";
import { MongoPatchType } from "../MongoPatchType";
import { InvoiceGroupDO } from "../../../../../../data-layer/invoices/data-objects/InvoiceGroupDO";
import { ThUtils } from "../../../../../../utils/ThUtils";
import { InvoiceDO, InvoiceAccountingType } from "../../../../../../data-layer/invoices/data-objects/InvoiceDO";
import { InvoiceItemDO, InvoiceItemAccountingType } from "../../../../../../data-layer/invoices/data-objects/items/InvoiceItemDO";

export class P22_RemoveMovableAttributeFromInvoiceItemsOnInvoices extends APaginatedTransactionalMongoPatch {

    protected getMongoRepository(): MongoRepository {
        return this._invoiceGroupsRepository;
    }

    public getPatchType(): MongoPatchType {
        return MongoPatchType.RemoveMovableAttributeFromInvoiceItemsOnInvoices;
    }

    protected updateDocumentInMemory(invoiceGroup) {
        P22_RemoveMovableAttributeFromInvoiceItemsOnInvoices.removeMovableAttributeFromInvoiceItemsOnInvoices(invoiceGroup);
        invoiceGroup.versionId++;
    }

    public static removeMovableAttributeFromInvoiceItemsOnInvoices(invoiceGroup: InvoiceGroupDO) {
        let thUtils = new ThUtils();
        invoiceGroup.invoiceList.forEach((invoiceDO: InvoiceDO) => {
            invoiceDO.itemList.forEach((invoiceItemDO: InvoiceItemDO) => {
                if (!thUtils.isUndefinedOrNull(invoiceItemDO.meta) && !thUtils.isUndefinedOrNull(invoiceItemDO.meta["movable"])) {
                    delete invoiceItemDO.meta["movable"];
                }
            });
        });
    }

}