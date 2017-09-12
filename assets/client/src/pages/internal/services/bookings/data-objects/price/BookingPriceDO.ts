import * as _ from "underscore";
import { BaseDO } from '../../../../../../common/base/BaseDO';
import { ThUtils } from '../../../../../../common/utils/ThUtils';
import { ThTranslation } from '../../../../../../common/utils/localization/ThTranslation';
import { PricePerDayDO } from './PricePerDayDO';
import { CommissionDO } from "../../../common/data-objects/commission/CommissionDO";
import { InvoiceItemDO } from "../../../invoices/data-objects/items/InvoiceItemDO";
import { IInvoiceItemMeta } from "../../../invoices/data-objects/items/IInvoiceItemMeta";

export enum BookingPriceType {
    BookingStay,
    Penalty
}

export class BookingPriceDO extends BaseDO implements IInvoiceItemMeta {
    priceType: BookingPriceType;

    roomPricePerNightAvg: number;

    roomPricePerNightList: PricePerDayDO[];
    numberOfNights: number;
    totalRoomPrice: number;
    totalOtherPrice: number;

    // the commission always appears as a separate item on the invoice
    deductedCommissionPrice: number;
    commissionSnapshot: CommissionDO;

    // The total booking price represents: ` room price - commission + other price `
    totalBookingPrice: number;
    vatId: string;

    description: string;
    breakfast: InvoiceItemDO;
    includedInvoiceItemList: InvoiceItemDO[];

    protected getPrimitivePropertyKeys(): string[] {
        return ["priceType", "roomPricePerNightAvg", "numberOfNights", "totalRoomPrice", "totalOtherPrice", "appliedDiscountValue", "deductedCommissionPrice", "totalBookingPrice", "vatId", "description"];
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

        this.roomPricePerNightList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "roomPricePerNightList"), (roomPricePerNightObject: Object) => {
            var pricePerDay = new PricePerDayDO();
            pricePerDay.buildFromObject(roomPricePerNightObject);
            this.roomPricePerNightList.push(pricePerDay);
        });

        this.commissionSnapshot = new CommissionDO();
        this.commissionSnapshot.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "commissionSnapshot"));
    }

    public get totalBookingPriceWithoutDeductedCommission(): number {
        return this.totalRoomPrice + this.totalOtherPrice;
    }

    public hasDeductedCommission(): boolean {
        return _.isNumber(this.deductedCommissionPrice) && this.deductedCommissionPrice > 0;
    }

    public getUnitPrice(): number {
        return this.roomPricePerNightAvg;
    }
    public getNumberOfItems(): number {
        return this.numberOfNights;
    }
    public getTotalPrice(): number {
        if (this.priceType === BookingPriceType.Penalty) {
            return this.roomPricePerNightAvg;
        }
        return _.reduce(this.roomPricePerNightList, function (sum, pricePerDay: PricePerDayDO) { return sum + pricePerDay.price; }, 0);
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

    public hasBreakfast(): boolean {
        var thUtils = new ThUtils();
        return !thUtils.isUndefinedOrNull(this.breakfast) && !thUtils.isUndefinedOrNull(this.breakfast.id);
    }

    public hasDiscount(): boolean {
        return _.reduce(this.roomPricePerNightList, function (sum, pricePerDay: PricePerDayDO) { return sum + pricePerDay.discount; }, 0) > 0.0;
    }
    public isMovableByDefault(): boolean {
        return false;
    }
    public isDerivedFromBooking(): boolean {
        return false;
    }
}
