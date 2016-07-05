import {ThUtils} from '../../../utils/ThUtils';
import {InvoiceItemDO, InvoiceItemType} from '../../../data-layer/invoices/data-objects/items/InvoiceItemDO';
import {AddOnProductDO} from '../../../data-layer/add-on-products/data-objects/AddOnProductDO';
import {PriceProductDO} from '../../../data-layer/price-products/data-objects/PriceProductDO';
import {PriceProductPriceQueryDO} from '../../../data-layer/price-products/data-objects/price/IPriceProductPrice';
import {CustomerDO} from '../../../data-layer/customers/data-objects/CustomerDO';
import {BaseCorporateDetailsDO} from '../../../data-layer/customers/data-objects/customer-details/corporate/BaseCorporateDetailsDO';

export class InvoiceItemPriceCalculator {
    private _thUtils: ThUtils;

    constructor(private _invoiceItem: InvoiceItemDO, private _billingCustomer: CustomerDO) {
    }

    public getPrice(priceProductPriceQuery?: PriceProductPriceQueryDO) {
        switch(this._invoiceItem.type) {
            case InvoiceItemType.AddOnProduct: return this.buildAddOnProductDOFromSnapshotAndGetPrice() * this._invoiceItem.qty;
            case InvoiceItemType.PriceProduct: return this.buildPriceProductDOFromSnapshotAndGetPrice(priceProductPriceQuery) * this._invoiceItem.qty;
            case InvoiceItemType.InvoiceFee: return this.getInvoiceFee();
            default: return 0;
        }    
    }

    private buildAddOnProductDOFromSnapshotAndGetPrice(): number {
        var aopDO = new AddOnProductDO();
        aopDO.buildFromObject(this._invoiceItem.snapshot);
        return aopDO.price;
    }

    private buildPriceProductDOFromSnapshotAndGetPrice(priceProductPriceQuery: PriceProductPriceQueryDO): number {
        var ppDO = new PriceProductDO();
        ppDO.buildFromObject(this._invoiceItem.snapshot);
        return ppDO.price.getPriceFor(priceProductPriceQuery);
    }

    private getInvoiceFee(): number {
        if(this._billingCustomer.customerDetails.canPayInvoiceByAgreement()) {
            var details = new BaseCorporateDetailsDO();
            details.buildFromObject(this._billingCustomer.customerDetails);
            return details.invoiceFee;         
        }
        else {
            return 0;
        }
    }
}