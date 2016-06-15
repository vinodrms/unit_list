import {BaseDO} from '../../common/base/BaseDO';
import {ThDateIntervalDO} from '../../../utils/th-dates/data-objects/ThDateIntervalDO';
import {ConfigCapacityDO} from '../../common/data-objects/bed-config/ConfigCapacityDO';
import {PriceProductDO} from '../../price-products/data-objects/PriceProductDO';
import {FileAttachmentDO} from '../../common/data-objects/file/FileAttachmentDO';
import {BookingCancellationTimeDO} from './cancellation-time/BookingCancellationTimeDO';
import {DefaultBillingDetailsDO} from './default-billing/DefaultBillingDetailsDO';
import {DocumentHistoryDO} from '../../common/data-objects/document-history/DocumentHistoryDO';

export enum GroupBookingStatus {
    Active,
    Deleted
}
export enum BookingConfirmationStatus {
    Confirmed,
    Guaranteed,
    NoShow,
    Cancelled,
    CheckedIn,
    CheckedOut
}
export enum GroupBookingInputChannel {
    PropertyManagementSystem
}

export class BookingDO extends BaseDO {
    // booking group
    groupBookingId: string;
    groupBookingReference: string;
    hotelId: string;
    versionId: number;
    status: GroupBookingStatus;
    inputChannel: GroupBookingInputChannel;
    noOfRooms: number;

    // individual booking
    bookingId: string;
    bookingReference: string;
    confirmationStatus: BookingConfirmationStatus;
    customerIdList: string[];
    defaultBillingDetails: DefaultBillingDetailsDO;
    interval: ThDateIntervalDO;
    startUtcTimestamp: number;
    endUtcTimestamp: number;
    configCapacity: ConfigCapacityDO;
    roomCategoryId: string;
    roomId: string;
    priceProductId: string;
    priceProductSnapshot: PriceProductDO;
    allotmentId: string;
    cancellationTime: BookingCancellationTimeDO;
    notes: string;
    fileAttachmentList: FileAttachmentDO[];
    bookingHistory: DocumentHistoryDO;

    protected getPrimitivePropertyKeys(): string[] {
        return ["groupBookingId", "groupBookingReference", "hotelId", "versionId", "status", "inputChannel", "noOfRooms", "bookingId", "bookingReference", "confirmationStatus",
            "customerIdList", "startUtcTimestamp", "endUtcTimestamp", "roomCategoryId", "roomId", "priceProductId", "allotmentId", "notes"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.defaultBillingDetails = new DefaultBillingDetailsDO();
        this.defaultBillingDetails.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "defaultBillingDetails"));

        this.interval = new ThDateIntervalDO();
        this.interval.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "interval"));

        this.configCapacity = new ConfigCapacityDO();
        this.configCapacity.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "configCapacity"));

        this.priceProductSnapshot = new PriceProductDO();
        this.priceProductSnapshot.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "priceProductSnapshot"));

        this.cancellationTime = new BookingCancellationTimeDO();
        this.cancellationTime.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "cancellationTime"));

        this.fileAttachmentList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "fileAttachmentList"), (fileAttachmentObject: Object) => {
            var fileAttachmentDO = new FileAttachmentDO();
            fileAttachmentDO.buildFromObject(fileAttachmentObject);
            this.fileAttachmentList.push(fileAttachmentDO);
        });

        this.bookingHistory = new DocumentHistoryDO();
        this.bookingHistory.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "bookingHistory"));
    }
}