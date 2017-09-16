import _ = require('underscore');
import { InvoiceDO } from "../data-objects/InvoiceDO";
import { CustomerDO } from "../../customers/data-objects/CustomerDO";
import { InvoiceMeta } from "../data-objects/InvoiceMeta";
import { InvoiceMetaFactory } from "../data-objects/InvoiceMetaFactory";
import { InvoiceItemVM } from "./InvoiceItemVM";
import { InvoiceItemDO, InvoiceItemType } from "../data-objects/items/InvoiceItemDO";
import { BookingPriceDO } from "../../bookings/data-objects/price/BookingPriceDO";
import { PricePerDayDO } from "../../bookings/data-objects/price/PricePerDayDO";

export class InvoiceVM {
    private _invoice: InvoiceDO;
    private _customerList: CustomerDO[];
    private _invoiceMeta: InvoiceMeta;
    private _invoiceItemVms: InvoiceItemVM[];

    public get invoice(): InvoiceDO {
        return this._invoice;
    }
    public set invoice(value: InvoiceDO) {
        this._invoice = value;
        let factory = new InvoiceMetaFactory();
        this._invoiceMeta = factory.getInvoiceMetaByPaymentStatus(this._invoice.paymentStatus);

        this._invoiceItemVms = [];
        _.forEach(value.itemList, (item: InvoiceItemDO) => {
            if (item.type === InvoiceItemType.Booking) {
                let bookingPrice: BookingPriceDO = <BookingPriceDO>item.meta;
                if (bookingPrice.isPenalty()) {
                    let itemVm = InvoiceItemVM.build(item, true);
                    this._invoiceItemVms.push(itemVm);
                }
                else {
                    bookingPrice.roomPricePerNightList.forEach((price: PricePerDayDO, index: number) => {
                        let itemVm = new InvoiceItemVM();
                        itemVm.item = item;
                        itemVm.isRemovable = false;
                        itemVm.isMovable = (index == 0);
                        itemVm.isRelatedToBooking = true;
                        itemVm.numberOfItems = 1;
                        itemVm.unitPrice = price.price;
                        itemVm.totalPrice = price.price;
                        itemVm.displayText = "Accomodation for %date%";
                        itemVm.displayTextParams = { date: price.thDate.toString() };
                        this._invoiceItemVms.push(itemVm);
                    });
                }
            }
            else {
                let isRelatedToBooking = item.meta.isDerivedFromBooking();
                let itemVm = InvoiceItemVM.build(item, isRelatedToBooking);
                itemVm.isRemovable = !isRelatedToBooking;
                itemVm.isMovable = !isRelatedToBooking;
                this._invoiceItemVms.push(itemVm);
            }
        });
    }

    public get invoiceMeta(): InvoiceMeta {
        return this._invoiceMeta;
    }
    public set invoiceMeta(value: InvoiceMeta) {
        this._invoiceMeta = value;
    }

    public get customerList(): CustomerDO[] {
        return this._customerList;
    }
    public set customerList(value: CustomerDO[]) {
        this._customerList = value;
    }

    public get invoiceItemVms(): InvoiceItemVM[] {
        return this._invoiceItemVms;
    }
    public set invoiceItemVms(value: InvoiceItemVM[]) {
        this._invoiceItemVms = value;
    }

    public getFirstPayerName(): string {
        return (this._customerList.length > 0) ? this._customerList[0].customerName : "";
    }
    public getFirstPayerEmail(): string {
        return (this._customerList.length > 0) ? this._customerList[0].emailString : "";
    }

    public getCustomerDO(id: string): CustomerDO {
        return _.find(this.customerList, (customer: CustomerDO) => {
            return customer.id === id;
        });
    }

    public addCustomer(customerToAdd: CustomerDO) {
        if (!_.find(this.customerList, (customer: CustomerDO) => {
            return customer.id === customerToAdd.id;
        })) {
            this.customerList.push(customerToAdd);
        };
    }

    public removeCustomer(customerId: string) {
        this.customerList = _.without(this.customerList, _.findWhere(this.customerList, {
            id: customerId
        }));
    }

    public get payerListString(): string {
        var payerListString: string = "";
        _.forEach(this.customerList, (customer: CustomerDO, index: number) => {
            payerListString += customer.customerName;
            if (index < this.customerList.length - 1) {
                payerListString += ", ";
            }
        });
        return payerListString;
    }
}
