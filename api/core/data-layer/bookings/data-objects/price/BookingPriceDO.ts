import { BaseDO } from '../../../common/base/BaseDO';
import { ThTranslation } from '../../../../utils/localization/ThTranslation';
import { IInvoiceItemMeta } from '../../../invoices/data-objects/items/IInvoiceItemMeta';
import { InvoiceItemDO, InvoiceItemAccountingType } from '../../../invoices/data-objects/items/InvoiceItemDO';
import { ThUtils } from '../../../../utils/ThUtils';
import { PricePerDayDO } from './PricePerDayDO';
import { CommissionDO } from "../../../common/data-objects/commission/CommissionDO";

import _ = require('underscore');

export enum BookingPriceType {
    BookingStay,
    Penalty
}

export class BookingPriceDO extends BaseDO implements IInvoiceItemMeta {
    priceType: BookingPriceType;

    roomPricePerNightAvg: number;
    public getInvoicedRoomPricePerNightAvg(accountingType: InvoiceItemAccountingType): number {
        return (accountingType === InvoiceItemAccountingType.Credit)? this.roomPricePerNightAvg * -1 : this.roomPricePerNightAvg;
    }

    roomPricePerNightList: PricePerDayDO[];
    public getInvoicedRoomPricePerNightList(accountingType: InvoiceItemAccountingType): PricePerDayDO[] {
        let invoicedRoomPricePerNightList = [];

        _.forEach(this.roomPricePerNightList, (pricePerDay: PricePerDayDO) => {
            let invoicedPricePerDay = new PricePerDayDO();
            invoicedPricePerDay.buildFromObject(pricePerDay);
            invoicedPricePerDay.price = (accountingType === InvoiceItemAccountingType.Credit)? invoicedPricePerDay.price * -1: invoicedPricePerDay.price;

            invoicedRoomPricePerNightList.push(invoicedPricePerDay)
        });  

        return invoicedRoomPricePerNightList;
    }
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
    public isDerivedFromBooking(): boolean {
        return false;
    }
}