import { InvoiceItemDO } from '../data-objects/items/InvoiceItemDO';
import { ThTranslation } from '../../../../../common/utils/localization/ThTranslation';
import { ThUtils } from '../../../../../common/utils/ThUtils';
import { BookingPriceDO } from "../../bookings/data-objects/price/BookingPriceDO";

export class InvoiceItemVM {
    private _thUtils: ThUtils;

    invoiceItemDO: InvoiceItemDO;

    constructor(private _thTranslation: ThTranslation) {
        this._thUtils = new ThUtils();
    }

    public buildFromInvoiceItem(invoiceItemDO: InvoiceItemDO) {
        this.invoiceItemDO = invoiceItemDO;
    }

    public get itemDisplayText(): string {
        return this.invoiceItemDO.meta.getDisplayName(this._thTranslation);
    }
    public get qty(): number {
        return this.invoiceItemDO.meta.getNumberOfItems();
    }
    public get price(): number {
        return this.invoiceItemDO.meta.getUnitPrice();
    }
    public get totalPrice(): number {
        return this._thUtils.roundNumberToTwoDecimals(this.invoiceItemDO.meta.getUnitPrice() * this.qty);
    }
    public isMovable(): boolean {
        return this.invoiceItemDO.meta.isMovable();
    }
    public displayBookingDateBreakdown(): boolean {
        if (!this.invoiceItemDO.isBookingPrice()) {
            return false;
        }
        let bookingPrice: BookingPriceDO = <BookingPriceDO>this.invoiceItemDO.meta;
        return bookingPrice.roomPricePerNightList.length > 0;
    }

    public buildPrototype(): InvoiceItemVM {
        var invoiceItemVMCopy = new InvoiceItemVM(this._thTranslation);
        var invoiceItemDOCopy = new InvoiceItemDO();
        invoiceItemDOCopy.buildFromObject(this.invoiceItemDO);
        invoiceItemVMCopy.invoiceItemDO = invoiceItemDOCopy;
        return invoiceItemVMCopy;
    }

    public buildFromInvoiceItemDO(invoiceItemDO: InvoiceItemDO) {
        this.invoiceItemDO = invoiceItemDO;
    }
}