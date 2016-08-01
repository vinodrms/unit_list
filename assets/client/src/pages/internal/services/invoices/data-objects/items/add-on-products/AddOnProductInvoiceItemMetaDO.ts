import {BaseDO} from '../../../../../../../common/base/BaseDO';
import {ThUtils} from '../../../../../../../common/utils/ThUtils';
import {ThTranslation} from '../../../../../../../common/utils/localization/ThTranslation';
import {IInvoiceItemMeta} from '../IInvoiceItemMeta';

export class AddOnProductInvoiceItemMetaDO extends BaseDO implements IInvoiceItemMeta {
    pricePerItem: number;
    numberOfItems: number;
    aopDisplayName: string;

    protected getPrimitivePropertyKeys(): string[] {
        return ["pricePerItem", "numberOfItems", "aopDisplayName"];
    }

    public getPrice(): number {
        return this.pricePerItem;
    }
    public getNumberOfItems(): number {
        return this.numberOfItems;
    }
    public getDisplayName(thTranslation: ThTranslation): string {
        return this.aopDisplayName;
    }
}