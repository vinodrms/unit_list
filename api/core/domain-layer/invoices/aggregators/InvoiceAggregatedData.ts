import {ThTranslation} from '../../../utils/localization/ThTranslation';
import {ThUtils} from '../../../utils/ThUtils';
import {SessionContext} from '../../../utils/SessionContext';
import {InvoiceDO} from '../../../data-layer/invoices/data-objects/InvoiceDO';
import {InvoiceItemDO} from '../../../data-layer/invoices/data-objects/items/InvoiceItemDO';
import {AddOnProductInvoiceItemMetaDO} from '../../../data-layer/invoices/data-objects/items/add-on-products/AddOnProductInvoiceItemMetaDO';
import {CustomerDO} from '../../../data-layer/customers/data-objects/CustomerDO';
import {AddOnProductDO} from '../../../data-layer/add-on-products/data-objects/AddOnProductDO';
import {TaxDO} from '../../../data-layer/taxes/data-objects/TaxDO';
import {PaymentMethodDO} from '../../../data-layer/common/data-objects/payment-method/PaymentMethodDO';
import {HotelDO} from '../../../data-layer/hotel/data-objects/HotelDO';

export class InvoiceAggregatedData {
    private static SHARED_INVOICE_ITEM_DISPLAY_NAME = "Shared Payment";
    private _thTranslation: ThTranslation;
    private _thUtils: ThUtils;

    hotel: HotelDO;
    ccySymbol: string;
    invoice: InvoiceDO;
    payerIndexOnInvoice: number;
    payerCustomer: CustomerDO;
    addOnProductList: AddOnProductDO[];
    vatList: TaxDO[];
    paymentMethodList: PaymentMethodDO[];

    constructor(private _sessionContext: SessionContext) {
        this._thTranslation = new ThTranslation(this._sessionContext.language);
        this._thUtils = new ThUtils();
    }

    public addSharedInvoiceItemIfNecessary() {
        if(this.invoice.payerList.length > 1) {
            var sharedInvoiceItem = new InvoiceItemDO(); 
            var sharedInvoiceItemMeta = new AddOnProductInvoiceItemMetaDO();
            sharedInvoiceItemMeta.aopDisplayName = this._thTranslation.translate(InvoiceAggregatedData.SHARED_INVOICE_ITEM_DISPLAY_NAME);
            sharedInvoiceItemMeta.numberOfItems = 1;
            sharedInvoiceItemMeta.pricePerItem = this._thUtils.roundNumberToTwoDecimals((this.invoice.getPrice() - this.invoice.payerList[this.payerIndexOnInvoice].priceToPay) * -1);
            sharedInvoiceItem.meta = sharedInvoiceItemMeta;
            this.invoice.itemList.push(sharedInvoiceItem);
        }
    }
}