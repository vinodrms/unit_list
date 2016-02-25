require("sails-test-helper");
import should = require('should');
import supertest = require('supertest');
import _ = require("underscore");

import {ThError} from '../../../../core/utils/th-responses/ThError';
import {ThStatusCode} from '../../../../core/utils/th-responses/ThResponse';
import {DefaultDataBuilder} from '../../../db-initializers/DefaultDataBuilder';
import {TestContext} from '../../../helpers/TestContext';
import {AddOnProductsTestHelper} from './helpers/AddOnProductsTestHelper';
import {AddOnProductDO, AddOnProductStatus} from '../../../../core/data-layer/add-on-products/data-objects/AddOnProductDO';
import {SaveAddOnProductItem} from '../../../../core/domain-layer/add-on-products/SaveAddOnProductItem';
import {DeleteAddOnProductItem, DeleteAddOnProductItemDO} from '../../../../core/domain-layer/add-on-products/DeleteAddOnProductItem';

describe("Hotel AddOn Products Tests", function() {
	var InvalidCategoryId = "999999";
	var InvalidTaxId = "999999";

    var testContext: TestContext;
	var testDataBuilder: DefaultDataBuilder;
	var taxesHelper: AddOnProductsTestHelper;

	var createdAddOnProduct: AddOnProductDO;

	before(function(done: any) {
		testContext = new TestContext();
		testDataBuilder = new DefaultDataBuilder(testContext);
		taxesHelper = new AddOnProductsTestHelper(testDataBuilder, testContext);
		testDataBuilder.buildWithDoneCallback(done);
    });
	describe("CRUD Add On Products Flow", function() {
        it("Should not create Add On Product using invalid category id", function(done) {
			var addOnProdDO = taxesHelper.getValidSaveAddOnProductItemDO();
			addOnProdDO.categoryId = InvalidCategoryId;
			var saveAddOnProd = new SaveAddOnProductItem(testContext.appContext, testContext.sessionContext);
			saveAddOnProd.save(addOnProdDO).then((result: AddOnProductDO) => {
				done(new Error("Managed to craete add on product with invalid category id"));
			}).catch((e: ThError) => {
				should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
				done();
			});
        });
		it("Should not create Add On Product using invalid tax id", function(done) {
			var addOnProdDO = taxesHelper.getValidSaveAddOnProductItemDO();
			addOnProdDO.taxIdList.push("InvalidTaxId");
			var saveAddOnProd = new SaveAddOnProductItem(testContext.appContext, testContext.sessionContext);
			saveAddOnProd.save(addOnProdDO).then((result: AddOnProductDO) => {
				done(new Error("Managed to craete add on product with invalid tax id"));
			}).catch((e: ThError) => {
				should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
				done();
			});
        });
		it("Should create Add On Product", function(done) {
			var addOnProdDO = taxesHelper.getValidSaveAddOnProductItemDO();
			var saveAddOnProd = new SaveAddOnProductItem(testContext.appContext, testContext.sessionContext);
			saveAddOnProd.save(addOnProdDO).then((result: AddOnProductDO) => {
				createdAddOnProduct = result;

				should.equal(createdAddOnProduct.categoryId, addOnProdDO.categoryId);
				should.equal(createdAddOnProduct.taxIdList.length, addOnProdDO.taxIdList.length);
				should.equal(createdAddOnProduct.name, addOnProdDO.name);
				should.equal(createdAddOnProduct.price, addOnProdDO.price);
				should.equal(createdAddOnProduct.description, addOnProdDO.description);
				should.exist(createdAddOnProduct.id);
				should.exist(createdAddOnProduct.hotelId);

				done();
			}).catch((e: ThError) => {
				should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
				done();
			});
        });

		it("Should update the added Add On Product", function(done) {
			var addOnProdDO = taxesHelper.getSaveAddOnProductItemDOFrom(createdAddOnProduct);
			var saveAddOnProd = new SaveAddOnProductItem(testContext.appContext, testContext.sessionContext);
			saveAddOnProd.save(addOnProdDO).then((result: AddOnProductDO) => {
				should.equal(createdAddOnProduct.id, result.id);
				createdAddOnProduct = result;
				done();
			}).catch((e: ThError) => {
				should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
				done();
			});
        });

		it("Should delete the Add On Product", function(done) {
			var deleteAddOnProd = new DeleteAddOnProductItem(testContext.appContext, testContext.sessionContext);
			deleteAddOnProd.delete({ id: createdAddOnProduct.id }).then((result: AddOnProductDO) => {
				should.equal(createdAddOnProduct.id, result.id);
				should.equal(AddOnProductStatus.Deleted, result.status);
				createdAddOnProduct = result;
				done();
			}).catch((e: ThError) => {
				should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
				done();
			});
        });
	});
});