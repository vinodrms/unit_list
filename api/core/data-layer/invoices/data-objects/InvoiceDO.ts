import {ThUtils} from '../../../utils/ThUtils';
import {ThError} from '../../../utils/th-responses/ThError';
import {BaseDO} from '../../common/base/BaseDO';
import {ThDateDO} from '../../../utils/th-dates/data-objects/ThDateDO';
import {InvoicePayerDO} from './payers/InvoicePayerDO';
import {InvoiceItemDO, InvoiceItemType} from './items/InvoiceItemDO';
import {IInvoiceItemMeta} from './items/IInvoiceItemMeta';
import {BookingDO} from '../../bookings/data-objects/BookingDO';
import {CustomerDO} from '../../customers/data-objects/CustomerDO';
import {InvoicePaymentMethodType} from './payers/InvoicePaymentMethodDO';
import {FeeInvoiceItemMetaDO} from './items/invoice-fee/FeeInvoiceItemMetaDO';

export enum InvoicePaymentStatus {
    Unpaid, Paid
}

export class InvoiceDO extends BaseDO {
    bookingId: string;
    invoiceReference: string;
    payerList: InvoicePayerDO[];
    itemList: InvoiceItemDO[];
    paymentStatus: InvoicePaymentStatus;

    paidDate: ThDateDO;
    paidDateUtcTimestamp: number;

    protected getPrimitivePropertyKeys(): string[] {
        return ["bookingId", "invoiceReference", "paymentStatus", "paidDateUtcTimestamp"];
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
        if (thUtils.isUndefinedOrNull(this.paidDate.day) && thUtils.isUndefinedOrNull(this.paidDate.month) &&
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
            if (item.type === InvoiceItemType.Booking) {
                var bookingIndex = _.findIndex(bookingList, (booking: BookingDO) => {
                    return booking.bookingId === item.id;
                })
                if(bookingIndex != -1) {
                    item.meta = bookingList[bookingIndex].price;
                    item.meta.setMovable(false);
                }
                if(!bookingList[bookingIndex].price.isPenalty()) {
                    bookingList[bookingIndex].price.includedInvoiceItemList.reverse();
                    _.forEach(bookingList[bookingIndex].price.includedInvoiceItemList, (invoiceItem: InvoiceItemDO) => {
                        invoiceItem.meta.setMovable(false);
                        this.itemList.splice(bookingIndex, 0, invoiceItem);
                    });
                }
            }
        });
    }

    public addInvoiceFeeIfNecessary(customerDOList: CustomerDO[]) {
        if (!this.hasPayInvoiceByAgreementAsPM()) return;

        for (var i = 0; i < this.payerList.length; ++i) {
            if (this.payerList[i].paymentMethod.type === InvoicePaymentMethodType.PayInvoiceByAgreement) {
                var customerDO = _.find(customerDOList, (customerDO: CustomerDO) => {
                    return customerDO.id === this.payerList[i].customerId;
                });

                var invoiceFeeItem = new InvoiceItemDO();
                invoiceFeeItem.buildFeeItemFromCustomerDO(customerDO);

                this.itemList.push(invoiceFeeItem);
            }
        }
    }

    public getPrice(): number {
        var thUtils = new ThUtils();
        return _.reduce(this.itemList, (memo: number, item: InvoiceItemDO) => {
            return thUtils.roundNumberToTwoDecimals(memo + thUtils.roundNumberToTwoDecimals(item.meta.getNumberOfItems() * item.meta.getUnitPrice()));
        }, 0);
    }

    public isPaid(): boolean {
        return this.paymentStatus === InvoicePaymentStatus.Paid;
    }

    public hasPayInvoiceByAgreementAsPM(): boolean {
        for (var i = 0; i < this.payerList.length; ++i) {
            if (this.payerList[i].paymentMethod.type === InvoicePaymentMethodType.PayInvoiceByAgreement) {
                return true;
            }
        }
        return false;
    }

    public removeItemsPopulatedFromBooking() {
        var itemsToRemoveIdList = [];
        _.forEach(this.itemList, (invoiceItemDO: InvoiceItemDO) => {
            if (invoiceItemDO.isDerivedFromBooking()) {
                itemsToRemoveIdList.push(invoiceItemDO.id);
            }
            else if (invoiceItemDO.type === InvoiceItemType.Booking) {
                delete invoiceItemDO.meta;
            }
        });
        _.forEach(itemsToRemoveIdList, (id: string) => {
            var index = _.findIndex(this.itemList, (invoiceItemDO: InvoiceItemDO) => {
                return invoiceItemDO.id === id;
            });
            if (index != -1) {
                this.itemList.splice(index, 1);
            }
        });
    }
}