import {HotelOperationsArrivalsInfo, ArrivalItemInfo, ArrivalItemStatus} from './HotelOperationsArrivalsInfo';
import {BookingDO} from '../../../../../data-layer/bookings/data-objects/BookingDO';
import {CustomersContainer} from '../../../../customers/validators/results/CustomersContainer';

import _ = require('underscore');

export class HotelOperationsArrivalsInfoBuilder {
    private _arrivalsInfo: HotelOperationsArrivalsInfo;

    constructor() {
        this._arrivalsInfo = new HotelOperationsArrivalsInfo();
    }

    public appendCanBeCheckedInBookingList(bookingList: BookingDO[]) {
        _.forEach(bookingList, (booking: BookingDO) => {
            var status = ArrivalItemStatus.CanCheckIn;
            if (!booking.defaultBillingDetails.paymentGuarantee) {
                status = ArrivalItemStatus.NoPaymentGuarantee;
            }
            this.appendInformationFromBooking(booking, status);
        });
    }
    public appendNoShowBookingList(bookingList: BookingDO[]) {
        _.forEach(bookingList, (booking: BookingDO) => {
            this.appendInformationFromBooking(booking, ArrivalItemStatus.NoShow);
        });
    }

    private appendInformationFromBooking(booking: BookingDO, arrivalItemStatus: ArrivalItemStatus) {
        var arrivalItemInfo: ArrivalItemInfo = {
            itemStatus: arrivalItemStatus,
            roomCategoryId: booking.roomCategoryId,
            reservedRoomId: booking.roomId,
            customerId: booking.displayCustomerId,
            bookingId: booking.bookingId,
            groupBookingId: booking.groupBookingId,
            bookingInterval: booking.interval,
            bookingCapacity: booking.configCapacity
        }
        this._arrivalsInfo.arrivalInfoList.push(arrivalItemInfo);
    }

    public getCustomerIdList(): string[] {
        var customerIdList = _.map(this._arrivalsInfo.arrivalInfoList, (arrivalInfoItem: ArrivalItemInfo) => { return arrivalInfoItem.customerId });
        return _.uniq(customerIdList);
    }
    public appendCustomerInformation(customersContainer: CustomersContainer) {
        _.forEach(this._arrivalsInfo.arrivalInfoList, (arrivalInfoItem: ArrivalItemInfo) => {
            var customer = customersContainer.getCustomerById(arrivalInfoItem.customerId);
            arrivalInfoItem.customerName = customer.customerDetails.getName();
        });
    }

    public getBuiltHotelOperationsArrivalsInfo(): HotelOperationsArrivalsInfo {
        return this._arrivalsInfo;
    }
}