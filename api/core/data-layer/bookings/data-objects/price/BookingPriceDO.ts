import {BaseDO} from '../../../common/base/BaseDO';
import {ThTranslation} from '../../../../utils/localization/ThTranslation';
import {IInvoiceItemMeta} from '../../../invoices/data-objects/items/IInvoiceItemMeta';

export enum BookingPriceType {
    BookingStay,
    Penalty
}

export class BookingPriceDO extends BaseDO implements IInvoiceItemMeta {
    priceType: BookingPriceType;
    pricePerItem: number;
    numberOfItems: number;
    totalPrice: number;

    protected getPrimitivePropertyKeys(): string[] {
        return ["priceType", "pricePerItem", "numberOfItems", "totalPrice"];
    }

    public getPrice(): Promise<number> {
        return new Promise<number>((resolve: { (result: number): void }, reject: { (err: any): void }) => {
            resolve(this.pricePerItem);    
        });
    }
    public getNumberOfItems(): number {
        return this.numberOfItems;
    }
    public getDisplayName(thTranslation: ThTranslation): string {
        return thTranslation.translate(this.getDisplayNameCore());
    }
    private getDisplayNameCore(): string {
        switch (this.priceType) {
            case BookingPriceType.BookingStay:
                return "Booking";
            default:
                return "Cancellation Penalty";
        }
    }
}