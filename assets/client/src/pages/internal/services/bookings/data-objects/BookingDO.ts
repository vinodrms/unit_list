import * as _ from "underscore";
import { BaseDO } from '../../../../../common/base/BaseDO';
import { ThUtils } from '../../../../../common/utils/ThUtils';
import { ThDateIntervalDO } from '../../common/data-objects/th-dates/ThDateIntervalDO';
import { ConfigCapacityDO } from '../../common/data-objects/bed-config/ConfigCapacityDO';
import { PriceProductDO } from '../../price-products/data-objects/PriceProductDO';
import { FileAttachmentDO } from '../../common/data-objects/file/FileAttachmentDO';
import { BookingStateChangeTriggerTimeDO } from './state-change-time/BookingStateChangeTriggerTimeDO';
import { DefaultBillingDetailsDO } from './default-billing/DefaultBillingDetailsDO';
import { DocumentHistoryDO } from '../../common/data-objects/document-history/DocumentHistoryDO';
import { BookingPriceDO } from './price/BookingPriceDO';
import { ThDateDO } from "../../common/data-objects/th-dates/ThDateDO";
import { IInvoiceItemMeta } from "../../invoices/data-objects/items/IInvoiceItemMeta";
import { AddOnProductSnapshotDO } from "../../add-on-products/data-objects/AddOnProductSnapshotDO";

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

export enum TravelActivityType {
    Business,
    Leisure
}

export enum TravelType {
    Individual,
    Group
}

export class TravelActivityTypeOption {
    type: TravelActivityType;
    displayName: string;

    constructor(type: TravelActivityType, displayName: string) {
        this.type = type;
        this.displayName = displayName;
    }

    public static getValues(): TravelActivityTypeOption[] {
        return [
            new TravelActivityTypeOption(TravelActivityType.Business, "Business"),
            new TravelActivityTypeOption(TravelActivityType.Leisure, "Leisure"),
        ];
    }
}

class TravelTypeDisplayedNameContainer {
    private static _TravelTypeDisplayedNames: { [type: number]: string } = {
        [TravelType.Individual]: "Individual",
        [TravelType.Group]: "Group",
    };

    public static getDisplayedName(travelType: TravelType) {
        return this._TravelTypeDisplayedNames[travelType];
    }
}

export class AddOnProductBookingReservedItem extends BaseDO {
    aopSnapshot: AddOnProductSnapshotDO;
    noOfItems: number;

    protected getPrimitivePropertyKeys(): string[] {
        return ["noOfItems"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);
        this.aopSnapshot = new AddOnProductSnapshotDO();
        this.aopSnapshot.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "aopSnapshot"));

    }
}

export class BookingDO extends BaseDO {
    // booking group
    groupBookingId: string;
    groupBookingReference: string;
    versionId: number;
    status: BookingStatus;
    inputChannel: GroupBookingInputChannel;
    noOfRooms: number;

    // individual booking
    id: string;
    bookingReference: string;
    externalBookingReference: string;
    confirmationStatus: BookingConfirmationStatus;
    customerIdList: string[];
    displayCustomerId: string;
    defaultBillingDetails: DefaultBillingDetailsDO;
    interval: ThDateIntervalDO;
    creationDate: ThDateDO;
    creationDateUtcTimestamp: number;
    startUtcTimestamp: number;
    endUtcTimestamp: number;
    checkInUtcTimestamp: number;
    checkOutUtcTimestamp: number;
    configCapacity: ConfigCapacityDO;
    roomCategoryId: string;
    roomId: string;
    priceProductId: string;
    priceProductSnapshot: PriceProductDO;
    reservedAddOnProductList: AddOnProductBookingReservedItem[];
    price: BookingPriceDO;
    allotmentId: string;
    guaranteedTime: BookingStateChangeTriggerTimeDO;
    noShowTime: BookingStateChangeTriggerTimeDO;
    notes: string;
    invoiceNotes: string;
    fileAttachmentList: FileAttachmentDO[];
    bookingHistory: DocumentHistoryDO;
    indexedSearchTerms: string[];
    travelActivityType: TravelActivityType;
    travelType: TravelType;
    // whether all the bookings from the group this booking belongs to will be posted on the same invoice
    mergeInvoice: boolean;
    confirmationNotes: string;

    protected getPrimitivePropertyKeys(): string[] {
        return ["groupBookingId", "groupBookingReference", "versionId", "status", "inputChannel", "noOfRooms", "id", "bookingReference", "externalBookingReference", "confirmationStatus",
            "customerIdList", "displayCustomerId", "corporateDisplayCustomerId", "creationDateUtcTimestamp", "startUtcTimestamp", "endUtcTimestamp", "checkInUtcTimestamp", "checkOutUtcTimestamp", "roomCategoryId", "roomId", "priceProductId",
            "allotmentId", "notes", "invoiceNotes", "indexedSearchTerms", "travelActivityType", "travelType", "mergeInvoice", "confirmationNotes"];
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

        this.reservedAddOnProductList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "reservedAddOnProductList"), (reservedAddOnProductObject: Object) => {
            var addOnProductBookingReservedItem = new AddOnProductBookingReservedItem();
            addOnProductBookingReservedItem.buildFromObject(reservedAddOnProductObject);
            this.reservedAddOnProductList.push(addOnProductBookingReservedItem);
        });
    }

    public isMadeThroughAllotment(): boolean {
        var thUtils = new ThUtils();
        return !thUtils.isUndefinedOrNull(this.allotmentId) && this.allotmentId.length > 0;
    }

    public getInvoiceItemMeta(): IInvoiceItemMeta {
        return this.price;
    }

    public get displayedReservationNumber(): string {
        if (this.noOfRooms <= 1) {
            return this.groupBookingReference;
        } else {
            return this.groupBookingReference + '/' + this.bookingReference;
        }
    }

    public get travelActivityTypeDisplayedName(): string {
        var option = _.find(TravelActivityTypeOption.getValues(), (option: TravelActivityTypeOption) => {
            return option.type == this.travelActivityType;
        });
        return option.displayName;
    }

    public get travelTypeDisplayedName(): string {
        return TravelTypeDisplayedNameContainer.getDisplayedName(this.travelType);
    }

    public get reservedAddOnProductIdList(): string[] {
        return _.map(this.reservedAddOnProductList, (item: AddOnProductBookingReservedItem) => {
            return item.aopSnapshot.id;
        });
    }
}
