import {DefaultDataBuilder} from '../../../../db-initializers/DefaultDataBuilder';
import {TestContext} from '../../../../helpers/TestContext';
import {PriceProductDO, PriceProductStatus} from '../../../../../core/data-layer/price-products/data-objects/PriceProductDO';
import {RoomCategoryStatsDO} from '../../../../../core/data-layer/room-categories/data-objects/RoomCategoryStatsDO';
import {PriceProductsHelper} from '../../price-products/helpers/PriceProductsHelper';
import {SavePriceProductItem} from '../../../../../core/domain-layer/price-products/SavePriceProductItem';
import {AddBookingItemsDO, BookingItemDO} from '../../../../../core/domain-layer/bookings/add-bookings/AddBookingItemsDO';
import {ThTimestampDO} from '../../../../../core/utils/th-dates/data-objects/ThTimestampDO';
import {ThDateIntervalDO} from '../../../../../core/utils/th-dates/data-objects/ThDateIntervalDO';
import {TestUtils} from '../../../../helpers/TestUtils';
import {ThDateUtils} from '../../../../../core/utils/th-dates/ThDateUtils';
import {ConfigCapacityDO} from '../../../../../core/data-layer/common/data-objects/bed-config/ConfigCapacityDO';
import {DefaultBillingDetailsDO} from '../../../../../core/data-layer/bookings/data-objects/default-billing/DefaultBillingDetailsDO';
import {InvoicePaymentMethodType} from '../../../../../core/data-layer/invoices/data-objects/payers/InvoicePaymentMethodDO';
import {DefaultPriceProductBuilder} from '../../../../db-initializers/builders/DefaultPriceProductBuilder';

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
        var savePPItem = new SavePriceProductItem(testContext.appContext, testContext.sessionContext);
        return savePPItem.save(priceProductItem);
    }

    public getBookingItems(testDataBuilder: DefaultDataBuilder, priceProduct: PriceProductDO): AddBookingItemsDO {
        var noOfBookingItemDO = this._testUtils.getRandomIntBetween(BookingTestHelper.MinBookingsWithinGroup, BookingTestHelper.MaxBookingsWithinGroup);
        var bookingItemList: BookingItemDO[] = [];
        for (var numItem = 0; numItem < noOfBookingItemDO; numItem++) {
            bookingItemList.push(this.getBookingItemDO(testDataBuilder, priceProduct));
        }
        return {
            bookingList: bookingItemList,
            confirmationEmailList: [testDataBuilder.hotelDO.contactDetails.email]
        }
    }

    public getBookingItemDO(testDataBuilder: DefaultDataBuilder, priceProduct: PriceProductDO): BookingItemDO {
        var capacity = new ConfigCapacityDO();
        capacity.noAdults = 1;
        capacity.noChildren = 0;
        capacity.noBabies = 0;

        var customerId = this._testUtils.getRandomListElement(testDataBuilder.customerList).id;
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
            configCapacity: capacity,
            customerIdList: [customerId],
            defaultBillingDetails: billingDetails,
            roomCategoryId: this._testUtils.getRandomListElement(priceProduct.roomCategoryIdList),
            priceProductId: priceProduct.id,
            allotmentId: null,
            notes: "This is an automatic booking"
        }

    }
    private generateRandomFutureInterval(testDataBuilder: DefaultDataBuilder): ThDateIntervalDO {
        var thTimestamp = ThTimestampDO.buildThTimestampForTimezone(testDataBuilder.hotelDO.timezone);
        var startDate = this._thDateUtils.addDaysToThDateDO(thTimestamp.thDateDO, this._testUtils.getRandomIntBetween(0, 200));
        var endDate = this._thDateUtils.addDaysToThDateDO(startDate.buildPrototype(), this._testUtils.getRandomIntBetween(1, 7));
        return ThDateIntervalDO.buildThDateIntervalDO(startDate, endDate);
    }
}