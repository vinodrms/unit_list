import { ThUtils } from '../../../../../../../common/utils/ThUtils';
import { BaseDO } from '../../../../../../../common/base/BaseDO';
import { IInvoiceItemMeta } from '../IInvoiceItemMeta';
import { ThTranslation } from '../../../../../../../common/utils/localization/ThTranslation';

export class RoomCommissionItemMetaDO extends BaseDO implements IInvoiceItemMeta {
    pricePerItem: number;
    vatId: string;
    numberOfItems: number;
    displayName: string;

    protected getPrimitivePropertyKeys(): string[] {
        return ["pricePerItem", "vatId", "numberOfItems", "displayName"];
    }

    public getUnitPrice(): number {
        return this.pricePerItem;
    }
    public getNumberOfItems(): number {
        return this.numberOfItems;
    }
    public getTotalPrice(): number {
        return this.getNumberOfItems() * this.getUnitPrice();
    }
    public getDisplayName(thTranslation: ThTranslation): string {
        return thTranslation.translate(this.displayName);
    }
    public isDerivedFromBooking(): boolean {
        return true;
    }
    public getVatId(): string {
        return this.vatId;
    }
}
