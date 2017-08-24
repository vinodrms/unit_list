import { InvoiceGroupDO } from '../../../core/data-layer/invoices-deprecated/data-objects/InvoiceGroupDO';
import { InvoiceDO, InvoicePaymentStatus } from '../../../core/data-layer/invoices-deprecated/data-objects/InvoiceDO';
import { InvoiceItemDO, InvoiceItemType } from '../../../core/data-layer/invoices-deprecated/data-objects/items/InvoiceItemDO';
import { InvoicePayerDO } from '../../../core/data-layer/invoices-deprecated/data-objects/payers/InvoicePayerDO';
import { BookingDO } from '../../../core/data-layer/bookings/data-objects/BookingDO';
import { CustomerDO } from '../../../core/data-layer/customers/data-objects/CustomerDO';
import { AddOnProductDO } from '../../../core/data-layer/add-on-products/data-objects/AddOnProductDO'
import { AddOnProductInvoiceItemMetaDO } from '../../../core/data-layer/invoices-deprecated/data-objects/items/add-on-products/AddOnProductInvoiceItemMetaDO';
import { TestContext } from '../../helpers/TestContext';
import { HotelDO } from "../../../core/data-layer/hotel/data-objects/HotelDO";
import { TransactionFeeDO } from "../../../core/data-layer/common/data-objects/payment-method/TransactionFeeDO";

import _ = require("underscore");

export interface IInvoiceGroupDataSource {
    getInvoiceGroupList(hotel: HotelDO, customerList: CustomerDO[], aopList: AddOnProductDO[], bookingList: BookingDO[]): InvoiceGroupDO[];
}

export class DefaultInvoiceGroupBuilder implements IInvoiceGroupDataSource {

    constructor(private _testContext: TestContext) {
    }

    public getInvoiceGroupList(hotel: HotelDO, customerList: CustomerDO[], aopList: AddOnProductDO[], bookingList: BookingDO[]): InvoiceGroupDO[] {
        var invoiceGroupList: InvoiceGroupDO[] = [];
        invoiceGroupList.push(this.buildBookingInvoiceGroup(hotel, customerList, aopList, bookingList));
        return invoiceGroupList;
    }

    public buildBookingInvoiceGroup(hotel: HotelDO, customerList: CustomerDO[], aopList: AddOnProductDO[], bookingList: BookingDO[]): InvoiceGroupDO {
        var bookingInvoiceGroup = new InvoiceGroupDO();
        var groupedBookings = _.groupBy(bookingList, (bookindDO: BookingDO) => {
            return bookindDO.groupBookingId;
        });
        var groupBookingIdList = Object.keys(groupedBookings);
        var groupBookingId = groupBookingIdList[1];
        bookingInvoiceGroup.groupBookingId = groupBookingId;
        bookingInvoiceGroup.invoiceList = [];

        var invoiceBuilderPromiseList = [];
        _.forEach(groupedBookings[groupBookingId], (booking: BookingDO) => {
            var bookingInvoice = this.buildBookingInvoiceFromBooking(hotel, booking, customerList);
            var invoicePayer = bookingInvoice.payerList[0];
            var aopOnlyInvoice = this.buildInvoiceWithTwoAddOnProducts(invoicePayer, aopList);
            bookingInvoiceGroup.invoiceList.push(bookingInvoice);
            bookingInvoiceGroup.invoiceList.push(aopOnlyInvoice);
        });

        return bookingInvoiceGroup;
    }

    private buildBookingInvoiceFromBooking(hotel: HotelDO, booking: BookingDO, customerList: CustomerDO[]): InvoiceDO {
        var invoice = new InvoiceDO();
        invoice.bookingId = booking.id;
        invoice.itemList = [];
        var bookingInvoiceItem = new InvoiceItemDO();
        bookingInvoiceItem.type = InvoiceItemType.Booking;
        bookingInvoiceItem.id = booking.id;
        invoice.itemList.push(bookingInvoiceItem);
        invoice.payerList = [];
        invoice.paymentStatus = InvoicePaymentStatus.Unpaid;
        var defaultBillingCustomer = _.find(customerList, ((customer: CustomerDO) => {
            return customer.id === booking.defaultBillingDetails.customerId;
        }));
        var defaultInvoicePayer =
            InvoicePayerDO.buildFromCustomerDOAndPaymentMethod(defaultBillingCustomer, booking.defaultBillingDetails.paymentMethod);
        defaultInvoicePayer.priceToPay = booking.price.getTotalPrice();
        defaultInvoicePayer.priceToPayPlusTransactionFee = defaultInvoicePayer.priceToPay;
        defaultInvoicePayer.transactionFeeSnapshot = TransactionFeeDO.getDefaultTransactionFee();
        invoice.payerList.push(defaultInvoicePayer);
        return invoice;
    }

    private buildInvoiceWithTwoAddOnProducts(payerCustomer: InvoicePayerDO, aopList: AddOnProductDO[]): InvoiceDO {
        var invoice = new InvoiceDO();
        invoice.itemList = [];

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

            invoice.itemList.push(aopInvoiceItem);
            totalAmountToPay += aop.price;
        });

        invoice.paymentStatus = InvoicePaymentStatus.Unpaid;
        invoice.payerList = [];
        payerCustomer.priceToPay = totalAmountToPay;
        payerCustomer.priceToPayPlusTransactionFee = payerCustomer.priceToPay;
        payerCustomer.transactionFeeSnapshot = TransactionFeeDO.getDefaultTransactionFee();
        invoice.payerList.push(payerCustomer);

        return invoice;
    }

    public loadInvoiceGroups(dataSource: IInvoiceGroupDataSource, hotel: HotelDO, customerList: CustomerDO[], aopList: AddOnProductDO[], bookingList: BookingDO[]): Promise<InvoiceGroupDO[]> {
        return new Promise<InvoiceGroupDO[]>((resolve: { (result: InvoiceGroupDO[]): void }, reject: { (err: any): void }) => {
            this.loadInvoiceGroupsCore(resolve, reject, dataSource, hotel, customerList, aopList, bookingList);
        });
    }
    private loadInvoiceGroupsCore(resolve: { (result: InvoiceGroupDO[]): void }, reject: { (err: any): void },
        dataSource: IInvoiceGroupDataSource, hotel: HotelDO, customerList: CustomerDO[], aopList: AddOnProductDO[], bookingList: BookingDO[]) {

        var invoiceGroupList = dataSource.getInvoiceGroupList(hotel, customerList, aopList, bookingList);
        var addInvoiceGroupPromiseList: Promise<InvoiceGroupDO>[] = [];
        invoiceGroupList.forEach((invoiceGroup: InvoiceGroupDO) => {
            var invoiceGroupsRepository = this._testContext.appContext.getRepositoryFactory().getInvoiceGroupsRepositoryDeprecated();
            addInvoiceGroupPromiseList.push(invoiceGroupsRepository.addInvoiceGroup({ hotelId: this._testContext.sessionContext.sessionDO.hotel.id }, invoiceGroup));
        });
        Promise.all(addInvoiceGroupPromiseList).then((invoiceGroupList: InvoiceGroupDO[]) => {
            resolve(invoiceGroupList);
        }).catch((error: any) => {
            reject(error);
        });
    }
}
