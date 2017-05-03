import { HotelOperationsDeparturesInfo, DeparturelItemInfo, DeparturelItemBookingStatus } from './HotelOperationsDeparturesInfo';
import { BookingDO, BookingConfirmationStatus } from '../../../../../data-layer/bookings/data-objects/BookingDO';
import { CustomersContainer } from '../../../../customers/validators/results/CustomersContainer';
import { InvoiceGroupDO } from '../../../../../data-layer/invoices/data-objects/InvoiceGroupDO';
import { InvoiceDO } from '../../../../../data-layer/invoices/data-objects/InvoiceDO';
import { ThUtils } from '../../../../../utils/ThUtils';

import _ = require('underscore');

export class HotelOperationsDeparturesInfoBuilder {
    private _thUtils: ThUtils;
    private _departuresInfo: HotelOperationsDeparturesInfo;

    constructor() {
        this._thUtils = new ThUtils();
        this._departuresInfo = new HotelOperationsDeparturesInfo();
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
        var departureItemInfo: DeparturelItemInfo = {
            customerId: booking.displayCustomerId,
            bookingId: booking.id,
            groupBookingId: booking.groupBookingId,
            bookingInterval: booking.interval,
            bookingCapacity: booking.configCapacity,
            bookingItemStatus: departureItemStatus,
            roomCategoryId: booking.roomCategoryId,
            roomId: booking.roomId,
            bookingNotes: booking.notes,
        }
        this._departuresInfo.departureInfoList.push(departureItemInfo);
    }

    public appendInvoiceInformation(invoiceGroupList: InvoiceGroupDO[], attachedBookingList: BookingDO[]) {
        var filteredInvoiceGroupList = this.filterOpenInvoices(invoiceGroupList);
        filteredInvoiceGroupList = this.filterInvoiceGroupsWithAtLeastOneInvoice(filteredInvoiceGroupList);
        this.linkInvoicesWithBookings(filteredInvoiceGroupList);
        filteredInvoiceGroupList = this.filterInvoiceGroupsWithAtLeastOneInvoice(filteredInvoiceGroupList);
        this.createInvoiceDepartureItemForGroupList(filteredInvoiceGroupList, attachedBookingList);
    }
    private filterOpenInvoices(invoiceGroupList: InvoiceGroupDO[]): InvoiceGroupDO[] {
        _.forEach(invoiceGroupList, (invoiceGroup: InvoiceGroupDO) => {
            invoiceGroup.invoiceList = _.filter(invoiceGroup.invoiceList, (invoice: InvoiceDO) => { return !invoice.isClosed() });
        });
        return invoiceGroupList;
    }
    private filterInvoiceGroupsWithAtLeastOneInvoice(invoiceGroupList: InvoiceGroupDO[]): InvoiceGroupDO[] {
        invoiceGroupList = _.filter(invoiceGroupList, (invoiceGroup: InvoiceGroupDO) => {
            return invoiceGroup.invoiceList.length > 0;
        });
        return invoiceGroupList;
    }

    private linkInvoicesWithBookings(invoiceGroupList: InvoiceGroupDO[]) {
        _.forEach(this._departuresInfo.departureInfoList, (departureItem: DeparturelItemInfo) => {
            var linkedInvoice = this.getLinkedInvoice(invoiceGroupList, departureItem);
            if (!this._thUtils.isUndefinedOrNull(linkedInvoice)) {
                departureItem.invoiceGroupId = linkedInvoice.invoiceGroupId;
                departureItem.invoicePrice = linkedInvoice.invoiceDO.getPrice();
            }
        });
    }
    private getLinkedInvoice(invoiceGroupList: InvoiceGroupDO[], departureItem: DeparturelItemInfo): { invoiceGroupId: string, invoiceDO: InvoiceDO } {
        for (var index = 0; index < invoiceGroupList.length; index++) {
            var invoiceGroup: InvoiceGroupDO = invoiceGroupList[index];
            var foundInvoice = _.find(invoiceGroup.invoiceList, (invoice: InvoiceDO) => { return invoice.bookingId === departureItem.bookingId });
            if (!this._thUtils.isUndefinedOrNull(foundInvoice)) {
                invoiceGroup.invoiceList = _.filter(invoiceGroup.invoiceList, (invoice: InvoiceDO) => { return invoice.bookingId !== departureItem.bookingId });
                return {
                    invoiceGroupId: invoiceGroup.id,
                    invoiceDO: foundInvoice
                };
            }
        }
        return null;
    }
    private createInvoiceDepartureItemForGroupList(invoiceGroupList: InvoiceGroupDO[], attachedBookingList: BookingDO[]) {
        _.forEach(invoiceGroupList, (invoiceGroup: InvoiceGroupDO) => {
            this.createInvoiceDepartureItemForGroup(invoiceGroup, attachedBookingList);
        });
    }
    private createInvoiceDepartureItemForGroup(invoiceGroup: InvoiceGroupDO, attachedBookingList: BookingDO[]) {
        _.forEach(invoiceGroup.invoiceList, (invoice: InvoiceDO) => {
            this.createInvoiceDepartureItemForInvoice(invoiceGroup.id, invoice, attachedBookingList);
        });
    }
    private createInvoiceDepartureItemForInvoice(invoiceGroupId: string, invoice: InvoiceDO, attachedBookingList: BookingDO[]) {
        if (this.invoiceHasAttachedCheckedInBooking(invoice, attachedBookingList)) {
            return;
        }
        var departureItemInfo: DeparturelItemInfo = {
            customerId: invoice.payerList[0].customerId,
            bookingItemStatus: DeparturelItemBookingStatus.CanNotCheckOut,
            invoiceGroupId: invoiceGroupId,
            invoicePrice: invoice.getPrice()
        }
        this._departuresInfo.departureInfoList.push(departureItemInfo);
    }
    private invoiceHasAttachedCheckedInBooking(invoice: InvoiceDO, attachedBookingList: BookingDO[]): boolean {
        if (this._thUtils.isUndefinedOrNull(invoice.bookingId)) {
            return false;
        }
        var attachedBooking = _.find(attachedBookingList, (booking: BookingDO) => { return booking.id === invoice.bookingId });
        if (this._thUtils.isUndefinedOrNull(attachedBooking)) {
            return false;
        }
        return attachedBooking.confirmationStatus === BookingConfirmationStatus.CheckedIn;
    }

    public getCustomerIdList(): string[] {
        var customerIdList = _.map(this._departuresInfo.departureInfoList, (departureInfoItem: DeparturelItemInfo) => { return departureInfoItem.customerId });
        return _.uniq(customerIdList);
    }

    public appendCustomerInformation(customersContainer: CustomersContainer) {
        _.forEach(this._departuresInfo.departureInfoList, (departureInfoItem: DeparturelItemInfo) => {
            var customer = customersContainer.getCustomerById(departureInfoItem.customerId);
            departureInfoItem.customerName = customer.customerDetails.getName();
        });
    }

    public getBuiltHotelOperationsDeparturesInfo(): HotelOperationsDeparturesInfo {
        return this._departuresInfo;
    }
}