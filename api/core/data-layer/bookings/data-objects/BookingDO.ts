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

export class BookingDO extends BaseDO {
    // booking group
    groupBookingId: string;
    groupBookingReference: string;
    hotelId: string;
    versionId: number;
    status: GroupBookingStatus;

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
        // TODO
        return [];
    }
}