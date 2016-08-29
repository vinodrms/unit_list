import {ThUtils} from '../../../../../utils/ThUtils';
import {BaseDO} from '../../../../common/base/BaseDO';
import {IInvoiceItemMeta} from '../IInvoiceItemMeta';
import {ThTranslation} from '../../../../../utils/localization/ThTranslation';

export class AddOnProductInvoiceItemMetaDO extends BaseDO implements IInvoiceItemMeta {
    movable: boolean;

    pricePerItem: number;
    numberOfItems: number;
    aopDisplayName: string;

    protected getPrimitivePropertyKeys(): string[] {
        return ["movable", "pricePerItem", "numberOfItems", "aopDisplayName"];
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
    public setMovable(movable: boolean) {
        this.movable = movable;
    }
    public isMovable(): boolean {
        var thUtils = new ThUtils();
        if(thUtils.isUndefinedOrNull(this.movable)) {
            return true;
        }
        return this.movable;
    }
}