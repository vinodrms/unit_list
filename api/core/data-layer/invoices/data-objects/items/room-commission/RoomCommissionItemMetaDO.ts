import { ThUtils } from '../../../../../utils/ThUtils';
import { BaseDO } from '../../../../common/base/BaseDO';
import { IInvoiceItemMeta } from '../IInvoiceItemMeta';
import { ThTranslation } from '../../../../../utils/localization/ThTranslation';

export class RoomCommissionItemMetaDO extends BaseDO implements IInvoiceItemMeta {
    movable: boolean;

    pricePerItem: number;
    vatId: string;
    numberOfItems: number;
    displayName: string;

    protected getPrimitivePropertyKeys(): string[] {
        return ["movable", "pricePerItem", "vatId", "numberOfItems", "displayName"];
    }

    public getUnitPrice(): number {
        return this.pricePerItem;
    }
    public getNumberOfItems(): number {
        return this.numberOfItems;
    }
    public getDisplayName(thTranslation: ThTranslation): string {
        return thTranslation.translate(this.displayName);
    }
    public setMovable(movable: boolean) {
        this.movable = movable;
    }
    public isMovable(): boolean {
        var thUtils = new ThUtils();
        if (thUtils.isUndefinedOrNull(this.movable)) {
            return true;
        }
        return this.movable;
    }
    public getVatId(): string {
        return this.vatId;
    }
    public buildFromRoomCommission(deductedCommissionPrice: number) {
        this.movable = false;
        this.numberOfItems = -1;
        this.displayName = 'Deducted Room Commission';
        this.pricePerItem = deductedCommissionPrice;
    }
}