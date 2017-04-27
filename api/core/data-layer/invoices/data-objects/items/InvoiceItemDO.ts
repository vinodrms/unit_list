import { ThUtils } from '../../../../utils/ThUtils';
import { BaseDO } from '../../../common/base/BaseDO';
import { IInvoiceItemMeta } from './IInvoiceItemMeta';
import { AddOnProductInvoiceItemMetaDO } from './add-on-products/AddOnProductInvoiceItemMetaDO';
import { FeeInvoiceItemMetaDO } from './invoice-fee/FeeInvoiceItemMetaDO';
import { AddOnProductDO } from '../../../add-on-products/data-objects/AddOnProductDO';
import { CustomerDO } from '../../../customers/data-objects/CustomerDO';
import { RoomCommissionItemMetaDO } from "./room-commission/RoomCommissionItemMetaDO";
import { InvoiceAccountingType } from "../InvoiceDO";

export enum InvoiceItemAccountingType {
    Debit, Credit
}

export enum InvoiceItemType {
    AddOnProduct, Booking, InvoiceFee, RoomCommission
}

export class InvoiceItemDO extends BaseDO {
    id: string;
    type: InvoiceItemType;
    accountingType: InvoiceItemAccountingType;
    meta: IInvoiceItemMeta;

    constructor() {
        super();
        this.accountingType = InvoiceItemAccountingType.Debit;
    }

    protected getPrimitivePropertyKeys(): string[] {
        return ["id", "type", "accountingType"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        let metaObject = this.getObjectPropertyEnsureUndefined(object, "meta");
        if (this.type === InvoiceItemType.AddOnProduct) {
            var addOnProductInvoiceItemMetaDO = new AddOnProductInvoiceItemMetaDO();
            addOnProductInvoiceItemMetaDO.buildFromObject(metaObject);
            this.meta = addOnProductInvoiceItemMetaDO;
        }
        else if (this.type === InvoiceItemType.InvoiceFee) {
            var feeInvoiceItemMetaDO = new FeeInvoiceItemMetaDO();
            feeInvoiceItemMetaDO.buildFromObject(metaObject);
            this.meta = feeInvoiceItemMetaDO;
        }
        else if (this.type === InvoiceItemType.RoomCommission) {
            var roomCommissionItemMetaDO = new RoomCommissionItemMetaDO();
            roomCommissionItemMetaDO.buildFromObject(metaObject);
            this.meta = roomCommissionItemMetaDO;
        }
    }

    public buildFromAddOnProductDO(aop: AddOnProductDO, numberOfItems: number, vatId: string, 
        accountingType: InvoiceItemAccountingType = InvoiceItemAccountingType.Debit) {
        
        var aopInvoiceItemMeta = new AddOnProductInvoiceItemMetaDO();
        aopInvoiceItemMeta.aopDisplayName = aop.name;
        aopInvoiceItemMeta.numberOfItems = numberOfItems;
        aopInvoiceItemMeta.pricePerItem = aop.price;
        aopInvoiceItemMeta.vatId = vatId;

        this.meta = aopInvoiceItemMeta;
        this.type = InvoiceItemType.AddOnProduct;
        this.accountingType = accountingType;
        this.id = aop.id;
    }
    public buildFeeItemFromCustomerDO(customerDO: CustomerDO, accountingType: InvoiceItemAccountingType = InvoiceItemAccountingType.Debit) {
        var meta = new FeeInvoiceItemMetaDO();
        meta.buildFromCustomerDO(customerDO);
        this.meta = meta;
        this.type = InvoiceItemType.InvoiceFee;
        this.accountingType = accountingType;
    }
    public buildItemFromRoomCommission(deductedCommissionPrice: number, accountingType: InvoiceItemAccountingType = InvoiceItemAccountingType.Debit) {
        var meta = new RoomCommissionItemMetaDO();
        meta.buildFromRoomCommission(deductedCommissionPrice);
        this.meta = meta;
        this.type = InvoiceItemType.RoomCommission;
        this.accountingType = accountingType;
    }
}