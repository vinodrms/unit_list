import { ThTranslation } from '../../../utils/localization/ThTranslation';
import { ThUtils } from '../../../utils/ThUtils';
import { SessionContext } from '../../../utils/SessionContext';
import { CustomerDO } from '../../../data-layer/customers/data-objects/CustomerDO';
import { AddOnProductDO } from '../../../data-layer/add-on-products/data-objects/AddOnProductDO';
import { TaxDO } from '../../../data-layer/taxes/data-objects/TaxDO';
import { PaymentMethodDO } from '../../../data-layer/common/data-objects/payment-method/PaymentMethodDO';
import { HotelDO } from '../../../data-layer/hotel/data-objects/HotelDO';
import { RoomDO } from '../../../data-layer/rooms/data-objects/RoomDO';
import { InvoiceItemDO } from "../../../data-layer/invoices/data-objects/items/InvoiceItemDO";
import { AddOnProductInvoiceItemMetaDO } from "../../../data-layer/invoices/data-objects/items/add-on-products/AddOnProductInvoiceItemMetaDO";
import { InvoiceDO } from "../../../data-layer/invoices/data-objects/InvoiceDO";

export class InvoiceAggregatedData {
    private static SHARED_INVOICE_ITEM_DISPLAY_NAME = "Shared Payment";
    private _thTranslation: ThTranslation;
    private _thUtils: ThUtils;

    hotel: HotelDO;
    ccySymbol: string;
    private _invoice: InvoiceDO;
    public get invoice(): InvoiceDO {
        return this._invoice;
    }
    public set invoice(value: InvoiceDO) {
        this._invoice = value;
        this.processedInvoice = new InvoiceDO();
        this.processedInvoice.buildFromObject(value);
    }
    // the processed invoice contains some dynamic items e.g., the shared payment item
    processedInvoice: InvoiceDO;
    payerIndexOnInvoice: number;
    payerCustomer: CustomerDO;
    addOnProductList: AddOnProductDO[];
    vatList: TaxDO[];
    paymentMethodList: PaymentMethodDO[];
    guestList: CustomerDO[];
    roomList: RoomDO[];

    constructor(private _sessionContext: SessionContext) {
        this._thTranslation = new ThTranslation(this._sessionContext.language);
        this._thUtils = new ThUtils();
    }

    public addSharedInvoiceItemIfNecessary() {
        if (this.processedInvoice.payerList.length > 1) {
            var sharedInvoiceItem = new InvoiceItemDO();
            var sharedInvoiceItemMeta = new AddOnProductInvoiceItemMetaDO();
            sharedInvoiceItemMeta.aopDisplayName = this._thTranslation.translate(InvoiceAggregatedData.SHARED_INVOICE_ITEM_DISPLAY_NAME);
            sharedInvoiceItemMeta.numberOfItems = -1;
            sharedInvoiceItemMeta.pricePerItem = this._thUtils.roundNumberToTwoDecimals(this.processedInvoice.amountToPay - this.processedInvoice.payerList[this.payerIndexOnInvoice].totalAmount);
            sharedInvoiceItem.meta = sharedInvoiceItemMeta;
            this.processedInvoice.itemList.push(sharedInvoiceItem);
        }
    }
}
