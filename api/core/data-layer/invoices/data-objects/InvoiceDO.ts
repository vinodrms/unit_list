import {ThUtils} from '../../../utils/ThUtils';
import {ThError} from '../../../utils/th-responses/ThError';
import {BaseDO} from '../../common/base/BaseDO';
import {ThDateDO} from '../../../utils/th-dates/data-objects/ThDateDO';
import {InvoicePayerDO} from './payers/InvoicePayerDO';
import {InvoiceItemDO, InvoiceItemType} from './items/InvoiceItemDO';
import {IPriceableEntity} from './price/IPriceableEntity';
import {IInvoiceItemMeta} from './items/IInvoiceItemMeta';
import {BookingDO} from '../../bookings/data-objects/BookingDO';

export enum InvoicePaymentStatus {
    Unpaid, Paid
}

export class InvoiceDO extends BaseDO implements IPriceableEntity {
    bookingId: string;
    invoiceReference: string;
    payerList: InvoicePayerDO[];
    itemList: InvoiceItemDO[];
    paymentStatus: InvoicePaymentStatus;

    paidDate: ThDateDO;
    paidUtcTimestamp: number;

    protected getPrimitivePropertyKeys(): string[] {
        return ["bookingId", "invoiceReference", "paymentStatus", "paidUtcTimestamp"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.payerList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "payerList"), (payerObject: Object) => {
            var payerDO = new InvoicePayerDO();
            payerDO.buildFromObject(payerObject);
            this.payerList.push(payerDO);
        });
        this.itemList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "itemList"), (itemObject: Object) => {
            var itemDO = new InvoiceItemDO();
            itemDO.buildFromObject(itemObject);
            this.itemList.push(itemDO);
        });

        this.paidDate = new ThDateDO();
        this.paidDate.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "paidDate"));
        
        var thUtils = new ThUtils();
        if(thUtils.isUndefinedOrNull(this.paidDate.day) && thUtils.isUndefinedOrNull(this.paidDate.month) && 
            thUtils.isUndefinedOrNull(this.paidDate.year)) {
                delete this.paidDate;
            }
    }

    public getPayerCustomerIdList(): string[] {
        return _.chain(this.payerList)
            .map((payerDO: InvoicePayerDO) => {
                return payerDO.customerId;
            })
            .uniq().value();
    }

    public getAddOnProductIdList(): string[] {
        return this.getItemIdListByItemType(InvoiceItemType.AddOnProduct);
    }

    private getItemIdListByItemType(itemType: InvoiceItemType): string[] {
        return _.chain(this.itemList)
            .filter((invoiceItem: InvoiceItemDO) => {
                return invoiceItem.type === itemType;
            })
            .map((invoiceItem: InvoiceItemDO) => {
                return invoiceItem.id;
            })
            .value();
    }

    public linkBookingPrices(bookingList: BookingDO[]) {
        var thUtils = new ThUtils();
        _.forEach(this.itemList, (item: InvoiceItemDO) => {
            if(item.type === InvoiceItemType.Booking) {
                var booking = _.find(bookingList, (booking: BookingDO) => {
                    return booking.bookingId === item.id;
                });
                if(!thUtils.isUndefinedOrNull(booking)) {
                    item.meta = booking.price;
                    item.meta.setMovable(false);
                }
                _.forEach(booking.price.includedInvoiceItemList, (invoiceItem: InvoiceItemDO) => {
                    invoiceItem.meta.setMovable(false);
                    this.itemList.push(invoiceItem);            
                });
            }
        });             
    }

    public getPrice(): number {
        return _.reduce(this.itemList, function(memo: number, item: InvoiceItemDO){ return memo + item.meta.getNumberOfItems() * item.meta.getPrice(); }, 0);
    }
    
    public isPaid(): boolean {
        return this.paymentStatus === InvoicePaymentStatus.Paid;
    }
}