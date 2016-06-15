import {BaseDO} from '../../../../../common/base/BaseDO';
import {GroupBookingStatus, BookingDO} from '../../../../data-objects/BookingDO';

export class BookingGroupDO extends BaseDO {
    id: string;
    hotelId: string;
    versionId: number;
    groupBookingReference: string;
    status: GroupBookingStatus;
    bookingList: BookingDO[];

    protected getPrimitivePropertyKeys(): string[] {
        return ["id", "hotelId", "versionId", "groupBookingReference", "status"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.bookingList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "bookingList"), (bookingObject: Object) => {
            var bookingDO = new BookingDO();
            bookingDO.buildFromObject(bookingObject);
            bookingDO.groupBookingId = this.id;
            bookingDO.groupBookingReference = this.groupBookingReference;
            bookingDO.hotelId = this.hotelId;
            bookingDO.versionId = this.versionId;
            bookingDO.status = this.status;
            this.bookingList.push(bookingDO);
        });
    }
}