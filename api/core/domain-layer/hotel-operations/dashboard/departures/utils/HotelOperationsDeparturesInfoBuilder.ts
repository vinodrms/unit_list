import { AppContext } from '../../../../../utils/AppContext';
import { SessionContext } from '../../../../../utils/SessionContext';
import _ = require('underscore');
import { HotelOperationsDeparturesInfo, DeparturelItemInfo, DeparturelItemBookingStatus, DepartureItemCustomerInfo } from './HotelOperationsDeparturesInfo';
import { BookingDO, BookingConfirmationStatus } from '../../../../../data-layer/bookings/data-objects/BookingDO';
import { CustomersContainer } from '../../../../customers/validators/results/CustomersContainer';
import { ThUtils } from '../../../../../utils/ThUtils';
import { InvoiceDO } from "../../../../../data-layer/invoices/data-objects/InvoiceDO";

export class HotelOperationsDeparturesInfoBuilder {
    private thUtils: ThUtils;
    private departuresInfo: HotelOperationsDeparturesInfo;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this.thUtils = new ThUtils();
        this.departuresInfo = new HotelOperationsDeparturesInfo();
    }

    public appendBookingList(bookingList: BookingDO[]) {
        _.forEach(bookingList, (booking: BookingDO) => {
            this.appendInformationFromBooking(booking);
        });
    }

    private appendInformationFromBooking(booking: BookingDO) {
        var departureItemStatus = DeparturelItemBookingStatus.CanNotCheckOut;
        if (booking.confirmationStatus === BookingConfirmationStatus.CheckedIn) {
            departureItemStatus = DeparturelItemBookingStatus.CanCheckOut;
        }

        let guestCustomerInfoList: DepartureItemCustomerInfo[] = [];
        _.forEach(booking.customerIdList, (customerId: string) => {
            let customerInfo = new DepartureItemCustomerInfo();
            customerInfo.customerId = customerId;
            guestCustomerInfoList.push(customerInfo);
        })

        var departureItemInfo: DeparturelItemInfo = {
            customerId: booking.displayCustomerId,
            corporateCustomerId: booking.corporateDisplayCustomerId,
            guestCustomerInfoList: guestCustomerInfoList,
            bookingId: booking.id,
            groupBookingId: booking.groupBookingId,
            bookingInterval: booking.interval,
            bookingCapacity: booking.configCapacity,
            bookingItemStatus: departureItemStatus,
            roomCategoryId: booking.roomCategoryId,
            roomId: booking.roomId,
            bookingNotes: booking.notes,
            billedCustomerId: booking.defaultBillingDetails.customerId
        }
        this.departuresInfo.departureInfoList.push(departureItemInfo);
    }

    public appendInvoiceInformation(invoiceList: InvoiceDO[], attachedBookingList: BookingDO[]) {
        var filteredInvoiceList = this.filterOpenInvoices(invoiceList);
        filteredInvoiceList = this.linkInvoicesWithBookings(filteredInvoiceList);
        this.createInvoiceDepartureItemForInvoices(filteredInvoiceList, attachedBookingList);
    }
    private filterOpenInvoices(invoiceList: InvoiceDO[]): InvoiceDO[] {
        return _.filter(invoiceList, (invoice: InvoiceDO) => { return !invoice.isClosed() });
    }
    private linkInvoicesWithBookings(invoiceList: InvoiceDO[]): InvoiceDO[] {
        let unlinkedInvoices = invoiceList;
        _.forEach(this.departuresInfo.departureInfoList, (departureItem: DeparturelItemInfo) => {
            var linkedInvoice = this.getLinkedInvoice(unlinkedInvoices, departureItem);
            if (!this.thUtils.isUndefinedOrNull(linkedInvoice)) {
                departureItem.invoiceGroupId = linkedInvoice.groupId;
                departureItem.invoiceId = linkedInvoice.id;
                departureItem.invoicePrice = linkedInvoice.amountToPay;
                unlinkedInvoices = _.filter(unlinkedInvoices, (invoice: InvoiceDO) => { return invoice.id != linkedInvoice.id; });
            }
        });
        return unlinkedInvoices;
    }
    private getLinkedInvoice(invoiceList: InvoiceDO[], departureItem: DeparturelItemInfo): InvoiceDO {
        return _.find(invoiceList, (invoice: InvoiceDO) => {
            return _.contains(invoice.indexedBookingIdList, departureItem.bookingId);
        });
    }

    private createInvoiceDepartureItemForInvoices(invoiceList: InvoiceDO[], attachedBookingList: BookingDO[]) {
        _.forEach(invoiceList, (invoice: InvoiceDO) => {
            if (this.invoiceHasOnlyCheckedInBookingsAttached(invoice, attachedBookingList)) {
                return;
            }
            var departureItemInfo: DeparturelItemInfo = {
                customerId: invoice.payerList.length > 0 ? invoice.payerList[0].customerId : "",
                bookingItemStatus: DeparturelItemBookingStatus.CanNotCheckOut,
                invoiceGroupId: invoice.groupId,
                invoiceId: invoice.id,
                invoicePrice: invoice.amountToPay
            }
            this.departuresInfo.departureInfoList.push(departureItemInfo);
        });
    }

    private invoiceHasOnlyCheckedInBookingsAttached(invoice: InvoiceDO, attachedBookingList: BookingDO[]): boolean {
        if (invoice.isWalkInInvoice()) {
            return false;
        }
        let bookingList: BookingDO[] = _.filter(attachedBookingList, (booking: BookingDO) => {
            return _.contains(invoice.indexedBookingIdList, booking.id);
        });
        let checkedInBookingList: BookingDO[] = _.filter(bookingList, (booking: BookingDO) => {
            return booking.confirmationStatus === BookingConfirmationStatus.CheckedIn;
        });
        return bookingList.length == checkedInBookingList.length;
    }

    public getCustomerIdList(): string[] {
        let customerIdList = [];
        _.forEach(this.departuresInfo.departureInfoList, (departureInfoItem: DeparturelItemInfo) => {
            let guestCustomerIdList = _.map(departureInfoItem.guestCustomerInfoList, (customerInfo: DepartureItemCustomerInfo) => {
                return customerInfo.customerId;
            });
            customerIdList = customerIdList.concat(guestCustomerIdList);
            if (_.isString(departureInfoItem.customerId) && departureInfoItem.customerId.length > 0) {
                customerIdList.push(departureInfoItem.customerId);
            }
        });

        var departureInfoListWithCorporateCustomerId = _.filter(this.departuresInfo.departureInfoList, (departureInfoItem: DeparturelItemInfo) => { return departureInfoItem.corporateCustomerId && departureInfoItem.corporateCustomerId.length > 0 });
        customerIdList = _.union(customerIdList, _.map(departureInfoListWithCorporateCustomerId, (departureInfoItem: DeparturelItemInfo) => {
            if (departureInfoItem.corporateCustomerId && departureInfoItem.corporateCustomerId.length > 0) {
                return departureInfoItem.corporateCustomerId;
            } else return;
        }));
        return _.uniq(customerIdList);
    }

    public appendCustomerInformation(customersContainer: CustomersContainer) {
        _.forEach(this.departuresInfo.departureInfoList, (departureInfoItem: DeparturelItemInfo) => {
            if (departureInfoItem.customerId && departureInfoItem.customerId.length > 0) {
                var customer = customersContainer.getCustomerById(departureInfoItem.customerId);
                departureInfoItem.customerName = customer.customerDetails.getName();
            }
            else {
                departureInfoItem.customerName = this._appContext.thTranslate.translate("No Customer");
            }
            if (departureInfoItem.corporateCustomerId && departureInfoItem.corporateCustomerId.length > 0) {
                var corporateCustomer = customersContainer.getCustomerById(departureInfoItem.corporateCustomerId);
                departureInfoItem.corporateCustomerName = corporateCustomer.customerDetails.getName();
            }
            if (departureInfoItem.billedCustomerId && departureInfoItem.billedCustomerId.length > 0) {
                var billedCustomer = customersContainer.getCustomerById(departureInfoItem.billedCustomerId);
                departureInfoItem.isBookingBilledToCompany = billedCustomer.isCompanyOrTravelAgency();
            }
            _.forEach(departureInfoItem.guestCustomerInfoList, (customerInfo: DepartureItemCustomerInfo) => {
                let customer = customersContainer.getCustomerById(customerInfo.customerId);
                customerInfo.customerName = customer.customerDetails.getName();
            });
        });
    }

    public getBuiltHotelOperationsDeparturesInfo(): HotelOperationsDeparturesInfo {
        return this.departuresInfo;
    }
}
