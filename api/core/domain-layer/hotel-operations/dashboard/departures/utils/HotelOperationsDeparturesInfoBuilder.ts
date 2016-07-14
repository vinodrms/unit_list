import {HotelOperationsDeparturesInfo, DeparturelItemInfo} from './HotelOperationsDeparturesInfo';
import {BookingDO} from '../../../../../data-layer/bookings/data-objects/BookingDO';
import {CustomersContainer} from '../../../../customers/validators/results/CustomersContainer';

import _ = require('underscore');

export class HotelOperationsDeparturesInfoBuilder {
    private _departuresInfo: HotelOperationsDeparturesInfo;

    constructor() {
        this._departuresInfo = new HotelOperationsDeparturesInfo();
    }

    public appendBookingList(bookingList: BookingDO[]) {
        _.forEach(bookingList, (booking: BookingDO) => {
            this.appendInformationFromBooking(booking);
        });
    }
    private appendInformationFromBooking(booking: BookingDO) {
        var departureItemInfo: DeparturelItemInfo = {
            customerId: booking.displayCustomerId,
            bookingId: booking.bookingId,
            groupBookingId: booking.groupBookingId,
            bookingInterval: booking.interval,
            bookingCapacity: booking.configCapacity,
            roomCategoryId: booking.roomCategoryId,
            roomId: booking.roomId,
        }
        this._departuresInfo.departureInfoList.push(departureItemInfo);
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