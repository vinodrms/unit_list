import {ThUtils} from '../../../../../utils/ThUtils';
import {BookingDO} from '../../../../../data-layer/bookings/data-objects/BookingDO';
import {HotelOperationsRoomInfo, RoomItemInfo, RoomItemStatus} from './HotelOperationsRoomInfo';
import {CustomersContainer} from '../../../../customers/validators/results/CustomersContainer';

import _ = require('underscore');
import { InvoiceDO } from "../../../../../data-layer/invoices/data-objects/InvoiceDO";

export class HotelOperationsRoomInfoBuilder {
    private _thUtils: ThUtils;
    private _roomInfo: HotelOperationsRoomInfo;

    constructor() {
        this._thUtils = new ThUtils();
        this._roomInfo = new HotelOperationsRoomInfo();
    }

    public appendCheckedInBookingList(bookingList: BookingDO[]) {
        this.appendBookingList(bookingList, RoomItemStatus.Occupied);
        this._roomInfo.totalOccupiedRooms = _.filter(this._roomInfo.roomInfoList, (roomItemInfo: RoomItemInfo) => {return roomItemInfo.roomStatus == RoomItemStatus.Occupied}).length;        
    }
    public appendCanBeCheckedInBookingList(bookingList: BookingDO[]) {
        this.appendBookingList(bookingList, RoomItemStatus.Reserved);
    }

    private appendBookingList(bookingList: BookingDO[], itemStatus: RoomItemStatus) {
        _.forEach(bookingList, (booking: BookingDO) => {
            this.appendInformationFromBooking(booking, itemStatus);
        });
    }
    private appendInformationFromBooking(booking: BookingDO, roomItemStatus: RoomItemStatus) {
        if (this._thUtils.isUndefinedOrNull(booking.roomId) || !_.isString(booking.roomId)) {
            return;
        }
        if (this.containsInformationForRoomId(booking.roomId)) {
            return;
        }
        var roomItemInfo = this.buildRoomItemInfoFor(booking, roomItemStatus);
        this._roomInfo.roomInfoList.push(roomItemInfo);
        this._roomInfo.totalInHouseGuests += booking.getNoOfGuests();
    }
    private containsInformationForRoomId(roomId: string): boolean {
        var foundRoomItemInfo = _.find(this._roomInfo.roomInfoList, (roomItem: RoomItemInfo) => {
            return roomItem.roomId === roomId;
        });
        return !this._thUtils.isUndefinedOrNull(foundRoomItemInfo);
    }
    private buildRoomItemInfoFor(booking: BookingDO, roomItemStatus: RoomItemStatus): RoomItemInfo {
        return {
            roomId: booking.roomId,
            roomStatus: roomItemStatus,
            customerId: booking.displayCustomerId,
            bookingId: booking.id,
            groupBookingId: booking.groupBookingId,
            bookingInterval: booking.interval,
            bookingCapacity: booking.configCapacity
        }
    }

    public getCustomerIdList(): string[] {
        var customerIdList = _.map(this._roomInfo.roomInfoList, (roomInfoItem: RoomItemInfo) => { return roomInfoItem.customerId });
        return _.uniq(customerIdList);
    }
    public appendCustomerInformation(customersContainer: CustomersContainer) {
        _.forEach(this._roomInfo.roomInfoList, (roomInfoItem: RoomItemInfo) => {
            var customer = customersContainer.getCustomerById(roomInfoItem.customerId);
            roomInfoItem.customerName = customer.customerDetails.getName();
        });
    }

    public appendInvoiceInformation(invoiceList: InvoiceDO[]) {
        _.forEach(this._roomInfo.roomInfoList, (roomInfoItem: RoomItemInfo) => {
            var linkedInvoice = this.getLinkedInvoice(invoiceList, roomInfoItem);
            if (!this._thUtils.isUndefinedOrNull(linkedInvoice)) {
                roomInfoItem.invoiceId = linkedInvoice.id;
                roomInfoItem.invoicePrice = linkedInvoice.amountToPay;
            }
        });        
    }

    public getBuiltHotelOperationsRoomInfo(): HotelOperationsRoomInfo {
        return this._roomInfo;
    }

    private getLinkedInvoice(invoiceList: InvoiceDO[], roomItem: RoomItemInfo): InvoiceDO {
        return _.find(invoiceList, (invoice: InvoiceDO) => {
            return _.contains(invoice.indexedBookingIdList, roomItem.bookingId);
        });
    }
}