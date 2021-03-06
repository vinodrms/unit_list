import _ = require("underscore");
import { BookingDO } from '../../../core/data-layer/bookings/data-objects/BookingDO';
import { CustomerDO } from '../../../core/data-layer/customers/data-objects/CustomerDO';
import { AddOnProductDO } from '../../../core/data-layer/add-on-products/data-objects/AddOnProductDO'
import { TestContext } from '../../helpers/TestContext';
import { HotelDO } from "../../../core/data-layer/hotel/data-objects/HotelDO";
import { TransactionFeeDO } from "../../../core/data-layer/common/data-objects/payment-method/TransactionFeeDO";
import { InvoiceDO, InvoicePaymentStatus, InvoiceAccountingType } from "../../../core/data-layer/invoices/data-objects/InvoiceDO";
import { InvoiceItemDO, InvoiceItemType } from "../../../core/data-layer/invoices/data-objects/items/InvoiceItemDO";
import { InvoicePayerDO } from "../../../core/data-layer/invoices/data-objects/payer/InvoicePayerDO";
import { InvoicePaymentDO } from "../../../core/data-layer/invoices/data-objects/payer/InvoicePaymentDO";
import { AddOnProductInvoiceItemMetaDO } from "../../../core/data-layer/invoices/data-objects/items/add-on-products/AddOnProductInvoiceItemMetaDO";

export interface IInvoiceDataSource {
    getInvoiceList(hotel: HotelDO, customerList: CustomerDO[], aopList: AddOnProductDO[], bookingList: BookingDO[]): InvoiceDO[];
}

export class DefaultInvoiceBuilder implements IInvoiceDataSource {

    constructor(private context: TestContext) {
    }

    public getInvoiceList(hotel: HotelDO, customerList: CustomerDO[], aopList: AddOnProductDO[], bookingList: BookingDO[]): InvoiceDO[] {
        var invoiceList: InvoiceDO[] = [];

        var groupedBookings = _.groupBy(bookingList, (bookindDO: BookingDO) => {
            return bookindDO.groupBookingId;
        });
        var groupBookingIdList = Object.keys(groupedBookings);
        var groupBookingId = groupBookingIdList[1];
        var invoiceBuilderPromiseList = [];
        _.forEach(groupedBookings[groupBookingId], (booking: BookingDO) => {
            var bookingInvoice = this.buildBookingInvoiceFromBooking(hotel, booking, customerList);
            var invoicePayer = bookingInvoice.payerList[0];
            var aopOnlyInvoice = this.buildInvoiceWithTwoAddOnProducts(invoicePayer, aopList);
            invoiceList.push(bookingInvoice);
            invoiceList.push(aopOnlyInvoice);
        });
        return invoiceList;
    }

    private buildBookingInvoiceFromBooking(hotel: HotelDO, booking: BookingDO, customerList: CustomerDO[]): InvoiceDO {
        var invoice = new InvoiceDO();
        invoice.groupId = this.context.appContext.thUtils.generateUniqueID();
        invoice.indexedBookingIdList = [booking.id];
        invoice.itemList = [];
        var bookingInvoiceItem = new InvoiceItemDO();
        bookingInvoiceItem.type = InvoiceItemType.Booking;
        bookingInvoiceItem.id = booking.id;
        this.stampItem(bookingInvoiceItem);
        invoice.itemList.push(bookingInvoiceItem);
        invoice.amountToPay = booking.price.getTotalPrice();

        let payer = new InvoicePayerDO();
        payer.customerId = booking.defaultBillingDetails.customerId;
        let payment = new InvoicePaymentDO();
        payment.amount = booking.price.getTotalPrice();
        payment.amountPlusTransactionFee = booking.price.getTotalPrice();
        payment.notes = "";
        payment.shouldApplyTransactionFee = true;
        payment.transactionId = this.context.appContext.thUtils.generateUniqueID();
        payment.timestamp = (new Date()).getTime();
        payment.transactionFeeSnapshot = TransactionFeeDO.getDefaultTransactionFee();
        payer.paymentList = [payment];
        invoice.payerList = [payer];
        invoice.paymentStatus = InvoicePaymentStatus.Unpaid;
        invoice.accountingType = InvoiceAccountingType​​.Debit;

        return invoice;
    }

    public buildInvoiceWithNoItems(): InvoiceDO {
        var invoice = new InvoiceDO();
        invoice.itemList = [];
        invoice.groupId = this.context.appContext.thUtils.generateUniqueID();
        invoice.paymentStatus = InvoicePaymentStatus.Unpaid;
        invoice.accountingType = InvoiceAccountingType​​.Debit;
        return invoice;
    }

    private buildInvoiceWithTwoAddOnProducts(payerCustomer: InvoicePayerDO, aopList: AddOnProductDO[]): InvoiceDO {
        var invoice = new InvoiceDO();
        invoice.itemList = [];
        invoice.groupId = this.context.appContext.thUtils.generateUniqueID();

        var totalAmountToPay = 0;
        var aopSample = _.sample(aopList, 2);
        _.forEach(aopSample, (aop: AddOnProductDO) => {
            var aopInvoiceItem = new InvoiceItemDO();
            aopInvoiceItem.type = InvoiceItemType.AddOnProduct;
            aopInvoiceItem.id = aop.id;

            var aopItemMeta = new AddOnProductInvoiceItemMetaDO();
            aopItemMeta.aopDisplayName = aop.name;
            aopItemMeta.numberOfItems = 1;
            aopItemMeta.pricePerItem = aop.price;
            aopInvoiceItem.meta = aopItemMeta;
            this.stampItem(aopInvoiceItem);

            invoice.itemList.push(aopInvoiceItem);
            totalAmountToPay += aop.price;
        });

        invoice.paymentStatus = InvoicePaymentStatus.Unpaid;
        invoice.accountingType = InvoiceAccountingType​​.Debit;
        let payer = new InvoicePayerDO();
        payer.buildFromObject(payerCustomer);
        payer.paymentList[0].amount = totalAmountToPay;
        payer.paymentList[0].amountPlusTransactionFee = totalAmountToPay;
        invoice.payerList = [payer];

        return invoice;
    }

    public loadInvoices(dataSource: IInvoiceDataSource, hotel: HotelDO, customerList: CustomerDO[], aopList: AddOnProductDO[], bookingList: BookingDO[]): Promise<InvoiceDO[]> {
        return new Promise<InvoiceDO[]>((resolve: { (result: InvoiceDO[]): void }, reject: { (err: any): void }) => {
            this.loadInvoicesCore(resolve, reject, dataSource, hotel, customerList, aopList, bookingList);
        });
    }
    private loadInvoicesCore(resolve: { (result: InvoiceDO[]): void }, reject: { (err: any): void },
        dataSource: IInvoiceDataSource, hotel: HotelDO, customerList: CustomerDO[], aopList: AddOnProductDO[], bookingList: BookingDO[]) {

        var invoiceList = dataSource.getInvoiceList(hotel, customerList, aopList, bookingList);
        var addInvoicePromiseList: Promise<InvoiceDO>[] = [];
        invoiceList.forEach((invoice: InvoiceDO) => {
            var invoiceRepository = this.context.appContext.getRepositoryFactory().getInvoiceRepository();
            addInvoicePromiseList.push(invoiceRepository.addInvoice({ hotelId: this.context.sessionContext.sessionDO.hotel.id }, invoice));
        });
        Promise.all(addInvoicePromiseList)
            .then((invoiceList: InvoiceDO[]) => {
                var updateInvoicePromiseList: Promise<InvoiceDO>[] = [];
                invoiceList.forEach(invoice => {
                    invoice.recomputePrices();
                    var invoiceRepository = this.context.appContext.getRepositoryFactory().getInvoiceRepository();
                    updateInvoicePromiseList.push(invoiceRepository.updateInvoice({ hotelId: this.context.sessionContext.sessionDO.hotel.id }, {
                        id: invoice.id,
                        versionId: invoice.versionId
                    }, invoice));
                });
                return Promise.all(updateInvoicePromiseList);
            }).then((invoiceList: InvoiceDO[]) => {
                resolve(invoiceList);
            }).catch((error: any) => {
                reject(error);
            });
    }
    private stampItem(item: InvoiceItemDO) {
        item.transactionId = this.context.appContext.thUtils.generateUniqueID();
        item.timestamp = (new Date()).getTime();
    }
}
