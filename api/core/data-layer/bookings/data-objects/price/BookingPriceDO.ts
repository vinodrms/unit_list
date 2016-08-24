import {BaseDO} from '../../../common/base/BaseDO';
import {ThTranslation} from '../../../../utils/localization/ThTranslation';
import {IInvoiceItemMeta} from '../../../invoices/data-objects/items/IInvoiceItemMeta';
import {InvoiceItemDO} from '../../../invoices/data-objects/items/InvoiceItemDO';
import {ThUtils} from '../../../../utils/ThUtils';

export enum BookingPriceType {
    BookingStay,
    Penalty
}

export class BookingPriceDO extends BaseDO implements IInvoiceItemMeta {
    movable: boolean;

    priceType: BookingPriceType;
    pricePerItem: number;
    numberOfItems: number;
    totalPrice: number;

    breakfast: InvoiceItemDO;
    includedInvoiceItemList: InvoiceItemDO[];

    protected getPrimitivePropertyKeys(): string[] {
        return ["movable", "priceType", "pricePerItem", "numberOfItems", "totalPrice"];
    }
    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.breakfast = new InvoiceItemDO();
        this.breakfast.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "breakfast"));

        this.includedInvoiceItemList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "includedInvoiceItemList"), (includedInvoiceItemObject: Object) => {
            var invoiceItem = new InvoiceItemDO();
            invoiceItem.buildFromObject(includedInvoiceItemObject);
            this.includedInvoiceItemList.push(invoiceItem);
        });
    }

    public getUnitPrice(): number {
        return this.pricePerItem;
    }
    public getNumberOfItems(): number {
        return this.numberOfItems;
    }
    public getDisplayName(thTranslation: ThTranslation): string {
        return thTranslation.translate(this.getDisplayNameCore(thTranslation));
    }
    private getDisplayNameCore(thTranslation: ThTranslation): string {
        switch (this.priceType) {
            case BookingPriceType.BookingStay:
                return this.getDisplayNameWithBreakfast(thTranslation);
            default:
                return thTranslation.translate("Cancellation Penalty");
        }
    }
    private getDisplayNameWithBreakfast(thTranslation: ThTranslation): string {
        if (!this.hasBreakfast()) {
            return thTranslation.translate("Booking");
        }
        return thTranslation.translate("Booking (includes %breakfastName%)", { breakfastName: this.breakfast.meta.getDisplayName(thTranslation) });
    }

    public isPenalty(): boolean {
        return this.priceType === BookingPriceType.Penalty;
    }

    public hasBreakfast() {
        var thUtils = new ThUtils();
        return !thUtils.isUndefinedOrNull(this.breakfast) && !thUtils.isUndefinedOrNull(this.breakfast.id);
    }

    public getRoomPrice(): number {
        var roomPrice = this.totalPrice;
        if (this.isPenalty()) {
            return roomPrice;
        }
        _.forEach(this.includedInvoiceItemList, (invoiceItem: InvoiceItemDO) => {
            roomPrice = roomPrice - invoiceItem.meta.getUnitPrice() * invoiceItem.meta.getNumberOfItems();
        });
        if (roomPrice < 0) { roomPrice = 0; }
        return roomPrice;
    }
    public getOtherPrice(): number {
        return this.totalPrice - this.getRoomPrice();
    }
    public setMovable(movable: boolean) {
        this.movable = movable;
    }
}