import {ThTranslation} from '../../../utils/localization/ThTranslation';
import {CustomerDO} from '../../../data-layer/customers/data-objects/CustomerDO';
import {PriceProductDO} from '../../../data-layer/price-products/data-objects/PriceProductDO';
import {IndexedBookingInterval} from '../../../data-layer/price-products/utils/IndexedBookingInterval';
import {ISOWeekDay, ISOWeekDayVM, ISOWeekDayUtils} from '../../../utils/th-dates/data-objects/ISOWeekDay';
import {ThMonth} from '../../../utils/th-dates/data-objects/ThDateDO';
import {TaxDO, TaxValueType} from '../../../data-layer/taxes/data-objects/TaxDO';
import {ThUtils} from '../../../utils/ThUtils';
import {BedDO} from '../../../data-layer/common/data-objects/bed/BedDO';
import {AddOnProductDO} from '../../../data-layer/add-on-products/data-objects/AddOnProductDO';
import {AddOnProductCategoryDO, AddOnProductCategoryType} from '../../../data-layer/common/data-objects/add-on-product/AddOnProductCategoryDO';
import {BookingAggregatedData} from '../aggregators/BookingAggregatedData';
import {InvoiceItemDO} from '../../../data-layer/invoices/data-objects/items/InvoiceItemDO';
import {HotelDO} from '../../../data-layer/hotel/data-objects/HotelDO';

import _ = require('underscore');

export class BookingConfirmationVM {
    private _isoWeekDayUtils: ISOWeekDayUtils;
    private _thUtils: ThUtils;
    private _bookingAggregatedData: BookingAggregatedData;
    private _hotel: HotelDO;

    private _notAvailableTranslatedLabel: string;

    bookingReference: string;
    groupBookingReference: string;

    checkInDay: number;
    checkInSOWeekDay: string;
    checkInMonth: string;
    checkInHourDetails: string;

    checkOutDay: number;
    checkOutISOWeekDay: string;
    checkOutMonth: string;
    checkOutHourDetails: string;

    totalPrice: number;
    ccyCode: string;
    includedTaxes: string;
    lengthOfStay: number;

    roomCategoryName: string;
    bookedCapacity: string;
    bedSizes: string;

    breakfastAop: string;
    otherAops: string;
    reservedAops: string;
    reservedAopsDescription: string;

    guests: string;

    constraints: string;
    cancellationPolicyAndPenalty: string;

    constructor(private _thTranslation: ThTranslation) {
        this._thUtils = new ThUtils();
        this._isoWeekDayUtils = new ISOWeekDayUtils();

        this._notAvailableTranslatedLabel = this._thTranslation.translate('none');
    }

    public buildFromBookingAggregatedData(bookingAggregatedData: BookingAggregatedData, hotel: HotelDO) {
        this._bookingAggregatedData = bookingAggregatedData;
        this._hotel = hotel;
        this.initBookingReferences();
        this.initCheckInAndCheckOutDates();
        this.initPricingDetails();
        this.initBookedRoomDetails();
        this.initAddOnProducts();
        this.initGuests();
        this.initConstraintsDisplayText();
        this.initCancellationPolicy();
    }

    private initBookingReferences() {
        this.bookingReference = this._bookingAggregatedData.booking.bookingReference;
        this.groupBookingReference = this._bookingAggregatedData.booking.groupBookingReference;
    }
    private initCheckInAndCheckOutDates() {
        var checkInThDate = this._bookingAggregatedData.booking.interval.start;
        this.checkInDay = checkInThDate.day;
        this.checkInSOWeekDay = _.find(this._isoWeekDayUtils.getISOWeekDayVMList(), (isoWeekDayVM: ISOWeekDayVM) => {
            return isoWeekDayVM.iSOWeekDay === checkInThDate.getISOWeekDay();
        }).name;
        this.checkInMonth = ThMonth[checkInThDate.month];
        this.checkInHourDetails = this._thTranslation.translate("Check In from %checkInHour%", { checkInHour: this._hotel.operationHours.checkInFrom.toString() });

        var checkOutThDate = this._bookingAggregatedData.booking.interval.end;
        this.checkOutDay = checkOutThDate.day;
        this.checkOutISOWeekDay = _.find(this._isoWeekDayUtils.getISOWeekDayVMList(), (isoWeekDayVM: ISOWeekDayVM) => {
            return isoWeekDayVM.iSOWeekDay === checkOutThDate.getISOWeekDay();
        }).name;
        this.checkOutMonth = ThMonth[checkOutThDate.month];
        this.checkOutHourDetails = this._thTranslation.translate("Check Out until %checkOutHour%", { checkOutHour: this._hotel.operationHours.checkOutTo.toString() });
    }
    private initPricingDetails() {
        this.ccyCode = this._bookingAggregatedData.ccyCode;
        var indexedBookingInterval = new IndexedBookingInterval(this._bookingAggregatedData.booking.interval);

        this.lengthOfStay = indexedBookingInterval.getLengthOfStay();
        this.totalPrice = this._bookingAggregatedData.booking.price.totalBookingPrice;
        this.totalPrice = Math.round(this.totalPrice);
        this.initIncludedTaxesString(this._bookingAggregatedData.vatList, this._bookingAggregatedData.otherTaxes);
    }
    private initIncludedTaxesString(vatList: TaxDO[], otherTaxes: TaxDO[]) {
        if (!_.isEmpty(vatList) || !_.isEmpty(otherTaxes)) {
            this.includedTaxes = '*' + this._thTranslation.translate('the price includes') + ': ';
        }
        if (!_.isEmpty(vatList)) {
            this.includedTaxes += vatList[0].value * 100 + '% ' + this._thTranslation.translate('VAT') + '; ';
        }
        if (!_.isEmpty(otherTaxes)) {
            _.forEach(otherTaxes, (otherTax: TaxDO) => {
                if (otherTax.valueType === TaxValueType.Fixed) {
                    this.includedTaxes += this.ccyCode + ' ' + otherTax.value + ' ' + otherTax.name + '; ';
                }
                else if (otherTax.valueType === TaxValueType.Percentage) {
                    this.includedTaxes += otherTax.value * 100 + '% ' + otherTax.name + '; ';
                }
            })
        }
    }
    private initBookedRoomDetails() {
        this.roomCategoryName = this._bookingAggregatedData.roomCategoryStats.roomCategory.displayName;
        this.bookedCapacity = this._thTranslation.translate("%noAdults% adults, %noChildren% children, %noBabies% babies", {
            noAdults: this._bookingAggregatedData.booking.configCapacity.noAdults,
            noChildren: this._bookingAggregatedData.booking.configCapacity.noChildren,
            noBabies: this._bookingAggregatedData.booking.configCapacity.noBabies
        }) + '.';
        this.initBedSizesDisplayText();
    }
    private initBedSizesDisplayText() {
        this.bedSizes = '';

        _.forEach(this._bookingAggregatedData.bedList, (bed: BedDO) => {
            this.bedSizes += bed.name + ' ' + bed.size.lengthCm + 'x' + bed.size.widthCm + ' '
                + this._thTranslation.translate('cm (wide)') + '; ';
        })
    }
    private initAddOnProducts() {
        this.initBreakfastDisplayText();
        this.initOthersAopsDisplayText();
        this.initReservedAopsDisplayText();
    }
    private initBreakfastDisplayText() {
        this.breakfastAop = '';
        var bookingPrice = this._bookingAggregatedData.booking.price;
        if (bookingPrice.hasBreakfast()) {
            this.breakfastAop += bookingPrice.breakfast.meta.getDisplayName(this._thTranslation) + " (" + this._thTranslation.translate("Included in Room Price") + ")";
            return;
        }
        this.breakfastAop += this._notAvailableTranslatedLabel;
    }
    private initOthersAopsDisplayText() {
        this.otherAops = '';

        var bookingPrice = this._bookingAggregatedData.booking.price;
        _.forEach(bookingPrice.includedInvoiceItemList, (invoiceItem: InvoiceItemDO) => {
            var itemDisplayString = invoiceItem.meta.getNumberOfItems() + "x" + invoiceItem.meta.getDisplayName(this._thTranslation);
            var aopPrice = invoiceItem.meta.getNumberOfItems() * invoiceItem.meta.getUnitPrice();
            aopPrice = this._thUtils.roundNumberToTwoDecimals(aopPrice);
            itemDisplayString += " (" + this.ccyCode + aopPrice + "); ";
            this.otherAops += itemDisplayString;
        });

        if (this.otherAops.length == 0) {
            this.otherAops = this._notAvailableTranslatedLabel;
        }
    }
    private initReservedAopsDisplayText() {
        var reservedAddOnProductIdList: string[] = this._bookingAggregatedData.booking.reservedAddOnProductIdList;
        if (this._thUtils.isUndefinedOrNull(reservedAddOnProductIdList) || !_.isArray(reservedAddOnProductIdList)) {
            this.reservedAops = this._notAvailableTranslatedLabel;
            this.reservedAopsDescription = '';
        }
        this.reservedAops = '';
        var reservedAopMap: { [id: string]: number; } = _.countBy(reservedAddOnProductIdList, (aopId: string) => { return aopId });
        var aopIdList: string[] = Object.keys(reservedAopMap);
        _.forEach(aopIdList, (aopId: string) => {
            var addOnProduct: AddOnProductDO = _.find(this._bookingAggregatedData.addOnProductList, (aop: AddOnProductDO) => {
                return aop.id === aopId;
            });
            if (!this._thUtils.isUndefinedOrNull(addOnProduct)) {
                var noReserved = reservedAopMap[aopId];
                var totalPrice = Math.round(noReserved * addOnProduct.price);
                if (this.reservedAops.length > 0) { this.reservedAops += '; '; }
                this.reservedAops += noReserved + " x " + addOnProduct.name + ' (' + this.ccyCode + ' ' + totalPrice + ')';
            }
        });
        if (this.reservedAops.length == 0) {
            this.reservedAops = "None reserved. Please contact the property for details.";
            this.reservedAopsDescription = '';
        }
        else {
            this.reservedAopsDescription = this._thTranslation.translate("* Not included in the reservation's price");
        }
    }

    private getBreakfastAOPCategoryId(): string {
        return _.find(this._bookingAggregatedData.addOnProductCategoyList, (aopCategory: AddOnProductCategoryDO) => {
            return aopCategory.type === AddOnProductCategoryType.Breakfast;
        }).id;
    }
    private getOthersAOPCategoryId(): string {
        return _.find(this._bookingAggregatedData.addOnProductCategoyList, (aopCategory: AddOnProductCategoryDO) => {
            return aopCategory.type === AddOnProductCategoryType.AddOnProduct;
        }).id;
    }
    private initGuests() {
        this.guests = '';
        _.forEach(this._bookingAggregatedData.customerList, (customer: CustomerDO) => {
            this.guests += customer.customerDetails.getName() + '; ';
        });
    }
    private initConstraintsDisplayText() {
        this.constraints = '';
        var constraintStringList = this._bookingAggregatedData.booking.priceProductSnapshot.constraints.getValueDisplayStringList(this._thTranslation);

        if (this._thUtils.isUndefinedOrNull(constraintStringList) || _.isEmpty(constraintStringList)) {
            this.constraints = this._notAvailableTranslatedLabel;
        }
        else {
            _.forEach(constraintStringList, (constraintStr: string) => {
                this.constraints += constraintStr + '; ';
            });
        }
    }
    private initCancellationPolicy() {
        this.cancellationPolicyAndPenalty = this._bookingAggregatedData.booking.priceProductSnapshot.conditions.getValueDisplayString(this._thTranslation);
    }
}