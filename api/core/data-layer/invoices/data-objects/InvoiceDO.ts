import { ThUtils } from '../../../utils/ThUtils';
import { ThError } from '../../../utils/th-responses/ThError';
import { BaseDO } from '../../common/base/BaseDO';
import { ThDateDO } from '../../../utils/th-dates/data-objects/ThDateDO';
import { ThTimestampDO } from "../../../utils/th-dates/data-objects/ThTimestampDO";
import { InvoicePayerDO } from './payers/InvoicePayerDO';
import { InvoiceItemDO, InvoiceItemType, InvoiceItemAccountingType } from './items/InvoiceItemDO';
import { IInvoiceItemMeta } from './items/IInvoiceItemMeta';
import { BookingDO } from '../../bookings/data-objects/BookingDO';
import { BookingPriceDO } from '../../bookings/data-objects/price/BookingPriceDO';
import { CustomerDO } from '../../customers/data-objects/CustomerDO';
import { InvoicePaymentMethodType } from './payers/InvoicePaymentMethodDO';
import { IndexedBookingInterval } from '../../price-products/utils/IndexedBookingInterval';
import { PricePerDayDO } from "../../bookings/data-objects/price/PricePerDayDO";

import _ = require('underscore');

export enum InvoiceAccountingType {
    Debit, Credit
}

export enum InvoicePaymentStatus {
    Unpaid, Paid, LossAcceptedByManagement
}

export class InvoiceDO extends BaseDO {
    id: string;
    accountingType: InvoiceAccountingType;
    bookingId: string;
    invoiceReference: string;
    payerList: InvoicePayerDO[];
    itemList: InvoiceItemDO[];
    paymentStatus: InvoicePaymentStatus;
    notesFromBooking: string;

    reinstatedInvoiceId: string;

    paidDate: ThDateDO;
    paidTimestamp: ThTimestampDO;
    paidDateUtcTimestamp: number;
    paidDateTimeUtcTimestamp: number;

    constructor() {
        super();

        this.accountingType = InvoiceAccountingType.Debit;
    }

    protected getPrimitivePropertyKeys(): string[] {
        return ["id", "accountingType", "bookingId", "invoiceReference", "paymentStatus", "notesFromBooking", "reinstatedInvoiceId", "paidDateUtcTimestamp", "paidDateTimeUtcTimestamp"];
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

        this.paidTimestamp = new ThTimestampDO();
        this.paidTimestamp.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "paidTimestamp"));
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
        let thUtils = new ThUtils();
        let actualItemList: InvoiceItemDO[] = [];
        _.forEach(this.itemList, (item: InvoiceItemDO) => {
            if (item.type === InvoiceItemType.Booking) {
                let booking = _.find(bookingList, (booking: BookingDO) => {
                    return booking.id === item.id;
                });
                if (thUtils.isUndefinedOrNull(booking)) {
                    actualItemList.push(item);
                } else {
                    let bookingInvoiceItemList = this.getBookingInvoiceItems(item, booking);
                    actualItemList = actualItemList.concat(bookingInvoiceItemList);
                }
            }
            else {
                actualItemList.push(item);
            }
        });
        this.itemList = actualItemList;
    }
    private getBookingInvoiceItems(item: InvoiceItemDO, booking: BookingDO): InvoiceItemDO[] {
        let bookingInvoiceItemList: InvoiceItemDO[] = [];

        item.meta = booking.price;
        bookingInvoiceItemList.push(item);

        if (booking.price.hasDeductedCommission()) {
            var invoiceRoomCommissionItem = new InvoiceItemDO();
            invoiceRoomCommissionItem.buildItemFromRoomCommission(booking.price.deductedCommissionPrice);
            invoiceRoomCommissionItem.accountingType = item.accountingType;
            bookingInvoiceItemList.push(invoiceRoomCommissionItem);
        }

        if (!booking.price.isPenalty()) {
            booking.price.includedInvoiceItemList.reverse();
            _.forEach(booking.price.includedInvoiceItemList, (invoiceItem: InvoiceItemDO) => {
                var includedItem = new InvoiceItemDO();
                includedItem.buildFromObject(invoiceItem);
                includedItem.accountingType = item.accountingType;

                bookingInvoiceItemList = bookingInvoiceItemList.concat(includedItem);
            });
        }
        return bookingInvoiceItemList;
    }

    public addInvoiceFeeIfNecessary(customerDOList: CustomerDO[]) {
        if (!this.hasPayInvoiceByAgreementAsPM()) return;

        this.payerList.forEach(payer => {
            if (payer.paymentMethod.type === InvoicePaymentMethodType.PayInvoiceByAgreement) {
                var customerDO = _.find(customerDOList, (customerDO: CustomerDO) => {
                    return customerDO.id === payer.customerId;
                });

                var invoiceFeeItem = new InvoiceItemDO();
                invoiceFeeItem.buildFeeItemFromCustomerDO(customerDO);
                invoiceFeeItem.accountingType =
                    (this.accountingType === InvoiceAccountingType.Credit) ? InvoiceItemAccountingType.Credit : InvoiceItemAccountingType.Debit;
                this.itemList.push(invoiceFeeItem);
            }
        });
    }

    public getPrice(): number {
        let totalPrice = 0;
        _.forEach(this.itemList, (item: InvoiceItemDO) => {
            let factor = item.accountingType === InvoiceItemAccountingType.Credit ? -1 : 1;
            totalPrice += item.meta.getNumberOfItems() * item.meta.getUnitPrice() * factor;
        });
        var thUtils = new ThUtils();
        return thUtils.roundNumberToTwoDecimals(totalPrice);
    }

    public getPricePaidByCustomerId(customerId: string) {
        let payerDO = _.find(this.payerList, (payer: InvoicePayerDO) => {
            return payer.customerId === customerId;
        });

        var thUtils = new ThUtils();
        if(thUtils.isUndefinedOrNull(payerDO)) {
            return 0;
        }
        
        return payerDO.priceToPay;
    }

    public isPaid(): boolean {
        return this.paymentStatus === InvoicePaymentStatus.Paid;
    }
    public isLossAcceptedByManagement(): boolean {
        return this.paymentStatus === InvoicePaymentStatus.LossAcceptedByManagement;
    }
    public isClosed(): boolean {
        return this.isPaid() || this.isLossAcceptedByManagement();
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
            if (invoiceItemDO.type === InvoiceItemType.Booking) {
                delete invoiceItemDO.meta;
            }
            else if (invoiceItemDO.meta.isDerivedFromBooking()) {
                itemsToRemoveIdList.push(invoiceItemDO.id);
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

    public isWalkInInvoice(): boolean {
        return !_.isString(this.bookingId) || this.bookingId.length == 0;
    }

    public isReinstatement(): boolean {
        var thUtils = new ThUtils();
        return !thUtils.isUndefinedOrNull(this.reinstatedInvoiceId);
    }
}