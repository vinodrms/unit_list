require("sails-test-helper");
import should = require('should');
import supertest = require('supertest');
import _ = require("underscore");

import {ThError} from '../../../../core/utils/th-responses/ThError';
import {ThStatusCode} from '../../../../core/utils/th-responses/ThResponse';
import {DefaultDataBuilder} from '../../../db-initializers/DefaultDataBuilder';
import {TestContext} from '../../../helpers/TestContext';
import {CustomersTestHelper} from '../customers/helpers/CustomersTestHelper';
import {AllotmentsHelper} from '../allotments/helpers/AllotmentsHelper';
import {PriceProductsHelper} from '../price-products/helpers/PriceProductsHelper';
import {SavePriceProductItem} from '../../../../core/domain-layer/price-products/SavePriceProductItem';
import {AddBookingItems} from '../../../../core/domain-layer/bookings/add-bookings/AddBookingItems';
import {AddBookingItemsDO} from '../../../../core/domain-layer/bookings/add-bookings/AddBookingItemsDO';
import {BookingDO, GroupBookingInputChannel} from '../../../../core/data-layer/bookings/data-objects/BookingDO';
import {PriceProductDO, PriceProductStatus} from '../../../../core/data-layer/price-products/data-objects/PriceProductDO';
import {ThTimestampDO} from '../../../../core/utils/th-dates/data-objects/ThTimestampDO';
import {ThDateIntervalDO} from '../../../../core/utils/th-dates/data-objects/ThDateIntervalDO';
import {ThDateUtils} from '../../../../core/utils/th-dates/ThDateUtils';
import {ConfigCapacityDO} from '../../../../core/data-layer/common/data-objects/bed-config/ConfigCapacityDO';
import {DefaultBillingDetailsDO} from '../../../../core/data-layer/bookings/data-objects/default-billing/DefaultBillingDetailsDO';

describe("New Bookings Tests", function () {
    var pphelper: PriceProductsHelper;
    var custHelper: CustomersTestHelper;
    var allotmentsHelper: AllotmentsHelper;

    var testContext: TestContext;
    var testDataBuilder: DefaultDataBuilder;

    var thDateUtils = new ThDateUtils();

    var addedPriceProduct: PriceProductDO;

    before(function (done: any) {
        testContext = new TestContext();
        testDataBuilder = new DefaultDataBuilder(testContext);

        pphelper = new PriceProductsHelper(testDataBuilder, testContext);
        custHelper = new CustomersTestHelper(testDataBuilder, testContext);
        allotmentsHelper = new AllotmentsHelper(testDataBuilder, testContext);

        testDataBuilder.buildWithDoneCallback(done);
    });

    describe("New Bookings Validation Tests", function () {
        it("Should update the price product filter list", function (done) {
            pphelper.updateYMValidFilterList(testDataBuilder.defaultYieldFilters);
            done();
        });

        it("Should add a booking", function (done) {
            debugger
            var priceProductItem = pphelper.getDraftSavePriceProductItemDO();
            priceProductItem.constraints.constraintList = [];
            priceProductItem.status = PriceProductStatus.Active;

            var savePPItem = new SavePriceProductItem(testContext.appContext, testContext.sessionContext);
            savePPItem.save(priceProductItem).
                then((priceProduct: PriceProductDO) => {
                    addedPriceProduct = priceProduct;

                    debugger
                    var thTimestamp = ThTimestampDO.buildThTimestampForTimezone(testDataBuilder.hotelDO.timezone);
                    var bookingInterval = ThDateIntervalDO.buildThDateIntervalDO(thTimestamp.thDateDO, thDateUtils.addDaysToThDateDO(thTimestamp.thDateDO.buildPrototype(), 1));
                    var capacity = new ConfigCapacityDO();
                    capacity.noAdults = 1;
                    capacity.noChildren = 0;
                    capacity.noBabies = 0;
                    var billingDetails = new DefaultBillingDetailsDO();
                    billingDetails.buildFromObject({
                        customerId: testDataBuilder.customerList[0].id,
                        paymentGuarantee: true,
                        paymentMethod: {
                            type: 0,
                            value: testDataBuilder.hotelDO.paymentMethodIdList[0]
                        }
                    });


                    var bookingItems: AddBookingItemsDO = {
                        interval: bookingInterval,
                        configCapacity: capacity,
                        bookingList: [
                            {
                                customerIdList: [testDataBuilder.customerList[0].id],
                                defaultBillingDetails: billingDetails,
                                roomCategoryId: addedPriceProduct.roomCategoryIdList[0],
                                priceProductId: addedPriceProduct.id,
                                allotmentId: "",
                                notes: "test test test booking!!!"
                            }
                        ],
                        confirmationEmailList: ["paraschiv.ionut@gmail.com"]
                    }
                    var addBookings = new AddBookingItems(testContext.appContext, testContext.sessionContext);
                    return addBookings.add(bookingItems, GroupBookingInputChannel.PropertyManagementSystem);
                }).then((bookingList: BookingDO[]) => {
                    done();


                }).catch((e: ThError) => {
                    debugger
                    done(e);
                });
        });
    });
});