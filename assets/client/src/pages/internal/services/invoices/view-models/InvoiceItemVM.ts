import { InvoiceItemDO, InvoiceItemType, InvoiceItemAccountingType } from '../data-objects/items/InvoiceItemDO';
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
        let noOfItems = this.invoiceItemDO.meta.getNumberOfItems();
        return this.invoiceItemDO.accountingType === InvoiceItemAccountingType.Credit? noOfItems * -1 : noOfItems;
    }
    public get price(): number {
        return this.invoiceItemDO.meta.getUnitPrice();
    }
    public get totalPrice(): number {
        return this.invoiceItemDO.getTotalPrice();
    }
    public isMovable(): boolean {
        return this.invoiceItemDO.meta.isMovableByDefault() 
            && this.invoiceItemDO.accountingType === InvoiceItemAccountingType.Debit;
    }
    public displayBookingDateBreakdown(): boolean {
        if (!(this.invoiceItemDO.type === InvoiceItemType.Booking)) {
            return false;
        }
        let bookingPrice: BookingPriceDO = <BookingPriceDO>this.invoiceItemDO.meta;
        return !bookingPrice.isPenalty();
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