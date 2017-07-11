import {BaseDO} from '../../../../../common/base/BaseDO';
import {BookingDO} from './BookingDO';

import * as _ from "underscore";

export class BookingsDO extends BaseDO {
    bookingList: BookingDO[];

    protected getPrimitivePropertyKeys(): string[] {
        return [];
    }
    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.bookingList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "bookingList"), (bookingObject: Object) => {
            var bookingDO = new BookingDO();
            bookingDO.buildFromObject(bookingObject);
            this.bookingList.push(bookingDO);
        });
    }

    public getUniqueCustomerIdList(): string[] {
        var customerIdList: string[] = [];
        _.forEach(this.bookingList, (booking: BookingDO) => {
            customerIdList = customerIdList.concat(booking.customerIdList);
        });
        return _.uniq(customerIdList);
    }
}