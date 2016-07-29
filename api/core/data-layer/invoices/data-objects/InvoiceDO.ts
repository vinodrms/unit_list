import {ThError} from '../../../utils/th-responses/ThError';
import {ThUtils} from '../../../utils/ThUtils';
import {BaseDO} from '../../common/base/BaseDO';
import {InvoicePayerDO} from './payers/InvoicePayerDO';
import {InvoiceItemDO, InvoiceItemType} from './items/InvoiceItemDO';
import {IPriceableEntity} from './price/IPriceableEntity';
import {IBookingRepository} from '../../bookings/repositories/IBookingRepository';
import {IInvoiceItemMeta} from './items/IInvoiceItemMeta';

export enum InvoicePaymentStatus {
    Open, Closed
}

export interface IInvoiceDO {
    bookingRepo: IBookingRepository,
    hotelId: string,
    groupBookingId: string
}

export class InvoiceDO extends BaseDO implements IPriceableEntity {
    constructor(public bookingInvoiceMeta?: IInvoiceDO) {
        super();

        var thUtils = new ThUtils();
        if (thUtils.isUndefinedOrNull(bookingInvoiceMeta)) {
            delete this.bookingInvoiceMeta;
        }
    }

    bookingId: string;
    payerList: InvoicePayerDO[];
    itemList: InvoiceItemDO[];
    paymentStatus: InvoicePaymentStatus;

    protected getPrimitivePropertyKeys(): string[] {
        return ["bookingId", "paymentStatus"];
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
            var itemDO = new InvoiceItemDO({
                bookingRepo: this.bookingInvoiceMeta.bookingRepo,
                hotelId: this.bookingInvoiceMeta.hotelId,
                groupBookingId: this.bookingInvoiceMeta.groupBookingId,
                bookingId: this.bookingId
            });
            itemDO.buildFromObject(itemObject);
            this.itemList.push(itemDO);
        });
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

    public getPrice(): Promise<number> {
        return new Promise<number>((resolve: { (result: number): void }, reject: { (err: ThError): void }) => {
            try {
                this.getPriceCore(resolve, reject);
            } catch (error) {
                reject(error);
            }
        });
    }

    private getPriceCore(resolve: { (result: number): void }, reject: { (err: ThError): void }) {
        var getItemMetaPromiseList = [];
        _.forEach(this.itemList, (invoiceItem: InvoiceItemDO) => {
            getItemMetaPromiseList.push(invoiceItem.meta);
        });

        Promise.all(getItemMetaPromiseList).then((invoiceItemMetaList: IInvoiceItemMeta[]) => {
            var totalPrice = 0;
            var getPricePromiseList = [];
            _.forEach(invoiceItemMetaList, (invoiceItemMeta: IInvoiceItemMeta) => {
                getPricePromiseList.push(invoiceItemMeta.getPrice());
            });
            Promise.all(getPricePromiseList).then((pricePerItemList: number[]) => {
                for (var i = 0; i < pricePerItemList.length; ++i) {
                    totalPrice += pricePerItemList[i] * invoiceItemMetaList[i].getNumberOfItems();
                }
                resolve(totalPrice);
            }).catch((error: any) => {
                reject(error);
            });
        }).catch((error: any) => {
            reject(error);
        });
    }
}