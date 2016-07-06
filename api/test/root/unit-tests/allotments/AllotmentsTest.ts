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
import {PriceProductDO, PriceProductStatus, PriceProductAvailability} from '../../../../core/data-layer/price-products/data-objects/PriceProductDO';
import {PriceProductSearchResultRepoDO} from '../../../../core/data-layer/price-products/repositories/IPriceProductRepository';
import {SaveAllotmentItem} from '../../../../core/domain-layer/allotments/SaveAllotmentItem';
import {AllotmentDO, AllotmentStatus} from '../../../../core/data-layer/allotments/data-objects/AllotmentDO';
import {AllotmentAvailabilityForDayDO} from '../../../../core/data-layer/allotments/data-objects/availability/AllotmentAvailabilityForDayDO';
import {ArchiveAllotmentItem} from '../../../../core/domain-layer/allotments/ArchiveAllotmentItem';

describe("Hotel Allotments Tests", function () {
	var InvalidId = "12121221211";
	var AllotmentNotes = "new updated notes for the allotment";

	var testContext: TestContext;
	var testDataBuilder: DefaultDataBuilder;
	var thDateUtils = new ThDateUtils();

	var allotmentsHelper: AllotmentsHelper;
	var custHelper: CustomersTestHelper;

	var addedCompanyCustomer: CustomerDO;
	var addedConfidentialPriceProduct: PriceProductDO;
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
			addedConfidentialPriceProduct = _.find(testDataBuilder.priceProductList, (priceProduct: PriceProductDO) => { return priceProduct.availability === PriceProductAvailability.Confidential });
			should.exist(addedConfidentialPriceProduct);

			var companyCustDO = custHelper.getCompanyCustomer(addedConfidentialPriceProduct.id);
			companyCustDO.priceProductDetails.allowPublicPriceProducts = true;

			var saveCustItem = new SaveCustomerItem(testContext.appContext, testContext.sessionContext);
			saveCustItem.save(companyCustDO).then((cust: CustomerDO) => {
				should.exist(cust.id);
				addedCompanyCustomer = cust;
				done();
			}).catch((error: any) => {
				done(error);
			});
        });
		it("Should get the attached price product from the repository using the customer price product details", function (done) {
			var priceProductRepo = testContext.appContext.getRepositoryFactory().getPriceProductRepository();
			priceProductRepo.getPriceProductList({ hotelId: testContext.sessionContext.sessionDO.hotel.id },
				{
					status: PriceProductStatus.Active,
					customerPriceProductDetails: addedCompanyCustomer.priceProductDetails
				})
				.then((ppSearchResult: PriceProductSearchResultRepoDO) => {
					var foundPriceProduct = _.find(ppSearchResult.priceProductList, (priceProduct: PriceProductDO) => { return priceProduct.id === addedConfidentialPriceProduct.id });
					should.exist(foundPriceProduct);
					done();
				}).catch((error: any) => {
					done(error);
				});
        });
		it("Should not create allotment with invalid interval", function (done) {
			var allotmentItem = allotmentsHelper.getSaveAllotmentItemDO(addedCompanyCustomer, addedConfidentialPriceProduct);
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
			var allotmentItem = allotmentsHelper.getSaveAllotmentItemDO(addedCompanyCustomer, addedConfidentialPriceProduct);
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
			var allotmentItem = allotmentsHelper.getSaveAllotmentItemDO(addedCompanyCustomer, addedConfidentialPriceProduct);
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
			var allotmentItem = allotmentsHelper.getSaveAllotmentItemDO(addedCompanyCustomer, addedConfidentialPriceProduct);
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
			var allotmentItem = allotmentsHelper.getSaveAllotmentItemDO(addedCompanyCustomer, addedConfidentialPriceProduct);
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
			var allotmentItem = allotmentsHelper.getSaveAllotmentItemDO(addedCompanyCustomer, addedConfidentialPriceProduct);
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
			var allotmentItem = allotmentsHelper.getSaveAllotmentItemDO(addedCompanyCustomer, addedConfidentialPriceProduct);
			var saveAllotmentItem = new SaveAllotmentItem(testContext.appContext, testContext.sessionContext);
			saveAllotmentItem.save(allotmentItem).then((savedAllotment: AllotmentDO) => {
				should.exist(savedAllotment.id);
				should.exist(savedAllotment.expiryUtcTimestamp);
				should.equal(savedAllotment.priceProductId, allotmentItem.priceProductId);
				should.equal(savedAllotment.customerId, allotmentItem.customerId);
				should.equal(savedAllotment.roomCategoryId, allotmentItem.roomCategoryId);
				should.equal(savedAllotment.notes, allotmentItem.notes);

				addedAllotment = savedAllotment;
				done();
			}).catch((e: ThError) => {
				done(e);
			});
        });
		it("Should update the allotment", function (done) {
			var allotmentItem = allotmentsHelper.getSaveAllotmentItemDO(addedCompanyCustomer, addedConfidentialPriceProduct);
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