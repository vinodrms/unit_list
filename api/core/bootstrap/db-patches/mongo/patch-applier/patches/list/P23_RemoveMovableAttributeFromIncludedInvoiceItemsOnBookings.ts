import { APaginatedTransactionalMongoPatch } from "../../utils/APaginatedTransactionalMongoPatch";
import { MongoRepository } from "../../../../../../data-layer/common/base/MongoRepository";
import { MongoPatchType } from "../MongoPatchType";
import { InvoiceGroupDO } from "../../../../../../data-layer/invoices/data-objects/InvoiceGroupDO";
import { ThUtils } from "../../../../../../utils/ThUtils";
import { InvoiceDO, InvoiceAccountingType } from "../../../../../../data-layer/invoices/data-objects/InvoiceDO";
import { InvoiceItemDO, InvoiceItemAccountingType } from "../../../../../../data-layer/invoices/data-objects/items/InvoiceItemDO";

export class P23_RemoveMovableAttributeFromIncludedInvoiceItemsOnBookings extends APaginatedTransactionalMongoPatch {

    protected getMongoRepository(): MongoRepository {
        return this._legacyBookingGroupRepository;
    }

    public getPatchType(): MongoPatchType {
        return MongoPatchType.RemoveMovableAttributeFromIncludedInvoiceItemsOnBookings;
    }

    protected updateDocumentInMemory(bookingGroup) {
        P23_RemoveMovableAttributeFromIncludedInvoiceItemsOnBookings.removeMovableAttributeFromIncludedInvoiceItemsOnBookings(bookingGroup);
        bookingGroup.versionId++;
    }

    public static removeMovableAttributeFromIncludedInvoiceItemsOnBookings(bookingGroup: any) {
        let thUtils = new ThUtils();
        bookingGroup.bookingList.forEach(booking => {
            booking.price.includedInvoiceItemList.forEach((invoiceItemDO: InvoiceItemDO) => {
                if (!thUtils.isUndefinedOrNull(invoiceItemDO.meta) && !thUtils.isUndefinedOrNull(invoiceItemDO.meta["movable"])) {
                    delete invoiceItemDO.meta["movable"];
                }
            });
        });
    }

}