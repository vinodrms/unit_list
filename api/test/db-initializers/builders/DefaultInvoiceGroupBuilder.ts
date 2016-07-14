import {ThUtils} from '../../../core/utils/ThUtils';
import {TestUtils} from '../../helpers/TestUtils';
import {Locales} from '../../../core/utils/localization/ThTranslation';
import {AppContext} from '../../../core/utils/AppContext';
import {TestContext} from '../../helpers/TestContext';
import {ThError} from '../../../core/utils/th-responses/ThError';
import {InvoiceGroupDO} from '../../../core/data-layer/invoices/data-objects/InvoiceGroupDO';
import {InvoiceDO, InvoicePaymentStatus} from '../../../core/data-layer/invoices/data-objects/InvoiceDO';
import {InvoiceItemDO, InvoiceItemType} from '../../../core/data-layer/invoices/data-objects/items/InvoiceItemDO';
import {InvoicePayerDO} from '../../../core/data-layer/invoices/data-objects/payers/InvoicePayerDO';
import {InvoicePaymentMethodDO} from '../../../core/data-layer/invoices/data-objects/payers/InvoicePaymentMethodDO';
import {BookingDO} from '../../../core/data-layer/bookings/data-objects/BookingDO';
import {CustomerDO} from '../../../core/data-layer/customers/data-objects/CustomerDO';
import {AddOnProductDO} from '../../../core/data-layer/add-on-products/data-objects/AddOnProductDO'

export interface IInvoiceGroupDataSource {
    getInvoiceGroupList(customerList: CustomerDO[], aopList: AddOnProductDO[], bookingList: BookingDO[]): InvoiceGroupDO[];
}

export class DefaultInvoiceGroupBuilder implements IInvoiceGroupDataSource {
    private _testUtils: TestUtils;

    constructor(private _testContext: TestContext) {
        this._testUtils = new TestUtils();
    }

    public getInvoiceGroupList(customerList: CustomerDO[], aopList: AddOnProductDO[], bookingList: BookingDO[]): InvoiceGroupDO[] {
        var invoiceGroupList = [];

        invoiceGroupList.push(this.buildBookingInvoiceGroup(customerList, aopList, bookingList));

        return invoiceGroupList;
    }

    public buildBookingInvoiceGroup(customerList: CustomerDO[], aopList: AddOnProductDO[], bookingList: BookingDO[]): InvoiceGroupDO {
        var bookingInvoiceGroup = new InvoiceGroupDO();
        var groupedBookings = _.groupBy(bookingList, (bookindDO: BookingDO) => {
            return bookindDO.groupBookingId;
        });
        var groupBookingIdList = Object.keys(groupedBookings);
        var groupBookingId = groupBookingIdList[1];
        bookingInvoiceGroup.groupBookingId = groupBookingId;
        bookingInvoiceGroup.invoiceList = [];
        _.forEach(groupedBookings[groupBookingId], (booking: BookingDO) => {
            bookingInvoiceGroup.invoiceList.push(this.buildBookingInvoiceFromBooking(booking, customerList));
        });
        bookingInvoiceGroup.paymentStatus = InvoicePaymentStatus.Open;
    
        return bookingInvoiceGroup;
    }

    private buildBookingInvoiceFromBooking(booking: BookingDO, customerList: CustomerDO[]): InvoiceDO {
        var invoice = new InvoiceDO();
        invoice.bookingId = booking.bookingId;
        invoice.itemList = [];
        var bookingInvoiceItem = new InvoiceItemDO();
        bookingInvoiceItem.type = InvoiceItemType.Booking;
        invoice.itemList.push(bookingInvoiceItem);
        invoice.payerList = [];
        var defaultBillingCustomer = _.find(customerList, ((customer: CustomerDO) => {
            return customer.id === booking.defaultBillingDetails.customerId;
        }));
        invoice.payerList.push(InvoicePayerDO.buildFromCustomerDOAndPaymentMethod(defaultBillingCustomer, booking.defaultBillingDetails.paymentMethod));
        
        invoice.paymentStatus = InvoicePaymentStatus.Open;
        return invoice;
    }

    public loadInvoiceGroups(dataSource: IInvoiceGroupDataSource, customerList: CustomerDO[], aopList: AddOnProductDO[], bookingList: BookingDO[]): Promise<InvoiceGroupDO[]> {
        return new Promise<InvoiceGroupDO[]>((resolve: { (result: InvoiceGroupDO[]): void }, reject: { (err: ThError): void }) => {
            this.loadInvoiceGroupsCore(resolve, reject, dataSource, customerList, aopList, bookingList);
        });
    }
    private loadInvoiceGroupsCore(resolve: { (result: InvoiceGroupDO[]): void }, reject: { (err: ThError): void },
        dataSource: IInvoiceGroupDataSource, customerList: CustomerDO[], aopList: AddOnProductDO[], bookingList: BookingDO[]) {

        var invoiceGroupList = dataSource.getInvoiceGroupList(customerList, aopList, bookingList);
        var invoiceGroupsRepository = this._testContext.appContext.getRepositoryFactory().getInvoiceGroupsRepository();

        var invoiceGroupPromiseList: Promise<InvoiceGroupDO>[] = [];
        invoiceGroupList.forEach((invoiceGroup: InvoiceGroupDO) => {
            invoiceGroupPromiseList.push(invoiceGroupsRepository.addInvoiceGroup({ hotelId: this._testContext.sessionContext.sessionDO.hotel.id }, invoiceGroup));
        });

        Promise.all(invoiceGroupPromiseList).then((invoiceGroupList: InvoiceGroupDO[]) => {
            resolve(invoiceGroupList);
        }).catch((error: any) => {
            reject(error);
        });
    }
}