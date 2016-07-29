import {InvoiceGroupDO} from '../../../core/data-layer/invoices/data-objects/InvoiceGroupDO';
import {InvoiceDO, InvoicePaymentStatus} from '../../../core/data-layer/invoices/data-objects/InvoiceDO';
import {InvoiceItemDO, InvoiceItemType} from '../../../core/data-layer/invoices/data-objects/items/InvoiceItemDO';
import {InvoicePayerDO} from '../../../core/data-layer/invoices/data-objects/payers/InvoicePayerDO';
import {BookingDO} from '../../../core/data-layer/bookings/data-objects/BookingDO';
import {CustomerDO} from '../../../core/data-layer/customers/data-objects/CustomerDO';
import {AddOnProductDO} from '../../../core/data-layer/add-on-products/data-objects/AddOnProductDO'
import {TestContext} from '../../helpers/TestContext';

export interface IInvoiceGroupDataSource {
    getInvoiceGroupList(customerList: CustomerDO[], aopList: AddOnProductDO[], bookingList: BookingDO[]): Promise<InvoiceGroupDO>[];
}

export class DefaultInvoiceGroupBuilder implements IInvoiceGroupDataSource {
    
    constructor(private _testContext: TestContext) {
    }

    public getInvoiceGroupList(customerList: CustomerDO[], aopList: AddOnProductDO[], bookingList: BookingDO[]): Promise<InvoiceGroupDO>[] {
        var invoiceGroupList: Promise<InvoiceGroupDO>[] = [];
        invoiceGroupList.push(this.buildBookingInvoiceGroup(customerList, aopList, bookingList));
        return invoiceGroupList;
    }

    public buildBookingInvoiceGroup(customerList: CustomerDO[], aopList: AddOnProductDO[], bookingList: BookingDO[]): Promise<InvoiceGroupDO> {
        return new Promise<InvoiceGroupDO>((resolve: { (result: InvoiceGroupDO): void }, reject: { (err: any): void }) => {
            try {
                this.buildBookingInvoiceGroupCore(customerList, aopList, bookingList, resolve, reject);
            } catch (error) {
                reject(error);
            }
        });
    }

    private buildBookingInvoiceGroupCore(customerList: CustomerDO[], aopList: AddOnProductDO[], bookingList: BookingDO[],
        resolve: { (result: InvoiceGroupDO): void }, reject: { (err: any): void }) {
        var bookingInvoiceGroup = new InvoiceGroupDO();
        var groupedBookings = _.groupBy(bookingList, (bookindDO: BookingDO) => {
            return bookindDO.groupBookingId;
        });
        var groupBookingIdList = Object.keys(groupedBookings);
        var groupBookingId = groupBookingIdList[1];
        bookingInvoiceGroup.groupBookingId = groupBookingId;
        bookingInvoiceGroup.invoiceList = [];
        bookingInvoiceGroup.paymentStatus = InvoicePaymentStatus.Open;

        var invoiceBuilderPromiseList = [];
        _.forEach(groupedBookings[groupBookingId], (booking: BookingDO) => {
            invoiceBuilderPromiseList.push(this.buildBookingInvoiceFromBooking(booking, customerList));
        });
        Promise.all(invoiceBuilderPromiseList).then((invoiceList: InvoiceDO[]) => {
            _.forEach(invoiceList, (invoice: InvoiceDO) => {
                bookingInvoiceGroup.invoiceList.push(invoice);
            });
            resolve(bookingInvoiceGroup);
        }).catch((error: any) => {
            reject(error);
        });
    }

    private buildBookingInvoiceFromBooking(booking: BookingDO, customerList: CustomerDO[]): Promise<InvoiceDO> {
        return new Promise<InvoiceDO>((resolve: { (result: InvoiceDO): void }, reject: { (err: any): void }) => {
            try {
                this.buildBookingInvoiceFromBookingCore(booking, customerList, resolve, reject);
            } catch (error) {
                reject(error);
            }
        });
    }

    private buildBookingInvoiceFromBookingCore(booking: BookingDO, customerList: CustomerDO[],
        resolve: { (result: InvoiceDO): void }, reject: { (err: any): void }) {
        var invoice = new InvoiceDO();
        invoice.bookingId = booking.bookingId;
        invoice.itemList = [];
        var bookingInvoiceItem = new InvoiceItemDO();
        bookingInvoiceItem.type = InvoiceItemType.Booking;
        invoice.itemList.push(bookingInvoiceItem);
        invoice.payerList = [];
        invoice.paymentStatus = InvoicePaymentStatus.Open;
        var defaultBillingCustomer = _.find(customerList, ((customer: CustomerDO) => {
            return customer.id === booking.defaultBillingDetails.customerId;
        }));
        var defaultInvoicePayer =
            InvoicePayerDO.buildFromCustomerDOAndPaymentMethod(defaultBillingCustomer, booking.defaultBillingDetails.paymentMethod);
        booking.price.getPrice().then((price: number) => {
            defaultInvoicePayer.priceToPay = price;
            invoice.payerList.push(defaultInvoicePayer);
            resolve(invoice);
        }).catch((error) => {
            reject(error);
        });
    }

    public loadInvoiceGroups(dataSource: IInvoiceGroupDataSource, customerList: CustomerDO[], aopList: AddOnProductDO[], bookingList: BookingDO[]): Promise<InvoiceGroupDO[]> {
        return new Promise<InvoiceGroupDO[]>((resolve: { (result: InvoiceGroupDO[]): void }, reject: { (err: any): void }) => {
            this.loadInvoiceGroupsCore(resolve, reject, dataSource, customerList, aopList, bookingList);
        });
    }
    private loadInvoiceGroupsCore(resolve: { (result: InvoiceGroupDO[]): void }, reject: { (err: any): void },
        dataSource: IInvoiceGroupDataSource, customerList: CustomerDO[], aopList: AddOnProductDO[], bookingList: BookingDO[]) {

        var invoiceGroupPromiseList = dataSource.getInvoiceGroupList(customerList, aopList, bookingList);
        Promise.all(invoiceGroupPromiseList).then((invoiceGroupList: InvoiceGroupDO[]) => {
            var addInvoiceGroupPromiseList: Promise<InvoiceGroupDO>[] = [];
            invoiceGroupList.forEach((invoiceGroup: InvoiceGroupDO) => {
                var invoiceGroupsRepository = this._testContext.appContext.getRepositoryFactory().getInvoiceGroupsRepository();
                addInvoiceGroupPromiseList.push(invoiceGroupsRepository.addInvoiceGroup({ hotelId: this._testContext.sessionContext.sessionDO.hotel.id }, invoiceGroup));
            });
            Promise.all(addInvoiceGroupPromiseList).then((invoiceGroupList: InvoiceGroupDO[]) => {
                resolve(invoiceGroupList);
            }).catch((error: any) => {
                reject(error);
            });
        }).catch((error: any) => {
            reject(error);
        });
    }
}