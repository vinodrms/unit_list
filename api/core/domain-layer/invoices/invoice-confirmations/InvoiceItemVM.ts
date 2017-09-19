import { InvoiceItemDO } from "../../../data-layer/invoices/data-objects/items/InvoiceItemDO";
import { ThTranslation } from "../../../utils/localization/ThTranslation";

export class InvoiceItemVM {
    item: InvoiceItemDO;

    isRemovable: boolean;
    isMovable: boolean;
    isRelatedToBooking: boolean;
    numberOfItems: number;
    unitPrice: number;
    totalPrice: number;
    displayText: string;
    displayTextParams: Object;
    isLastOne: boolean;

    public static build(item: InvoiceItemDO, isRelatedToBooking: boolean): InvoiceItemVM {
        let itemVm = new InvoiceItemVM();
        itemVm.item = item;
        itemVm.isRemovable = true;
        itemVm.isMovable = true;
        itemVm.isRelatedToBooking = isRelatedToBooking;
        itemVm.numberOfItems = item.meta.getNumberOfItems();
        itemVm.unitPrice = item.meta.getUnitPrice();
        itemVm.totalPrice = item.meta.getTotalPrice();
        itemVm.isLastOne = false;
        return itemVm;
    }

    getDisplayName(thTranslation: ThTranslation): string {
        if (!this.displayText) {
            return this.item.meta.getDisplayName(thTranslation);
        }
        return thTranslation.translate(this.displayText, this.displayTextParams);
    }
}
