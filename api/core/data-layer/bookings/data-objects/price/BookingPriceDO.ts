import { BaseDO } from '../../../common/base/BaseDO';
import { ThTranslation } from '../../../../utils/localization/ThTranslation';
import { IInvoiceItemMeta } from '../../../invoices/data-objects/items/IInvoiceItemMeta';
import { InvoiceItemDO } from '../../../invoices/data-objects/items/InvoiceItemDO';
import { ThUtils } from '../../../../utils/ThUtils';

import _ = require('underscore');

export enum BookingPriceType {
    BookingStay,
    Penalty
}

export class BookingPriceDO extends BaseDO implements IInvoiceItemMeta {
    movable: boolean;

    priceType: BookingPriceType;

    roomPricePerNight: number;
    numberOfNights: number;
    totalRoomPrice: number;
    totalOtherPrice: number;

    totalBookingPrice: number;

    vatId: string;

    description: string;
    breakfast: InvoiceItemDO;
    includedInvoiceItemList: InvoiceItemDO[];

    protected getPrimitivePropertyKeys(): string[] {
        return ["movable", "priceType", "roomPricePerNight", "numberOfNights", "totalRoomPrice", "totalOtherPrice", "totalBookingPrice", "vatId", "description"];
    }
    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.breakfast = new InvoiceItemDO();
        this.breakfast.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "breakfast"));

        this.includedInvoiceItemList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "includedInvoiceItemList"), (includedInvoiceItemObject: Object) => {
            var invoiceItem = new InvoiceItemDO();
            invoiceItem.buildFromObject(includedInvoiceItemObject);
            this.includedInvoiceItemList.push(invoiceItem);
        });
    }

    public getUnitPrice(): number {
        return this.roomPricePerNight;
    }
    public getNumberOfItems(): number {
        return this.numberOfNights;
    }
    public getDisplayName(thTranslation: ThTranslation): string {
        return thTranslation.translate(this.getDisplayNameCore(thTranslation));
    }
    private getDisplayNameCore(thTranslation: ThTranslation): string {
        switch (this.priceType) {
            case BookingPriceType.BookingStay:
                return this.getDisplayNameWithBreakfast(thTranslation);
            default:
                return thTranslation.translate("Cancellation Penalty");
        }
    }
    private getDisplayNameWithBreakfast(thTranslation: ThTranslation): string {
        if (!this.hasBreakfast()) {
            return this.getDisplayNameDescription(thTranslation);
        }
        return thTranslation.translate("%description% (includes %breakfastName%)", {
            description: this.getDisplayNameDescription(thTranslation),
            breakfastName: this.breakfast.meta.getDisplayName(thTranslation)
        });
    }
    private getDisplayNameDescription(thTranslation: ThTranslation): string {
        if (_.isString(this.description) && this.description.length > 0) {
            return this.description;
        }
        return thTranslation.translate("Booking");
    }

    public getVatId(): string {
        return this.vatId;
    }

    public isPenalty(): boolean {
        return this.priceType === BookingPriceType.Penalty;
    }

    public hasBreakfast() {
        var thUtils = new ThUtils();
        return !thUtils.isUndefinedOrNull(this.breakfast) && !thUtils.isUndefinedOrNull(this.breakfast.id);
    }

    public getRoomPrice(): number {
        if (this.isPenalty()) {
            return this.totalBookingPrice;
        }
        var roomPrice = this.totalRoomPrice;
        if (this.hasBreakfast()) {
            roomPrice = roomPrice - (this.numberOfNights * this.breakfast.meta.getUnitPrice());
        }
        if (roomPrice < 0) { roomPrice = 0; }
        return roomPrice;
    }
    public getOtherPrice(): number {
        if (this.isPenalty()) {
            return 0.0;
        }
        var otherPrice = this.totalOtherPrice;
        if (this.hasBreakfast()) {
            otherPrice = otherPrice + (this.numberOfNights * this.breakfast.meta.getUnitPrice());
        }
        return otherPrice;
    }
    public setMovable(movable: boolean) {
        this.movable = movable;
    }
    public isMovable(): boolean {
        var thUtils = new ThUtils();
        if (thUtils.isUndefinedOrNull(this.movable)) {
            return true;
        }
        return this.movable;
    }
}