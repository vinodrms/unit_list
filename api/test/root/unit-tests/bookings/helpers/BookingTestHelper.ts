import {DefaultDataBuilder} from '../../../../db-initializers/DefaultDataBuilder';
import {TestContext} from '../../../../helpers/TestContext';
import {PriceProductDO, PriceProductStatus} from '../../../../../core/data-layer/price-products/data-objects/PriceProductDO';
import {PriceProductIncludedItemsDO} from '../../../../../core/data-layer/price-products/data-objects/included-items/PriceProductIncludedItemsDO';
import {AllotmentDO} from '../../../../../core/data-layer/allotments/data-objects/AllotmentDO';
import {RoomCategoryStatsDO} from '../../../../../core/data-layer/room-categories/data-objects/RoomCategoryStatsDO';
import {PriceProductsHelper} from '../../price-products/helpers/PriceProductsHelper';
import {SavePriceProductItem} from '../../../../../core/domain-layer/price-products/SavePriceProductItem';
import {AddBookingItemsDO, BookingItemDO} from '../../../../../core/domain-layer/bookings/add-bookings/AddBookingItemsDO';
import {ThTimestampDO} from '../../../../../core/utils/th-dates/data-objects/ThTimestampDO';
import {ThHourDO} from '../../../../../core/utils/th-dates/data-objects/ThHourDO';
import {ThDateIntervalDO} from '../../../../../core/utils/th-dates/data-objects/ThDateIntervalDO';
import {TestUtils} from '../../../../helpers/TestUtils';
import {ThDateUtils} from '../../../../../core/utils/th-dates/ThDateUtils';
import {ConfigCapacityDO} from '../../../../../core/data-layer/common/data-objects/bed-config/ConfigCapacityDO';
import {DefaultBillingDetailsDO} from '../../../../../core/data-layer/bookings/data-objects/default-billing/DefaultBillingDetailsDO';
import {InvoicePaymentMethodType} from '../../../../../core/data-layer/invoices/data-objects/payers/InvoicePaymentMethodDO';
import {DefaultPriceProductBuilder} from '../../../../db-initializers/builders/DefaultPriceProductBuilder';
import {BookingSearchDO} from '../../../../../core/domain-layer/bookings/search-bookings/BookingSearchDO';
import {CustomerDO} from '../../../../../core/data-layer/customers/data-objects/CustomerDO';
import {AddOnProductDO} from '../../../../../core/data-layer/add-on-products/data-objects/AddOnProductDO';
import {TransientBookingItemDO} from '../../../../../core/domain-layer/bookings/search-bookings/TransientBookingItemDO';

import _ = require('underscore');

export class BookingTestHelper {
    public static NoBookingGroups = 10;
    public static MinBookingsWithinGroup = 1;
    public static MaxBookingsWithinGroup = 10;

    private _testUtils: TestUtils = new TestUtils();
    private _thDateUtils: ThDateUtils = new ThDateUtils();

    constructor() {
    }

    public createGenericPriceProduct(testDataBuilder: DefaultDataBuilder, testContext: TestContext): Promise<PriceProductDO> {
        var roomCategoryIdList = _.map(testDataBuilder.roomCategoryStatsList, (roomCategStat: RoomCategoryStatsDO) => {
            return roomCategStat.roomCategory.id;
        });
        var ppHelper = new PriceProductsHelper(testDataBuilder, testContext);
        ppHelper.updateYMValidFilterList(testDataBuilder.defaultYieldFilters);
        var priceProductItem = ppHelper.getDraftSavePriceProductItemDO();
        priceProductItem.constraints.constraintList = [];
        priceProductItem.status = PriceProductStatus.Active;
        priceProductItem.roomCategoryIdList = roomCategoryIdList;
        priceProductItem.price = DefaultPriceProductBuilder.getPricePerPerson(testDataBuilder.roomCategoryStatsList);
        
        priceProductItem.includedItems = new PriceProductIncludedItemsDO();
        var breakfastAop = _.find(testDataBuilder.addOnProductList, (aop: AddOnProductDO) => {
            return aop.categoryId === testDataBuilder.breakfastAddOnProductCategory.id;
        });
        priceProductItem.includedItems.attachedAddOnProductItemList = [];
        priceProductItem.includedItems.includedBreakfastAddOnProductSnapshot = breakfastAop.getAddOnProductSnapshotDO();
        priceProductItem.includedItems.indexedAddOnProductIdList = [breakfastAop.id];

        var savePPItem = new SavePriceProductItem(testContext.appContext, testContext.sessionContext);
        return savePPItem.save(priceProductItem);
    }

    public getBookingItems(testDataBuilder: DefaultDataBuilder, priceProduct: PriceProductDO, allotment?: AllotmentDO): AddBookingItemsDO {
        var noOfBookingItemDO = this._testUtils.getRandomIntBetween(BookingTestHelper.MinBookingsWithinGroup, BookingTestHelper.MaxBookingsWithinGroup);
        if (allotment) {
            noOfBookingItemDO = 1;
        }
        var bookingItemList: BookingItemDO[] = [];
        for (var numItem = 0; numItem < noOfBookingItemDO; numItem++) {
            bookingItemList.push(this.getBookingItemDO(testDataBuilder, priceProduct, allotment));
        }
        return {
            bookingList: bookingItemList,
            confirmationEmailList: [testDataBuilder.hotelDO.contactDetails.email]
        }
    }

    public getBookingItemDO(testDataBuilder: DefaultDataBuilder, priceProduct: PriceProductDO, allotment?: AllotmentDO): BookingItemDO {
        var customerId = this._testUtils.getRandomListElement(testDataBuilder.customerList).id;
        var roomCategoryId = this._testUtils.getRandomListElement(priceProduct.roomCategoryIdList);
        var allotmentId = "";
        if (allotment) {
            customerId = allotment.customerId;
            roomCategoryId = allotment.roomCategoryId;
            allotmentId = allotment.id;
        }

        var billingDetails = new DefaultBillingDetailsDO();
        billingDetails.buildFromObject({
            customerId: customerId,
            paymentGuarantee: true,
            paymentMethod: {
                type: InvoicePaymentMethodType.DefaultPaymentMethod,
                value: this._testUtils.getRandomListElement(testDataBuilder.hotelDO.paymentMethodIdList)
            }
        });

        return {
            interval: this.generateRandomFutureInterval(testDataBuilder),
            configCapacity: this.getConfigCapacity(),
            customerIdList: [customerId],
            defaultBillingDetails: billingDetails,
            roomCategoryId: roomCategoryId,
            priceProductId: priceProduct.id,
            allotmentId: allotmentId,
            notes: "This is an automatic booking"
        }

    }
    private getConfigCapacity(): ConfigCapacityDO {
        var capacity = new ConfigCapacityDO();
        capacity.noAdults = 1;
        capacity.noChildren = 1;
        capacity.noBabies = 0;
        return capacity;
    }

    public generateRandomFutureInterval(testDataBuilder: DefaultDataBuilder): ThDateIntervalDO {
        var thTimestamp = ThTimestampDO.buildThTimestampForTimezone(testDataBuilder.hotelDO.timezone);
        var startDate = this._thDateUtils.addDaysToThDateDO(thTimestamp.thDateDO, this._testUtils.getRandomIntBetween(10, 200));
        var endDate = this._thDateUtils.addDaysToThDateDO(startDate.buildPrototype(), this._testUtils.getRandomIntBetween(1, 7));
        return ThDateIntervalDO.buildThDateIntervalDO(startDate, endDate);
    }

    public getBookingSearchInterval(testDataBuilder: DefaultDataBuilder): ThDateIntervalDO {
        var thTimestamp = ThTimestampDO.buildThTimestampForTimezone(testDataBuilder.hotelDO.timezone);
        var startDate = thTimestamp.thDateDO;
        var endDate = this._thDateUtils.addDaysToThDateDO(startDate.buildPrototype(), 207);
        return ThDateIntervalDO.buildThDateIntervalDO(startDate, endDate);
    }

    public getPublicBookingSearchDO(testDataBuilder: DefaultDataBuilder): BookingSearchDO {
        var bookingSearchDO = new BookingSearchDO();
        bookingSearchDO.configCapacity = this.getConfigCapacity();
        bookingSearchDO.interval = this.getDefaultBookingSearchInterval(testDataBuilder);
        bookingSearchDO.transientBookingList = [];
        return bookingSearchDO;
    }
    private getDefaultBookingSearchInterval(testDataBuilder: DefaultDataBuilder): ThDateIntervalDO {
        var thTimestamp = ThTimestampDO.buildThTimestampForTimezone(testDataBuilder.hotelDO.timezone);
        var startDate = this._thDateUtils.addDaysToThDateDO(thTimestamp.thDateDO, 10);
        var endDate = this._thDateUtils.addDaysToThDateDO(startDate.buildPrototype(), 100);
        return ThDateIntervalDO.buildThDateIntervalDO(startDate, endDate);
    }
    public getPrivateBookingSearchDO(testDataBuilder: DefaultDataBuilder, customer: CustomerDO): BookingSearchDO {
        var bookingSearchDO = this.getPublicBookingSearchDO(testDataBuilder);
        bookingSearchDO.customerId = customer.id;
        return bookingSearchDO;
    }
    public getPrivateBookingSearchWithTransientBookingDO(testDataBuilder: DefaultDataBuilder, customer: CustomerDO, priceProductId: string, roomCategoryId: string, allotmentId: string): BookingSearchDO {
        var bookingSearchDO = this.getPrivateBookingSearchDO(testDataBuilder, customer);
        var transientBookingItemDO = new TransientBookingItemDO();
        transientBookingItemDO.configCapacity = bookingSearchDO.configCapacity;
        transientBookingItemDO.interval = bookingSearchDO.interval;
        transientBookingItemDO.priceProductId = priceProductId;
        transientBookingItemDO.roomCategoryId = roomCategoryId;
        transientBookingItemDO.allotmentId = allotmentId;
        bookingSearchDO.transientBookingList.push(transientBookingItemDO);

        return bookingSearchDO;
    }

    public getMaxTimestamp(): ThTimestampDO {
        var maxTimestamp = new ThTimestampDO();
        maxTimestamp.thDateDO = this._thDateUtils.getMaxThDateDO();
        maxTimestamp.thHourDO = ThHourDO.buildThHourDO(0, 0);
        return maxTimestamp;
    }
}