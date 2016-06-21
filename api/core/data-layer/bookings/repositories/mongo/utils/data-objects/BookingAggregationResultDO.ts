import {BaseDO} from '../../../../../common/base/BaseDO';
import {GroupBookingStatus, BookingDO, GroupBookingInputChannel} from '../../../../data-objects/BookingDO';

export class BookingAggregationResultDO extends BaseDO {
    id: string;
    hotelId: string;
    versionId: number;
    groupBookingReference: string;
    status: GroupBookingStatus;
    inputChannel: GroupBookingInputChannel;
    noOfRooms: number;

    // the aggregation transforms the array into an object and keeps the initial name of the field
    bookingList: BookingDO;

    protected getPrimitivePropertyKeys(): string[] {
        return ["id", "hotelId", "versionId", "groupBookingReference", "status", "inputChannel", "noOfRooms"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.bookingList = new BookingDO();
        this.bookingList.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "bookingList"));
        this.bookingList.groupBookingId = this.id;
        this.bookingList.groupBookingReference = this.groupBookingReference;
        this.bookingList.hotelId = this.hotelId;
        this.bookingList.versionId = this.versionId;
        this.bookingList.status = this.status;
        this.bookingList.inputChannel = this.inputChannel;
        this.bookingList.noOfRooms = this.noOfRooms;
    }
}