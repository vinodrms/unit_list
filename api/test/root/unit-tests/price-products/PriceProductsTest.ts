require("sails-test-helper");
import should = require('should');
import supertest = require('supertest');
import _ = require("underscore");

import {ThError} from '../../../../core/utils/th-responses/ThError';
import {ThStatusCode} from '../../../../core/utils/th-responses/ThResponse';
import {DefaultDataBuilder} from '../../../db-initializers/DefaultDataBuilder';
import {TestContext} from '../../../helpers/TestContext';
import {TestUtils} from '../../../helpers/TestUtils';
import {PriceProductsHelper} from './helpers/PriceProductsHelper';
import {RoomCategoryStatsDO} from '../../../../core/data-layer/room-categories/data-objects/RoomCategoryStatsDO';
import {SavePriceProductItem} from '../../../../core/domain-layer/price-products/SavePriceProductItem';
import {PriceProductDO} from '../../../../core/data-layer/price-products/data-objects/PriceProductDO';
import {PriceProductStatus} from '../../../../core/data-layer/price-products/data-objects/PriceProductDO';
import {PriceProductCancellationPolicyType} from '../../../../core/data-layer/price-products/data-objects/conditions/cancellation/IPriceProductCancellationPolicy';
import {PriceProductCancellationPenaltyType} from '../../../../core/data-layer/price-products/data-objects/conditions/penalty/IPriceProductCancellationPenalty';

describe("Hotel Price Products Tests", function() {
	var InvalidRoomCategoryId = "12121221211";
	var InvalidAddOnProductId = "12121221211";
	var InvalidTaxId = "12121221211";
	var NewPriceProductName = "12121221211";

	var testContext: TestContext;
	var testDataBuilder: DefaultDataBuilder;
	var testUtils: TestUtils;

	var pphelper: PriceProductsHelper;

	var addedPriceProduct: PriceProductDO;

	before(function(done: any) {
		testContext = new TestContext();
		testDataBuilder = new DefaultDataBuilder(testContext);
		testUtils = new TestUtils();
		pphelper = new PriceProductsHelper(testDataBuilder, testContext);

		testDataBuilder.buildWithDoneCallback(done);
    });

	describe("Price Products Validation Tests", function() {
        it("Should index the default category for the price product", function(done) {
			pphelper.indexRoomCategory().then((roomStatList: RoomCategoryStatsDO[]) => {
				var categoryStat: RoomCategoryStatsDO = _.find(roomStatList, (roomStat: RoomCategoryStatsDO) => { return roomStat.roomCategory.id === pphelper.getRoomCategoryId() });
				pphelper.roomCategoryStat = categoryStat;

				should.equal(roomStatList.length > 0, true);
				should.exist(categoryStat);
				done();
			}).catch((error: any) => {
				done(error);
			});
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
			priceProductItem.price = pphelper.getPricePerPerson();
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
			priceProductItem.price = pphelper.getPricePerRoomCategory();
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
	});

});