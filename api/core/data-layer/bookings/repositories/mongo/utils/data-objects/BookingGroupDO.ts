import {BaseDO} from '../../../../../common/base/BaseDO';
import {GroupBookingStatus, BookingDO, GroupBookingInputChannel} from '../../../../data-objects/BookingDO';

export class BookingGroupDO extends BaseDO {
    id: string;
    hotelId: string;
    versionId: number;
    groupBookingReference: string;
    status: GroupBookingStatus;
    inputChannel: GroupBookingInputChannel;
    bookingList: BookingDO[];

    protected getPrimitivePropertyKeys(): string[] {
        return ["id", "hotelId", "versionId", "groupBookingReference", "status", "inputChannel"];
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
            bookingDO.inputChannel = this.inputChannel;
            this.bookingList.push(bookingDO);
        });
    }
}