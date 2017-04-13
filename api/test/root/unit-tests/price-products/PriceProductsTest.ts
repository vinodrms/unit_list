require("sails-test-helper");
import should = require('should');
import supertest = require('supertest');
import _ = require("underscore");

import { ThError } from '../../../../core/utils/th-responses/ThError';
import { ThStatusCode } from '../../../../core/utils/th-responses/ThResponse';
import { DefaultDataBuilder } from '../../../db-initializers/DefaultDataBuilder';
import { TestContext } from '../../../helpers/TestContext';
import { TestUtils } from '../../../helpers/TestUtils';
import { DefaultPriceProductBuilder } from '../../../db-initializers/builders/DefaultPriceProductBuilder';
import { PriceProductsHelper } from './helpers/PriceProductsHelper';
import { CustomersTestHelper } from '../customers/helpers/CustomersTestHelper';
import { RoomCategoryStatsDO } from '../../../../core/data-layer/room-categories/data-objects/RoomCategoryStatsDO';
import { SavePriceProductItem } from '../../../../core/domain-layer/price-products/SavePriceProductItem';
import { PriceProductDO, PriceProductAvailability } from '../../../../core/data-layer/price-products/data-objects/PriceProductDO';
import { CustomerDO } from '../../../../core/data-layer/customers/data-objects/CustomerDO';
import { PriceProductStatus } from '../../../../core/data-layer/price-products/data-objects/PriceProductDO';
import { PriceProductCancellationPolicyType } from '../../../../core/data-layer/price-products/data-objects/conditions/cancellation/IPriceProductCancellationPolicy';
import { PriceProductCancellationPenaltyType } from '../../../../core/data-layer/price-products/data-objects/conditions/penalty/IPriceProductCancellationPenalty';
import { SaveCustomerItem } from '../../../../core/domain-layer/customers/SaveCustomerItem';
import { ArchivePriceProductItem } from '../../../../core/domain-layer/price-products/ArchivePriceProductItem';
import { DraftPriceProductItem } from '../../../../core/domain-layer/price-products/DraftPriceProductItem';
import { DeletePriceProductItem } from '../../../../core/domain-layer/price-products/DeletePriceProductItem';
import { PriceProductSearchResultRepoDO } from '../../../../core/data-layer/price-products/repositories/IPriceProductRepository';
import { AllotmentsHelper } from '../allotments/helpers/AllotmentsHelper';
import { SaveAllotmentItem } from '../../../../core/domain-layer/allotments/SaveAllotmentItem';
import { AllotmentDO, AllotmentStatus } from '../../../../core/data-layer/allotments/data-objects/AllotmentDO';
import { ArchiveAllotmentItem } from '../../../../core/domain-layer/allotments/ArchiveAllotmentItem';
import { SaveAddOnProductItem } from '../../../../core/domain-layer/add-on-products/SaveAddOnProductItem';
import { AddOnProductDO } from '../../../../core/data-layer/add-on-products/data-objects/AddOnProductDO';
import { AddOnProductsTestHelper } from '../add-on-products/helpers/AddOnProductsTestHelper'
import { SinglePriceDO } from "../../../../core/data-layer/price-products/data-objects/price/single-price/SinglePriceDO";
import { PriceProductPriceType } from "../../../../core/data-layer/price-products/data-objects/price/IPriceProductPrice";

describe("Hotel Price Products Tests", function () {
	var InvalidRoomCategoryId = "12121221211";
	var InvalidAddOnProductId = "12121221211";
	var InvalidTaxId = "12121221211";
	var NewPriceProductName = "12121221211";

	var testContext: TestContext;
	var testDataBuilder: DefaultDataBuilder;
	var testUtils: TestUtils;

	var pphelper: PriceProductsHelper;
	var custHelper: CustomersTestHelper;
	var allotmentsHelper: AllotmentsHelper;

	var addedPriceProduct: PriceProductDO;
	var addedCompanyCustomer: CustomerDO;
	var addedAllotment: AllotmentDO;

	var addOnProdHelper: AddOnProductsTestHelper;

	before(function (done: any) {
		testContext = new TestContext();
		testDataBuilder = new DefaultDataBuilder(testContext);
		testUtils = new TestUtils();
		pphelper = new PriceProductsHelper(testDataBuilder, testContext);
		custHelper = new CustomersTestHelper(testDataBuilder, testContext);
		allotmentsHelper = new AllotmentsHelper(testDataBuilder, testContext);
		addOnProdHelper = new AddOnProductsTestHelper(testDataBuilder, testContext);
		testDataBuilder.buildWithDoneCallback(done);
	});

	describe("Price Products Validation Tests", function () {
		it("Should update the price product filter list", function (done) {
			pphelper.updateYMValidFilterList(testDataBuilder.defaultYieldFilters);
			done();
		});

		it("Should not save price product with invalid room category id", function (done) {
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
		it("Should not save price product with invalid add on product id", function (done) {
			var priceProductItem = pphelper.getDraftSavePriceProductItemDO();
			priceProductItem.includedItems.includedBreakfastAddOnProductSnapshot.id = InvalidAddOnProductId;

			var savePPItem = new SavePriceProductItem(testContext.appContext, testContext.sessionContext);
			savePPItem.save(priceProductItem).then((result: PriceProductDO) => {
				done(new Error("Did manage to create price product with invalid add on product id"));
			}).catch((e: ThError) => {
				should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
				done();
			});
		});
		it("Should not save price product with invalid tax id", function (done) {
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
		it("Should not save price product with missing price per person", function (done) {
			var priceProductItem = pphelper.getDraftSavePriceProductItemDO();
			priceProductItem.price = DefaultPriceProductBuilder.getPricePerPerson([pphelper.roomCategoryStat]);
			priceProductItem.price.dynamicPriceList[0].priceList[0]["adultsPriceList"] = [];

			var savePPItem = new SavePriceProductItem(testContext.appContext, testContext.sessionContext);
			savePPItem.save(priceProductItem).then((result: PriceProductDO) => {
				done(new Error("Did manage to create price product with invalid tax id"));
			}).catch((e: ThError) => {
				should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
				done();
			});
		});
		it("Should not save price product with missing price per category", function (done) {
			var priceProductItem = pphelper.getDraftSavePriceProductItemDO();
			priceProductItem.price = DefaultPriceProductBuilder.getPricePerRoomCategory(pphelper.roomCategoryStat);
			priceProductItem.price.dynamicPriceList[0].priceList = [];

			var savePPItem = new SavePriceProductItem(testContext.appContext, testContext.sessionContext);
			savePPItem.save(priceProductItem).then((result: PriceProductDO) => {
				done(new Error("Did manage to create price product with invalid tax id"));
			}).catch((e: ThError) => {
				should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
				done();
			});
		});
		it("Should not save price product with invalid conditions", function (done) {
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
		it("Should not save price product with invalid filters", function (done) {
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
	describe("Price Products CRUD Tests", function () {
		it("Should save a draft price product", function (done) {
			var priceProductItem = pphelper.getDraftSavePriceProductItemDO();
			var savePPItem = new SavePriceProductItem(testContext.appContext, testContext.sessionContext);
			savePPItem.save(priceProductItem).then((priceProduct: PriceProductDO) => {
				should.equal(priceProduct.name, priceProductItem.name);
				should.equal(priceProduct.status, PriceProductStatus.Draft);
				should.equal(priceProduct.notes, priceProductItem.notes);
				should.exist(priceProduct.id);
				addedPriceProduct = priceProduct;
				done();
			}).catch((e: ThError) => {
				done(e);
			});
		});
		it("Should update the price product and mark it as Active", function (done) {
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
		it("Should get the list of Price Products", function (done) {
			var ppRepo = testContext.appContext.getRepositoryFactory().getPriceProductRepository();
			ppRepo.getPriceProductList({ hotelId: testContext.sessionContext.sessionDO.hotel.id }, { status: PriceProductStatus.Active })
				.then((searchResult: PriceProductSearchResultRepoDO) => {
					should.equal(searchResult.priceProductList.length, testDataBuilder.priceProductList.length + 1);
					done();
				}).catch((e: any) => {
					done(e);
				});
		});
		it("Should update only the Yield Filters, Notes and Dynamic Prices for the Active Price Product", function (done) {
			var priceProductItem = pphelper.getDraftSavePriceProductItemDO();
			priceProductItem["id"] = addedPriceProduct.id;
			priceProductItem.status = PriceProductStatus.Draft;
			priceProductItem.roomCategoryIdList = [];
			priceProductItem.taxIdList = [];
			priceProductItem.name = NewPriceProductName;
			priceProductItem.notes = "Updated notes for my price product!";
			priceProductItem.price = addedPriceProduct.price;

			var savePPItem = new SavePriceProductItem(testContext.appContext, testContext.sessionContext);
			savePPItem.save(priceProductItem).then((updatedPriceProduct: PriceProductDO) => {
				should.equal(updatedPriceProduct.name, addedPriceProduct.name);
				should.equal(updatedPriceProduct.status, PriceProductStatus.Active);
				should.equal(updatedPriceProduct.id, addedPriceProduct.id);
				should.equal(testUtils.stringArraysAreEqual(updatedPriceProduct.taxIdList, addedPriceProduct.taxIdList), true);
				should.equal(testUtils.stringArraysAreEqual(updatedPriceProduct.roomCategoryIdList, addedPriceProduct.roomCategoryIdList), true);
				should.equal(priceProductItem.notes, updatedPriceProduct.notes);

				addedPriceProduct = updatedPriceProduct;
				done();
			}).catch((e: ThError) => {
				done(e);
			});
		});
		it("Should attach the price product to a customer profile", function (done) {
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
		it("Should not archive the price product attached to a customer profile", function (done) {
			var archivePPItem = new ArchivePriceProductItem(testContext.appContext, testContext.sessionContext);
			archivePPItem.archive({ id: addedPriceProduct.id }).then((priceProduct: PriceProductDO) => {
				done(new Error("Managed to archive a price product attached to a customer"));
			}).catch((e: any) => {
				should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
				done();
			});
		});
		it("Should create an allotment with the price product", function (done) {
			var allotmentItem = allotmentsHelper.getSaveAllotmentItemDO(addedCompanyCustomer, addedPriceProduct);
			var saveAllotmentItem = new SaveAllotmentItem(testContext.appContext, testContext.sessionContext);
			saveAllotmentItem.save(allotmentItem).then((savedAllotment: AllotmentDO) => {
				should.exist(savedAllotment.id);
				addedAllotment = savedAllotment;
				done();
			}).catch((e: ThError) => {
				done(e);
			});
		});
		it("Should not be able to detach the price product from the customer profile if active allotment exists", function (done) {
			var companyCustDO = addedCompanyCustomer;
			companyCustDO.priceProductDetails.allowPublicPriceProducts = true;
			companyCustDO.priceProductDetails.priceProductIdList = [];
			var saveCustItem = new SaveCustomerItem(testContext.appContext, testContext.sessionContext);
			saveCustItem.save(companyCustDO).then((cust: CustomerDO) => {
				done(new Error("Did manage to detach price product from customer profile with active allotment"));
			}).catch((e: ThError) => {
				should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
				done();
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
		it("Should detach the price product from the customer profile", function (done) {
			var companyCustDO = addedCompanyCustomer;
			companyCustDO.priceProductDetails.allowPublicPriceProducts = true;
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
		it("Should archive the price product", function (done) {
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
		it("Should mark the archived price product as draft", function (done) {
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
		it("Should delete the draft price product", function (done) {
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
		it("Should update the snapshot of associated addon product when addon product data changes (e.g. price)", function (done) {
			var priceProductItem = pphelper.getDraftSavePriceProductItemDO();
			var addOnProductSnapshot = priceProductItem.includedItems.attachedAddOnProductItemList[0].addOnProductSnapshot;
			var addOnProduct = new AddOnProductDO();
			addOnProduct.id = addOnProductSnapshot.id;
			var addOnProdDO = addOnProdHelper.getSaveAddOnProductItemWithUpdatedPriceFrom(addOnProduct);
			var saveAddOnProd = new SaveAddOnProductItem(testContext.appContext, testContext.sessionContext);

			saveAddOnProd.save(addOnProdDO).then((result: AddOnProductDO) => {
				var ppRepo = testContext.appContext.getRepositoryFactory().getPriceProductRepository();
				return ppRepo.getPriceProductList({ hotelId: testContext.sessionContext.sessionDO.hotel.id },
					{
						status: PriceProductStatus.Active,
						addOnProductIdList: [addOnProduct.id]
					})
			}).then((searchResult: PriceProductSearchResultRepoDO) => {
				for (let priceProduct of searchResult.priceProductList) {
					should.equal(priceProduct.includedItems.attachedAddOnProductItemList[0].addOnProductSnapshot.price, addOnProdDO.price);
				}
				done();
			}).catch((e: any) => {
				done(e);
			});
		});
	});
	describe("Related Price Products Tests", function () {
		it("Should create a related price product", function (done) {
			// first extract the parent PP with price type `Single Price`
			let parentPriceProduct = _.find(testDataBuilder.priceProductList, pp => { return pp.price.type === PriceProductPriceType​.SinglePrice; });

			// we select a room category that does not exist in the parent PP
			let roomCategoryStats = _.find(testDataBuilder.roomCategoryStatsList, (roomCategStats) => {
				return !_.contains(parentPriceProduct.roomCategoryIdList, roomCategStats.roomCategory.id);
			});
			let childPrice = 99999;

			// create a new PP with the selected room category
			pphelper.roomCategoryStat = roomCategoryStats;
			let priceProductItem = pphelper.getDraftSavePriceProductItemDO();
			priceProductItem.name = "Related PP for " + parentPriceProduct.name;
			priceProductItem.price = DefaultPriceProductBuilder.getPricePerRoomCategory(roomCategoryStats);
			priceProductItem.price.dynamicPriceList.forEach(dynamicPrice => {
				dynamicPrice.priceList.forEach(price => {
					(<SinglePriceDO>price).price = childPrice;
				});
			});
			priceProductItem.status = PriceProductStatus.Active;
			priceProductItem.parentId = parentPriceProduct.id;

			var savePPItem = new SavePriceProductItem(testContext.appContext, testContext.sessionContext);
			savePPItem.save(priceProductItem).then((relatedPriceProduct: PriceProductDO) => {
				should.equal(testUtils.stringArraysAreEqual(relatedPriceProduct.roomCategoryIdList, parentPriceProduct.roomCategoryIdList), true,
					"The child price product should use its parent's room categories");

				should.equal(_.contains(relatedPriceProduct.roomCategoryIdList, roomCategoryStats.roomCategory.id), false,
					"The child price product should ignore the room category selected on it before creating it");

				relatedPriceProduct.price.dynamicPriceList.forEach((dynamicPrice, dynamicPriceIndex) => {
					dynamicPrice.priceList.forEach((price, priceIndex) => {
						should.equal((<SinglePriceDO>price).price, (<SinglePriceDO>parentPriceProduct.price.dynamicPriceList[dynamicPriceIndex].priceList[priceIndex]).price,
							"The related price product should have the same prices as its parent");
						should.notEqual((<SinglePriceDO>price).price, childPrice, "The related price product should ignore its initial price and use the parent's price");
						should.equal(_.contains(parentPriceProduct.roomCategoryIdList, price.getRoomCategoryId()), true,
							"The related price product's price should exist within its parent's room categories");
					});
				});
				addedPriceProduct = relatedPriceProduct;
				done();
			}).catch((e: ThError) => {
				done(e);
			});
		});

		it("Should not be able to create a Related Price Product using as a parent another Related Price Product", function (done) {
			let parentPriceProduct = addedPriceProduct;

			let priceProductItem = pphelper.getDraftSavePriceProductItemDO();
			priceProductItem.name = "Related PP for " + parentPriceProduct.name + " v2";
			priceProductItem.status = PriceProductStatus.Active;
			priceProductItem.parentId = parentPriceProduct.id;
			var savePPItem = new SavePriceProductItem(testContext.appContext, testContext.sessionContext);
			savePPItem.save(priceProductItem).then((relatedPriceProduct: PriceProductDO) => {
				done(new Error("Managed to create a related price product for another price product which is already related"));
			}).catch((e: ThError) => {
				should.equal(e.getThStatusCode(), ThStatusCode.SavePriceProductItemParentAlreadyRelated);
				done();
			});
		});

		it("Should delete the reference to the parent when the child Price Product is archived", function (done) {
			var archivePPItem = new ArchivePriceProductItem(testContext.appContext, testContext.sessionContext);
			archivePPItem.archive({ id: addedPriceProduct.id }).then((priceProduct: PriceProductDO) => {
				should.equal(priceProduct.id, addedPriceProduct.id);
				should.equal(priceProduct.status, PriceProductStatus.Archived);
				should.equal(priceProduct.hasParent(), false);
				addedPriceProduct = priceProduct;
				done();
			}).catch((e: any) => {
				done(e);
			});
		});
	});
});