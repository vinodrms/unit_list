import {BaseDO} from '../../common/base/BaseDO';
import {ThUtils} from '../../../utils/ThUtils';
import {ThDateIntervalDO} from '../../../utils/th-dates/data-objects/ThDateIntervalDO';
import {ThDateDO} from '../../../utils/th-dates/data-objects/ThDateDO';
import {ConfigCapacityDO} from '../../common/data-objects/bed-config/ConfigCapacityDO';
import {PriceProductDO} from '../../price-products/data-objects/PriceProductDO';
import {FileAttachmentDO} from '../../common/data-objects/file/FileAttachmentDO';
import {BookingStateChangeTriggerTimeDO} from './state-change-time/BookingStateChangeTriggerTimeDO';
import {DefaultBillingDetailsDO} from './default-billing/DefaultBillingDetailsDO';
import {DocumentHistoryDO} from '../../common/data-objects/document-history/DocumentHistoryDO';
import {BookingPriceDO} from './price/BookingPriceDO';
import {IInvoiceItemMeta} from '../../invoices/data-objects/items/IInvoiceItemMeta';

export enum GroupBookingStatus {
    Active,
    Deleted
}
export enum BookingConfirmationStatus {
    Confirmed,
    Guaranteed,
    NoShow,
    NoShowWithPenalty,
    Cancelled,
    CheckedIn,
    CheckedOut
}
export enum GroupBookingInputChannel {
    PropertyManagementSystem
}

export class BookingDO extends BaseDO {
    public static GuaranteedTriggerName: string = "guaranteedTime";
    public static NoShowTriggerName: string = "noShowTime";
    public static StartUtcTimestampName: string = "startUtcTimestamp";
    public static EndUtcTimestampName: string = "endUtcTimestamp";

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
    displayCustomerId: string;
    defaultBillingDetails: DefaultBillingDetailsDO;
    interval: ThDateIntervalDO;
    creationDate: ThDateDO;
    startUtcTimestamp: number;
    endUtcTimestamp: number;
    configCapacity: ConfigCapacityDO;
    roomCategoryId: string;
    roomId: string;
    priceProductId: string;
    priceProductSnapshot: PriceProductDO;
    reservedAddOnProductIdList: string[];
    price: BookingPriceDO;
    allotmentId: string;
    guaranteedTime: BookingStateChangeTriggerTimeDO;
    noShowTime: BookingStateChangeTriggerTimeDO;
    notes: string;
    fileAttachmentList: FileAttachmentDO[];
    bookingHistory: DocumentHistoryDO;
    indexedSearchTerms: string[];

    protected getPrimitivePropertyKeys(): string[] {
        return ["groupBookingId", "groupBookingReference", "hotelId", "versionId", "status", "inputChannel", "noOfRooms", "bookingId", "bookingReference", "confirmationStatus",
            "customerIdList", "displayCustomerId", "startUtcTimestamp", "endUtcTimestamp", "roomCategoryId", "roomId", "priceProductId", 
            "reservedAddOnProductIdList", "allotmentId", "notes", "indexedSearchTerms"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.defaultBillingDetails = new DefaultBillingDetailsDO();
        this.defaultBillingDetails.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "defaultBillingDetails"));

        this.interval = new ThDateIntervalDO();
        this.interval.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "interval"));

        this.creationDate = new ThDateDO();
        this.creationDate.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "creationDate"));

        this.configCapacity = new ConfigCapacityDO();
        this.configCapacity.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "configCapacity"));

        this.price = new BookingPriceDO();
        this.price.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "price"));

        this.priceProductSnapshot = new PriceProductDO();
        this.priceProductSnapshot.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "priceProductSnapshot"));

        this.guaranteedTime = new BookingStateChangeTriggerTimeDO();
        this.guaranteedTime.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "guaranteedTime"));

        this.noShowTime = new BookingStateChangeTriggerTimeDO();
        this.noShowTime.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "noShowTime"));

        this.fileAttachmentList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "fileAttachmentList"), (fileAttachmentObject: Object) => {
            var fileAttachmentDO = new FileAttachmentDO();
            fileAttachmentDO.buildFromObject(fileAttachmentObject);
            this.fileAttachmentList.push(fileAttachmentDO);
        });

        this.bookingHistory = new DocumentHistoryDO();
        this.bookingHistory.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "bookingHistory"));
    }

    public isMadeThroughAllotment(): boolean {
        var thUtils = new ThUtils();
        return !thUtils.isUndefinedOrNull(this.allotmentId) && this.allotmentId.length > 0;
    }

    public getInvoiceItemMeta(): IInvoiceItemMeta {
        return this.price;
    }
}