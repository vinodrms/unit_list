import {BaseDO} from '../../../../common/base/BaseDO';
import {IInvoiceItemMeta} from '../IInvoiceItemMeta';
import {ThTranslation} from '../../../../../utils/localization/ThTranslation';

export class AddOnProductInvoiceItemMetaDO extends BaseDO implements IInvoiceItemMeta {
    pricePerItem: number;
    numberOfItems: number;
    aopDisplayName: string;

    protected getPrimitivePropertyKeys(): string[] {
        return ["pricePerItem", "numberOfItems", "aopDisplayName"];
    }

    public getPriceForItem(): number {
        return this.pricePerItem;
    }
    public getNumberOfItems(): number {
        return this.numberOfItems;
    }
    public getDisplayName(thTranslation: ThTranslation): string {
        return this.aopDisplayName;
    }
}