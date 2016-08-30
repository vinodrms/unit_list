import {BaseDO} from '../../../../../../../common/base/BaseDO';
import {ThUtils} from '../../../../../../../common/utils/ThUtils';
import {ThTranslation} from '../../../../../../../common/utils/localization/ThTranslation';
import {IInvoiceItemMeta} from '../IInvoiceItemMeta';

export class AddOnProductInvoiceItemMetaDO extends BaseDO implements IInvoiceItemMeta {
    movable: boolean;
    pricePerItem: number;
    vatValue: number;
    numberOfItems: number;
    aopDisplayName: string;

    protected getPrimitivePropertyKeys(): string[] {
        return ["movable", "pricePerItem", "vatValue", "numberOfItems", "aopDisplayName"];
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
    public isMovable(): boolean {
        var thUtils = new ThUtils();
        if(thUtils.isUndefinedOrNull(this.movable)) {
            return true;
        }
        return this.movable;
    }
    public getVatValue(): number {
        return this.vatValue;
    }
}