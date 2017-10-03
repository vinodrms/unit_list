import _ = require('underscore');
import { InvoiceDO } from "../data-objects/InvoiceDO";
import { CustomerDO } from "../../customers/data-objects/CustomerDO";
import { InvoiceMeta } from "../data-objects/InvoiceMeta";
import { InvoiceMetaFactory } from "../data-objects/InvoiceMetaFactory";
import { InvoiceItemVM } from "./InvoiceItemVM";
import { InvoiceItemDO, InvoiceItemType } from "../data-objects/items/InvoiceItemDO";
import { BookingPriceDO } from "../../bookings/data-objects/price/BookingPriceDO";
import { PricePerDayDO } from "../../bookings/data-objects/price/PricePerDayDO";
import { ThDateUtils } from "../../common/data-objects/th-dates/ThDateUtils";
import { ThTimestampDO } from "../../common/data-objects/th-dates/ThTimestampDO";
import { ThUtils } from "../../../../../common/utils/ThUtils";
import { RoomDO } from '../../rooms/data-objects/RoomDO';

export class InvoiceVM {
    private _invoice: InvoiceDO;
    private _customerList: CustomerDO[];
    private _invoiceMeta: InvoiceMeta;
    private _invoiceItemVms: InvoiceItemVM[];
    private _bookingCustomerList: CustomerDO[];
    private _bookingRoomList: RoomDO[];

    private thDateUtils: ThDateUtils;
    private thUtils: ThUtils;

    constructor() {
        this.thDateUtils = new ThDateUtils();
        this.thUtils = new ThUtils();
    }

    public get invoice(): InvoiceDO {
        return this._invoice;
    }
    public set invoice(value: InvoiceDO) {
        this._invoice = value;
        let factory = new InvoiceMetaFactory();
        this._invoiceMeta = factory.getInvoiceMeta(this._invoice.paymentStatus, this._invoice.accountingType);

        this.recreateInvoiceItemVms();
    }

    public recreateInvoiceItemVms() {
        this._invoiceItemVms = [];
        _.forEach(this._invoice.itemList, (item: InvoiceItemDO) => {
            if (item.type === InvoiceItemType.Booking) {
                let bookingPrice: BookingPriceDO = <BookingPriceDO>item.meta;
                if (bookingPrice.isPenalty()) {
                    let itemVm = InvoiceItemVM.build(item, true);
                    this._invoiceItemVms.push(itemVm);
                }
                else {
                    let subtitle = "";

                    if (!this.thUtils.isUndefinedOrNull(bookingPrice.bookingReference)) {
                        subtitle += bookingPrice.bookingReference;
                    }

                    if (!this.thUtils.isUndefinedOrNull(bookingPrice.roomId)) {
                        let room: RoomDO = _.find(this._bookingRoomList, (room: RoomDO) => { return room.id === bookingPrice.roomId; });
                        if (!this.thUtils.isUndefinedOrNull(room)) {
                            if (subtitle.length > 0) { subtitle += ", "; }
                            subtitle += room.name;
                        }
                    }

                    if (!this.thUtils.isUndefinedOrNull(bookingPrice.customerId)) {
                        let customer: CustomerDO = _.find(this._bookingCustomerList, (customer: CustomerDO) => { return customer.id === bookingPrice.customerId; });
                        if (!this.thUtils.isUndefinedOrNull(customer)) {
                            if (subtitle.length > 0) { subtitle += ", "; }
                            subtitle += customer.customerName;
                        }
                    }

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
                        itemVm.subtitle = subtitle;
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

    public get bookingCustomerList(): CustomerDO[] {
        return this._bookingCustomerList;
    }
    public set bookingCustomerList(value: CustomerDO[]) {
        this._bookingCustomerList = value;
    }

    public get bookingRoomList(): RoomDO[] {
        return this._bookingRoomList;
    }
    public set bookingRoomList(value: RoomDO[]) {
        this._bookingRoomList = value;
    }

    public get firstPayerName(): string {
        return (this._customerList.length > 0) ? this._customerList[0].customerName : "";
    }
    public get firstPayerEmail(): string {
        return (this._customerList.length > 0) ? this._customerList[0].emailString : "";
    }
    public get firstPayerCustomerId(): string {
        return (this._customerList.length > 0) ? this._customerList[0].id : "";
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

    public get paidTimestamp(): ThTimestampDO {
        return !this.thUtils.isUndefinedOrNull(this.invoice.paidTimestamp) ? this.thDateUtils.convertTimestampToThTimestamp(this.invoice.paidTimestamp) : null;
    }

    public hasMovableItems(): boolean {
        return !this.thUtils.isUndefinedOrNull(_.find(this.invoiceItemVms, (item: InvoiceItemVM) => { return item.isMovable; }));
    }
}
