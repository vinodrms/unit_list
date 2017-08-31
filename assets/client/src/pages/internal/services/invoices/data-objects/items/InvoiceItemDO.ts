import { ThUtils } from '../../../../../../common/utils/ThUtils';
import { BaseDO } from '../../../../../../common/base/BaseDO';
import { IInvoiceItemMeta } from './IInvoiceItemMeta';
import { AddOnProductInvoiceItemMetaDO } from './add-on-products/AddOnProductInvoiceItemMetaDO';
import { FeeInvoiceItemMetaDO } from './invoice-fee/FeeInvoiceItemMetaDO';
import { AddOnProductDO } from '../../../add-on-products/data-objects/AddOnProductDO';
import { CustomerDO } from '../../../customers/data-objects/CustomerDO';
import { RoomCommissionItemMetaDO } from "./room-commission/RoomCommissionItemMetaDO";

export enum InvoiceItemType {
    AddOnProduct, Booking, InvoiceFee, RoomCommission
}

export class InvoiceItemDO extends BaseDO {
    id: string;
    type: InvoiceItemType;
    meta: IInvoiceItemMeta;
    transactionId: string;
    timestamp: number;

    protected getPrimitivePropertyKeys(): string[] {
        return ["id", "type", "transactionId", "timestamp"];
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

    public buildFeeItemFromCustomerDO(customerDO: CustomerDO) {
        var meta = new FeeInvoiceItemMetaDO();
        meta.buildFromCustomerDO(customerDO);
        this.meta = meta;
        this.type = InvoiceItemType.InvoiceFee;
    }

    public getTotalPrice(): number {
        let thUtils = new ThUtils();
        return thUtils.roundNumberToTwoDecimals(this.meta.getTotalPrice());
    }
}
