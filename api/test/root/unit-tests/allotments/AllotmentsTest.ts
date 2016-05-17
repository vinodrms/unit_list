require("sails-test-helper");
import should = require('should');
import supertest = require('supertest');
import _ = require("underscore");

import {ThError} from '../../../../core/utils/th-responses/ThError';
import {ThStatusCode} from '../../../../core/utils/th-responses/ThResponse';
import {TestContext} from '../../../helpers/TestContext';
import {DefaultDataBuilder} from '../../../db-initializers/DefaultDataBuilder';
import {ThDateUtils} from '../../../../core/utils/th-dates/ThDateUtils';
import {CustomersTestHelper} from '../customers/helpers/CustomersTestHelper';
import {CustomerDO} from '../../../../core/data-layer/customers/data-objects/CustomerDO';
import {SaveCustomerItem} from '../../../../core/domain-layer/customers/SaveCustomerItem';
import {AllotmentsHelper} from './helpers/AllotmentsHelper';
import {PriceProductDO} from '../../../../core/data-layer/price-products/data-objects/PriceProductDO';
import {SaveAllotmentItem} from '../../../../core/domain-layer/allotment/SaveAllotmentItem';
import {AllotmentDO, AllotmentStatus} from '../../../../core/data-layer/allotment/data-objects/AllotmentDO';
import {AllotmentAvailabilityForDayDO} from '../../../../core/data-layer/allotment/data-objects/availability/AllotmentAvailabilityForDayDO';
import {AllotmentInventoryForDateDO} from '../../../../core/data-layer/allotment/data-objects/inventory/AllotmentInventoryForDateDO';
import {ArchiveAllotmentItem} from '../../../../core/domain-layer/allotment/ArchiveAllotmentItem';

describe("Hotel Allotments Tests", function () {
	var InvalidId = "12121221211";
	var AllotmentNotes = "new updated notes for the allotment";

	var testContext: TestContext;
	var testDataBuilder: DefaultDataBuilder;
	var thDateUtils = new ThDateUtils();

	var allotmentsHelper: AllotmentsHelper;
	var custHelper: CustomersTestHelper;

	var addedCompanyCustomer: CustomerDO;
	var addedPriceProduct: PriceProductDO;
	var addedAllotment: AllotmentDO;

	before(function (done: any) {
		testContext = new TestContext();
		testDataBuilder = new DefaultDataBuilder(testContext);
		allotmentsHelper = new AllotmentsHelper(testDataBuilder, testContext);
		custHelper = new CustomersTestHelper(testDataBuilder, testContext);

		testDataBuilder.buildWithDoneCallback(done);
    });

	describe("Allotments Validation Tests", function () {
		it("Should attach a price product to a customer profile", function (done) {
			addedPriceProduct = testDataBuilder.priceProductList[0];
			var companyCustDO = custHelper.getCompanyCustomer(addedPriceProduct.id);

			var saveCustItem = new SaveCustomerItem(testContext.appContext, testContext.sessionContext);
			saveCustItem.save(companyCustDO).then((cust: CustomerDO) => {
				should.exist(cust.id);
				addedCompanyCustomer = cust;
				done();
			}).catch((error: any) => {
				done(error);
			});
        });
		it("Should not create allotment with invalid interval", function (done) {
			var allotmentItem = allotmentsHelper.getSaveAllotmentItemDO(addedCompanyCustomer, addedPriceProduct);
			allotmentItem.openInterval.end = thDateUtils.getMinThDateDO();

			var saveAllotmentItem = new SaveAllotmentItem(testContext.appContext, testContext.sessionContext);
			saveAllotmentItem.save(allotmentItem).then((savedAllotment: AllotmentDO) => {
				done(new Error("Did manage to create allotment with invalid interval"));
			}).catch((e: ThError) => {
				should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
				done();
			});
        });
		it("Should not create allotment with too long interval", function (done) {
			var allotmentItem = allotmentsHelper.getSaveAllotmentItemDO(addedCompanyCustomer, addedPriceProduct);
			allotmentItem.openInterval.end = thDateUtils.getMaxThDateDO();

			var saveAllotmentItem = new SaveAllotmentItem(testContext.appContext, testContext.sessionContext);
			saveAllotmentItem.save(allotmentItem).then((savedAllotment: AllotmentDO) => {
				done(new Error("Did manage to create allotment with too long interval"));
			}).catch((e: ThError) => {
				should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
				done();
			});
        });
		it("Should not create allotment with invalid availability configuration for a day", function (done) {
			var allotmentItem = allotmentsHelper.getSaveAllotmentItemDO(addedCompanyCustomer, addedPriceProduct);
			allotmentItem.availability.availabilityForDayList.pop();

			var saveAllotmentItem = new SaveAllotmentItem(testContext.appContext, testContext.sessionContext);
			saveAllotmentItem.save(allotmentItem).then((savedAllotment: AllotmentDO) => {
				done(new Error("Did manage to create allotment with invalid availability configuration for a day"));
			}).catch((e: ThError) => {
				should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
				done();
			});
        });
		it("Should not create allotment with invalid customer id", function (done) {
			var allotmentItem = allotmentsHelper.getSaveAllotmentItemDO(addedCompanyCustomer, addedPriceProduct);
			allotmentItem.customerId = InvalidId;

			var saveAllotmentItem = new SaveAllotmentItem(testContext.appContext, testContext.sessionContext);
			saveAllotmentItem.save(allotmentItem).then((savedAllotment: AllotmentDO) => {
				done(new Error("Did manage to create allotment with invalid customer id"));
			}).catch((e: ThError) => {
				should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
				done();
			});
        });
		it("Should not create allotment with invalid price product id", function (done) {
			var allotmentItem = allotmentsHelper.getSaveAllotmentItemDO(addedCompanyCustomer, addedPriceProduct);
			allotmentItem.priceProductId = InvalidId;

			var saveAllotmentItem = new SaveAllotmentItem(testContext.appContext, testContext.sessionContext);
			saveAllotmentItem.save(allotmentItem).then((savedAllotment: AllotmentDO) => {
				done(new Error("Did manage to create allotment with invalid price product id"));
			}).catch((e: ThError) => {
				should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
				done();
			});
        });
		it("Should not create allotment with invalid room category id", function (done) {
			var allotmentItem = allotmentsHelper.getSaveAllotmentItemDO(addedCompanyCustomer, addedPriceProduct);
			allotmentItem.roomCategoryId = InvalidId;

			var saveAllotmentItem = new SaveAllotmentItem(testContext.appContext, testContext.sessionContext);
			saveAllotmentItem.save(allotmentItem).then((savedAllotment: AllotmentDO) => {
				done(new Error("Did manage to create allotment with invalid room category id"));
			}).catch((e: ThError) => {
				should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
				done();
			});
        });
	});

	describe("Price Products CRUD Tests", function () {
		it("Should save an allotment", function (done) {
			var allotmentItem = allotmentsHelper.getSaveAllotmentItemDO(addedCompanyCustomer, addedPriceProduct);
			var saveAllotmentItem = new SaveAllotmentItem(testContext.appContext, testContext.sessionContext);
			saveAllotmentItem.save(allotmentItem).then((savedAllotment: AllotmentDO) => {
				should.exist(savedAllotment.id);
				should.exist(savedAllotment.expiryUtcTimestamp);
				should.equal(savedAllotment.priceProductId, allotmentItem.priceProductId);
				should.equal(savedAllotment.customerId, allotmentItem.customerId);
				should.equal(savedAllotment.roomCategoryId, allotmentItem.roomCategoryId);
				should.equal(savedAllotment.notes, allotmentItem.notes);
				should.equal(savedAllotment.inventory.inventoryForDateList.length, AllotmentsHelper.IntervalNumberOfDays + 1);
				savedAllotment.inventory.inventoryForDateList.forEach((inventoryForDay: AllotmentInventoryForDateDO) => {
					should.equal(inventoryForDay.availableCount, allotmentsHelper.getNoOfAvailableRoomsForDay(inventoryForDay.thDate.getISOWeekDay()));
				});
				addedAllotment = savedAllotment;
				done();
			}).catch((e: ThError) => {
				done(e);
			});
        });
		it("Should update the allotment", function (done) {
			var allotmentItem = allotmentsHelper.getSaveAllotmentItemDO(addedCompanyCustomer, addedPriceProduct);
			allotmentItem["id"] = addedAllotment.id;
			allotmentItem.notes = AllotmentNotes;

			var saveAllotmentItem = new SaveAllotmentItem(testContext.appContext, testContext.sessionContext);
			saveAllotmentItem.save(allotmentItem).then((savedAllotment: AllotmentDO) => {
				should.equal(savedAllotment.id, addedAllotment.id);
				should.equal(savedAllotment.notes, AllotmentNotes);

				addedAllotment = savedAllotment;
				done();
			}).catch((e: ThError) => {
				done(e);
			});
        });
		it("Should archive the allotment", function (done) {
			var archiveAllotmentItem = new ArchiveAllotmentItem(testContext.appContext, testContext.sessionContext);
			archiveAllotmentItem.archive({ id: addedAllotment.id }).then((archivedAllotment: AllotmentDO) => {
				should.equal(archivedAllotment.id, addedAllotment.id);
				should.equal(archivedAllotment.status, AllotmentStatus.Archived);

				addedAllotment = archivedAllotment;
				done();
			}).catch((e: ThError) => {
				done(e);
			});
        });
		it("Should not archived archive a non active allotment", function (done) {
			var archiveAllotmentItem = new ArchiveAllotmentItem(testContext.appContext, testContext.sessionContext);
			archiveAllotmentItem.archive({ id: addedAllotment.id }).then((archivedAllotment: AllotmentDO) => {
				done(new Error("Did manage to archive non active allotment"));
			}).catch((e: ThError) => {
				should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
				done();
			});
        });
	});
});