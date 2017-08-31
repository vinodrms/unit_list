import { ThUtils } from '../../../../../../../common/utils/ThUtils';
import { BaseDO } from '../../../../../../../common/base/BaseDO';
import { IInvoiceItemMeta } from '../IInvoiceItemMeta';
import { ThTranslation } from '../../../../../../../common/utils/localization/ThTranslation';

export class AddOnProductInvoiceItemMetaDO extends BaseDO implements IInvoiceItemMeta {
    pricePerItem: number;
    vatId: string;
    numberOfItems: number;
    aopDisplayName: string;
    includedInBooking: boolean;

    constructor() {
        super();
        this.includedInBooking = false;
    }

    protected getPrimitivePropertyKeys(): string[] {
        return ["pricePerItem", "vatId", "numberOfItems", "aopDisplayName", "includedInBooking"];
    }
    public getTotalPrice(): number {
        return this.getUnitPrice() * this.getNumberOfItems();
    }
    public getUnitPrice(): number {
        return this.pricePerItem;
    }
    public getNumberOfItems(): number {
        return this.numberOfItems;
    }
    public getDisplayName(thTranslation: ThTranslation): string {
        return this.aopDisplayName;
    }
    public getVatId(): string {
        return this.vatId;
    }
    public isDerivedFromBooking(): boolean {
        return this.includedInBooking;
    }
}
