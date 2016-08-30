import {ThUtils} from '../../../../utils/ThUtils';
import {BaseDO} from '../../../common/base/BaseDO';
import {IInvoiceItemMeta} from './IInvoiceItemMeta';
import {AddOnProductInvoiceItemMetaDO} from './add-on-products/AddOnProductInvoiceItemMetaDO';
import {FeeInvoiceItemMetaDO} from './invoice-fee/FeeInvoiceItemMetaDO';
import {AddOnProductDO} from '../../../add-on-products/data-objects/AddOnProductDO';
import {CustomerDO} from '../../../customers/data-objects/CustomerDO';

export enum InvoiceItemType {
    AddOnProduct, Booking, InvoiceFee
}

export class InvoiceItemDO extends BaseDO {
    id: string;
    type: InvoiceItemType;
    meta: IInvoiceItemMeta;

    protected getPrimitivePropertyKeys(): string[] {
        return ["id", "type"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        if (this.type === InvoiceItemType.AddOnProduct) {
            var metaObject = this.getObjectPropertyEnsureUndefined(object, "meta");

            var addOnProductInvoiceItemMetaDO = new AddOnProductInvoiceItemMetaDO();
            addOnProductInvoiceItemMetaDO.buildFromObject(metaObject);
            this.meta = addOnProductInvoiceItemMetaDO;
        }
        else if(this.type === InvoiceItemType.InvoiceFee) {
            var metaObject = this.getObjectPropertyEnsureUndefined(object, "meta");
            
            var feeInvoiceItemMetaDO = new FeeInvoiceItemMetaDO();
            feeInvoiceItemMetaDO.buildFromObject(metaObject);
            this.meta = feeInvoiceItemMetaDO;
        }
    }

    public buildFromAddOnProductDO(aop: AddOnProductDO, numberOfItems: number, isMovable: boolean) {
        var aopInvoiceItemMeta = new AddOnProductInvoiceItemMetaDO();
        aopInvoiceItemMeta.aopDisplayName = aop.name;
        aopInvoiceItemMeta.numberOfItems = numberOfItems;
        aopInvoiceItemMeta.pricePerItem = aop.price;
        aopInvoiceItemMeta.movable = isMovable;
        this.meta = aopInvoiceItemMeta;
        this.type = InvoiceItemType.AddOnProduct;
        this.id = aop.id;
    }
    public buildFeeItemFromCustomerDO(customerDO: CustomerDO) {
        var meta = new FeeInvoiceItemMetaDO();
        meta.buildFromCustomerDO(customerDO);
        this.meta = meta;
        this.type = InvoiceItemType.InvoiceFee;
    }
    public isDerivedFromBooking(): boolean {
        return this.type === InvoiceItemType.InvoiceFee || (this.type === InvoiceItemType.AddOnProduct && !this.meta.isMovable());
    }
}