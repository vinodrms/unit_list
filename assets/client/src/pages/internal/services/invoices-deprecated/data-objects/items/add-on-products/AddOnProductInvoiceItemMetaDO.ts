import {BaseDO} from '../../../../../../../common/base/BaseDO';
import {ThUtils} from '../../../../../../../common/utils/ThUtils';
import {ThTranslation} from '../../../../../../../common/utils/localization/ThTranslation';
import {IInvoiceItemMeta} from '../IInvoiceItemMeta';

export class AddOnProductInvoiceItemMetaDO extends BaseDO implements IInvoiceItemMeta {
    pricePerItem: number;
    vatId: string;
    numberOfItems: number;
    aopDisplayName: string;
    includedInBooking: boolean;

    protected getPrimitivePropertyKeys(): string[] {
        return ["includedInBooking", "pricePerItem", "vatId", "numberOfItems", "aopDisplayName"];
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
    public isMovableByDefault(): boolean {
        if(this.includedInBooking) {
            return false;
        }
        return true;
    }
    public isDerivedFromBooking(): boolean {
        return this.includedInBooking;
    }
}