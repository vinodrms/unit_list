require("sails-test-helper");
import should = require('should');
import supertest = require('supertest');
import _ = require("underscore");

import {ThError} from '../../../../core/utils/th-responses/ThError';
import {ThStatusCode} from '../../../../core/utils/th-responses/ThResponse';
import {DefaultDataBuilder} from '../../../db-initializers/DefaultDataBuilder';
import {TestContext} from '../../../helpers/TestContext';
import {TestUtils} from '../../../helpers/TestUtils';
import {DefaultPriceProductBuilder} from '../../../db-initializers/builders/DefaultPriceProductBuilder';
import {PriceProductsHelper} from './helpers/PriceProductsHelper';
import {CustomersTestHelper} from '../customers/helpers/CustomersTestHelper';
import {RoomCategoryStatsDO} from '../../../../core/data-layer/room-categories/data-objects/RoomCategoryStatsDO';
import {SavePriceProductItem} from '../../../../core/domain-layer/price-products/SavePriceProductItem';
import {PriceProductDO, PriceProductAvailability} from '../../../../core/data-layer/price-products/data-objects/PriceProductDO';
import {CustomerDO} from '../../../../core/data-layer/customers/data-objects/CustomerDO';
import {PriceProductStatus} from '../../../../core/data-layer/price-products/data-objects/PriceProductDO';
import {PriceProductCancellationPolicyType} from '../../../../core/data-layer/price-products/data-objects/conditions/cancellation/IPriceProductCancellationPolicy';
import {PriceProductCancellationPenaltyType} from '../../../../core/data-layer/price-products/data-objects/conditions/penalty/IPriceProductCancellationPenalty';
import {SaveCustomerItem} from '../../../../core/domain-layer/customers/SaveCustomerItem';
import {ArchivePriceProductItem} from '../../../../core/domain-layer/price-products/ArchivePriceProductItem';
import {DraftPriceProductItem} from '../../../../core/domain-layer/price-products/DraftPriceProductItem';
import {DeletePriceProductItem} from '../../../../core/domain-layer/price-products/DeletePriceProductItem';
import {PriceProductSearchResultRepoDO} from '../../../../core/data-layer/price-products/repositories/IPriceProductRepository';

describe("Hotel Price Products Tests", function() {
	var InvalidRoomCategoryId = "12121221211";
	var InvalidAddOnProductId = "12121221211";
	var InvalidTaxId = "12121221211";
	var NewPriceProductName = "12121221211";

	var testContext: TestContext;
	var testDataBuilder: DefaultDataBuilder;
	var testUtils: TestUtils;

	var pphelper: PriceProductsHelper;
	var custHelper: CustomersTestHelper;

	var addedPriceProduct: PriceProductDO;
	var addedCompanyCustomer: CustomerDO;

	before(function(done: any) {
		testContext = new TestContext();
		testDataBuilder = new DefaultDataBuilder(testContext);
		testUtils = new TestUtils();
		pphelper = new PriceProductsHelper(testDataBuilder, testContext);
		custHelper = new CustomersTestHelper(testDataBuilder, testContext);

		testDataBuilder.buildWithDoneCallback(done);
    });

	describe("Price Products Validation Tests", function() {
		it("Should update the price product filter list", function(done) {
			pphelper.updateYMValidFilterList(testDataBuilder.defaultYieldManagerFilters);
			done();
		});

		it("Should not save price product with invalid room category id", function(done) {
			var priceProductItem = pphelper.getDraftSavePriceProductItemDO();
			priceProductItem.roomCategoryIdList.push(InvalidRoomCategoryId);

			var savePPItem = new SavePriceProductItem(testContext.appContext, testContext.sessionContext);
			savePPItem.save(priceProductItem).then((result: PriceProductDO) => {
				done(new Error("Did manage to create price product with invalid room category id"));
			}).catch((e: ThError) => {
				should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
				done();
			});
        });
		it("Should not save price product with invalid add on product id", function(done) {
			var priceProductItem = pphelper.getDraftSavePriceProductItemDO();
			priceProductItem.addOnProductIdList.push(InvalidAddOnProductId);

			var savePPItem = new SavePriceProductItem(testContext.appContext, testContext.sessionContext);
			savePPItem.save(priceProductItem).then((result: PriceProductDO) => {
				done(new Error("Did manage to create price product with invalid add on product id"));
			}).catch((e: ThError) => {
				should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
				done();
			});
        });
		it("Should not save price product with invalid tax id", function(done) {
			var priceProductItem = pphelper.getDraftSavePriceProductItemDO();
			priceProductItem.taxIdList.push(InvalidTaxId);

			var savePPItem = new SavePriceProductItem(testContext.appContext, testContext.sessionContext);
			savePPItem.save(priceProductItem).then((result: PriceProductDO) => {
				done(new Error("Did manage to create price product with invalid tax id"));
			}).catch((e: ThError) => {
				should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
				done();
			});
        });
		it("Should not save price product with missing price per person", function(done) {
			var priceProductItem = pphelper.getDraftSavePriceProductItemDO();
			priceProductItem.price = DefaultPriceProductBuilder.getPricePerPerson(pphelper.roomCategoryStat);
			priceProductItem.price.priceConfiguration["adultsPriceList"] = [];

			var savePPItem = new SavePriceProductItem(testContext.appContext, testContext.sessionContext);
			savePPItem.save(priceProductItem).then((result: PriceProductDO) => {
				done(new Error("Did manage to create price product with invalid tax id"));
			}).catch((e: ThError) => {
				should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
				done();
			});
        });
		it("Should not save price product with missing price per category", function(done) {
			var priceProductItem = pphelper.getDraftSavePriceProductItemDO();
			priceProductItem.price = DefaultPriceProductBuilder.getPricePerRoomCategory(pphelper.roomCategoryStat);
			priceProductItem.price.priceConfiguration["priceList"] = [];

			var savePPItem = new SavePriceProductItem(testContext.appContext, testContext.sessionContext);
			savePPItem.save(priceProductItem).then((result: PriceProductDO) => {
				done(new Error("Did manage to create price product with invalid tax id"));
			}).catch((e: ThError) => {
				should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
				done();
			});
        });
		it("Should not save price product with invalid conditions", function(done) {
			var priceProductItem = pphelper.getDraftSavePriceProductItemDO();
			priceProductItem.conditions.policyType = PriceProductCancellationPolicyType.CanCancelBeforeTimeOnDayOfArrival;
			priceProductItem.conditions.policy = {
				hour: 18,
				minute: 0
			};
			priceProductItem.conditions.penaltyType = PriceProductCancellationPenaltyType.NoPenalty;

			var savePPItem = new SavePriceProductItem(testContext.appContext, testContext.sessionContext);
			savePPItem.save(priceProductItem).then((result: PriceProductDO) => {
				done(new Error("Did manage to create price product with invalid tax id"));
			}).catch((e: ThError) => {
				should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
				done();
			});
        });
		it("Should not save price product with invalid filters", function(done) {
			var priceProductItem = pphelper.getDraftSavePriceProductItemDO();
			priceProductItem.yieldFilterList = pphelper.getInvalidFilterList();

			var savePPItem = new SavePriceProductItem(testContext.appContext, testContext.sessionContext);
			savePPItem.save(priceProductItem).then((result: PriceProductDO) => {
				done(new Error("Did manage to create price product with invalid filters"));
			}).catch((e: ThError) => {
				should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
				done();
			});
        });
	});
	describe("Price Products CRUD Tests", function() {
		it("Should save a draft price product", function(done) {
			var priceProductItem = pphelper.getDraftSavePriceProductItemDO();
			var savePPItem = new SavePriceProductItem(testContext.appContext, testContext.sessionContext);
			savePPItem.save(priceProductItem).then((priceProduct: PriceProductDO) => {
				should.equal(priceProduct.name, priceProductItem.name);
				should.equal(priceProduct.status, PriceProductStatus.Draft);
				should.exist(priceProduct.id);
				addedPriceProduct = priceProduct;
				done();
			}).catch((e: ThError) => {
				done(e);
			});
        });
		it("Should update the price product and mark it as Active", function(done) {
			var priceProductItem = pphelper.getDraftSavePriceProductItemDO();
			priceProductItem["id"] = addedPriceProduct.id;
			priceProductItem.status = PriceProductStatus.Active;

			var savePPItem = new SavePriceProductItem(testContext.appContext, testContext.sessionContext);
			savePPItem.save(priceProductItem).then((updatedPriceProduct: PriceProductDO) => {
				should.equal(updatedPriceProduct.name, priceProductItem.name);
				should.equal(updatedPriceProduct.status, PriceProductStatus.Active);
				should.equal(updatedPriceProduct.id, addedPriceProduct.id);
				addedPriceProduct = updatedPriceProduct;
				done();
			}).catch((e: ThError) => {
				done(e);
			});
        });
		it("Should get the list of Price Products", function(done) {
			var ppRepo = testContext.appContext.getRepositoryFactory().getPriceProductRepository();
			ppRepo.getPriceProductList({ hotelId: testContext.sessionContext.sessionDO.hotel.id }, { status: PriceProductStatus.Active })
				.then((searchResult: PriceProductSearchResultRepoDO) => {
					should.equal(searchResult.priceProductList.length, testDataBuilder.priceProductList.length + 1);
					done();
				}).catch((e: any) => {
					done(e);
				});
        });
		it("Should update only the Yield Filters for the Active Price Product", function(done) {
			var priceProductItem = pphelper.getDraftSavePriceProductItemDO();
			priceProductItem["id"] = addedPriceProduct.id;
			priceProductItem.status = PriceProductStatus.Draft;
			priceProductItem.roomCategoryIdList = [];
			priceProductItem.taxIdList = [];
			priceProductItem.name = NewPriceProductName;

			var savePPItem = new SavePriceProductItem(testContext.appContext, testContext.sessionContext);
			savePPItem.save(priceProductItem).then((updatedPriceProduct: PriceProductDO) => {
				should.equal(updatedPriceProduct.name, addedPriceProduct.name);
				should.equal(updatedPriceProduct.status, PriceProductStatus.Active);
				should.equal(updatedPriceProduct.id, addedPriceProduct.id);
				should.equal(testUtils.stringArraysAreEqual(updatedPriceProduct.taxIdList, addedPriceProduct.taxIdList), true);
				should.equal(testUtils.stringArraysAreEqual(updatedPriceProduct.roomCategoryIdList, addedPriceProduct.roomCategoryIdList), true);

				addedPriceProduct = updatedPriceProduct;
				done();
			}).catch((e: ThError) => {
				done(e);
			});
        });
		it("Should attach the price product to a customer profile", function(done) {
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
		it("Should not archive the price product attached to a customer profile", function(done) {
			var archivePPItem = new ArchivePriceProductItem(testContext.appContext, testContext.sessionContext);
			archivePPItem.archive({ id: addedPriceProduct.id }).then((priceProduct: PriceProductDO) => {
				done(new Error("Managed to archive a price product attached to a customer"));
			}).catch((e: any) => {
				should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
				done();
			});
        });
		it("Should detach the price product from the customer profile", function(done) {
			var companyCustDO = addedCompanyCustomer;
			companyCustDO.priceProductDetails.priceProductAvailability = PriceProductAvailability.Public;
			companyCustDO.priceProductDetails.priceProductIdList = [];
			var saveCustItem = new SaveCustomerItem(testContext.appContext, testContext.sessionContext);
			saveCustItem.save(companyCustDO).then((cust: CustomerDO) => {
				should.equal(cust.id, companyCustDO.id);
				addedCompanyCustomer = cust;
				done();
			}).catch((error: any) => {
				done(error);
			});
        });
		it("Should archive the price product", function(done) {
			var archivePPItem = new ArchivePriceProductItem(testContext.appContext, testContext.sessionContext);
			archivePPItem.archive({ id: addedPriceProduct.id }).then((priceProduct: PriceProductDO) => {
				should.equal(priceProduct.id, addedPriceProduct.id);
				should.equal(priceProduct.status, PriceProductStatus.Archived);
				addedPriceProduct = priceProduct;
				done();
			}).catch((e: any) => {
				done(e);
			});
        });
		it("Should mark the archived price product as draft", function(done) {
			var draftPPItem = new DraftPriceProductItem(testContext.appContext, testContext.sessionContext);
			draftPPItem.draft({ id: addedPriceProduct.id }).then((priceProduct: PriceProductDO) => {
				should.equal(priceProduct.id, addedPriceProduct.id);
				should.equal(priceProduct.status, PriceProductStatus.Draft);
				addedPriceProduct = priceProduct;
				done();
			}).catch((e: any) => {
				done(e);
			});
        });
		it("Should delete the draft price product", function(done) {
			var deletePPItem = new DeletePriceProductItem(testContext.appContext, testContext.sessionContext);
			deletePPItem.delete({ id: addedPriceProduct.id }).then((priceProduct: PriceProductDO) => {
				should.equal(priceProduct.id, addedPriceProduct.id);
				should.equal(priceProduct.status, PriceProductStatus.Deleted);
				addedPriceProduct = priceProduct;
				done();
			}).catch((e: any) => {
				done(e);
			});
        });
	});
});