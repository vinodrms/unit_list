import { BaseDO } from '../../common/base/BaseDO';
import { ThUtils } from '../../../utils/ThUtils';
import { ThDateIntervalDO } from '../../../utils/th-dates/data-objects/ThDateIntervalDO';
import { ThDateDO } from '../../../utils/th-dates/data-objects/ThDateDO';
import { ConfigCapacityDO } from '../../common/data-objects/bed-config/ConfigCapacityDO';
import { PriceProductDO } from '../../price-products/data-objects/PriceProductDO';
import { FileAttachmentDO } from '../../common/data-objects/file/FileAttachmentDO';
import { BookingStateChangeTriggerTimeDO } from './state-change-time/BookingStateChangeTriggerTimeDO';
import { DefaultBillingDetailsDO } from './default-billing/DefaultBillingDetailsDO';
import { DocumentHistoryDO } from '../../common/data-objects/document-history/DocumentHistoryDO';
import { BookingPriceDO } from './price/BookingPriceDO';
import { IInvoiceItemMeta } from '../../invoices/data-objects/items/IInvoiceItemMeta';

import _ = require('underscore');

export enum BookingStatus {
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

var BookingConfirmationStatusDisplayString: { [index: number]: string; } = {};
BookingConfirmationStatusDisplayString[BookingConfirmationStatus.Confirmed] = "Confirmed";
BookingConfirmationStatusDisplayString[BookingConfirmationStatus.Guaranteed] = "Guaranteed";
BookingConfirmationStatusDisplayString[BookingConfirmationStatus.NoShow] = "No Show";
BookingConfirmationStatusDisplayString[BookingConfirmationStatus.NoShowWithPenalty] = "No Show With Penalty";
BookingConfirmationStatusDisplayString[BookingConfirmationStatus.Cancelled] = "Cancelled";
BookingConfirmationStatusDisplayString[BookingConfirmationStatus.CheckedIn] = "CheckedIn";
BookingConfirmationStatusDisplayString[BookingConfirmationStatus.CheckedOut] = "CheckedOut";

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
    status: BookingStatus;
    inputChannel: GroupBookingInputChannel;
    noOfRooms: number;

    // individual booking
    id: string;

    //TODO: remove after migrating the new bookings' repo
    legacyBookingId: string;

    bookingReference: string;
    externalBookingReference: string;
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
    invoiceNotes: string;
    fileAttachmentList: FileAttachmentDO[];
    bookingHistory: DocumentHistoryDO;
    indexedSearchTerms: string[];

    protected getPrimitivePropertyKeys(): string[] {
        return ["groupBookingId", "groupBookingReference", "hotelId", "versionId", "status", "inputChannel", "noOfRooms", "id", "legacyBookingId", "bookingReference", "externalBookingReference", "confirmationStatus",
            "customerIdList", "displayCustomerId", "startUtcTimestamp", "endUtcTimestamp", "roomCategoryId", "roomId", "priceProductId",
            "reservedAddOnProductIdList", "allotmentId", "notes", "invoiceNotes", "indexedSearchTerms"];
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

    public getBookingConfirmationStatusDisplayString(): string {
        return BookingConfirmationStatusDisplayString[this.confirmationStatus];
    }

    public getIndexedCustomerNames(): string[] {
        var custNames: string[] = [];
        if (_.isArray(this.indexedSearchTerms)) {
            for (var i = 2; i < this.indexedSearchTerms.length; i++) {
                custNames.push(this.indexedSearchTerms[i]);
            }
        }
        return custNames;
    }

    public get displayedReservationNumber(): string {
        if (this.noOfRooms <= 1) {
            return this.groupBookingReference;
        } else {
            return this.groupBookingReference + '/' + this.bookingReference;
        }
    }
}