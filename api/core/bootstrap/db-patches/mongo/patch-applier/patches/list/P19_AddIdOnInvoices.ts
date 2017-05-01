import { APaginatedTransactionalMongoPatch } from "../../utils/APaginatedTransactionalMongoPatch";
import { MongoRepository } from "../../../../../../data-layer/common/base/MongoRepository";
import { MongoPatchType } from "../MongoPatchType";
import { InvoiceGroupDO } from "../../../../../../data-layer/invoices/data-objects/InvoiceGroupDO";
import { InvoiceDO } from "../../../../../../data-layer/invoices/data-objects/InvoiceDO";
import { ThUtils } from "../../../../../../utils/ThUtils";

import _ = require('underscore');

export class P19_AddIdOnInvoices extends APaginatedTransactionalMongoPatch {

    protected getMongoRepository(): MongoRepository {
        return this._invoiceGroupsRepository;
    }

    public getPatchType(): MongoPatchType {
        return MongoPatchType.AddIdOnInvoices;
    }

    protected updateDocumentInMemory(invoiceGroup) {
        P19_AddIdOnInvoices.attachIdToInvoices(invoiceGroup);
        invoiceGroup.versionId++;
    }

    public static attachIdToInvoices(invoiceGroup: InvoiceGroupDO) {
        let thUtils = new ThUtils();
        _.forEach(invoiceGroup.invoiceList, (invoiceDO: InvoiceDO) => {
            if(thUtils.isUndefinedOrNull(invoiceDO.id)) {
                invoiceDO.id = thUtils.generateUniqueID();
            }    
        });
    }

}