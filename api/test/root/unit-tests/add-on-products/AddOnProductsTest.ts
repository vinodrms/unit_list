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
import {AddOnProductDataSource} from './helpers/AddOnProductDataSource';
import {AddOnProductListIndexer} from './helpers/AddOnProductListIndexer';
import {DefaultAddOnProductBuilder} from '../../../db-initializers/builders/DefaultAddOnProductBuilder';
import {TestUtils} from '../../../helpers/TestUtils';
import {LazyLoadMetaResponseRepoDO} from '../../../../core/data-layer/common/repo-data-objects/LazyLoadRepoDO';
import {AddOnProductSearchResultRepoDO} from '../../../../core/data-layer/add-on-products/repositories/IAddOnProductRepository';

describe("Hotel AddOn Products Tests", function() {
	var InvalidAddOnProductName = "$%&@^#*^_)(*&^%$#@!(@sau)2197<,>/;:\"}|]{)}";
	var InvalidCategoryId = "999999";
	var InvalidTaxId = "999999";

    var testContext: TestContext;
	var testDataBuilder: DefaultDataBuilder;
	var testUtils: TestUtils;

	var addOnProdHelper: AddOnProductsTestHelper;
	var addOnProdDataSource: AddOnProductDataSource;
	var addOnProdListIndexer: AddOnProductListIndexer;

	var createdAddOnProduct: AddOnProductDO;

	before(function(done: any) {
		testContext = new TestContext();
		testDataBuilder = new DefaultDataBuilder(testContext);
		testUtils = new TestUtils();

		addOnProdHelper = new AddOnProductsTestHelper(testDataBuilder, testContext);
		addOnProdDataSource = new AddOnProductDataSource(testContext);
		addOnProdListIndexer = new AddOnProductListIndexer();
		testDataBuilder.buildWithDoneCallback(done);
    });
	describe("CRUD Add On Products Flow", function() {
        it("Should not create Add On Product using invalid category id", function(done) {
			var addOnProdDO = addOnProdHelper.getValidSaveAddOnProductItemDO();
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
			var addOnProdDO = addOnProdHelper.getValidSaveAddOnProductItemDO();
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
			var addOnProdDO = addOnProdHelper.getValidSaveAddOnProductItemDO();
			var saveAddOnProd = new SaveAddOnProductItem(testContext.appContext, testContext.sessionContext);
			saveAddOnProd.save(addOnProdDO).then((result: AddOnProductDO) => {
				createdAddOnProduct = result;

				should.equal(createdAddOnProduct.categoryId, addOnProdDO.categoryId);
				should.equal(createdAddOnProduct.taxIdList.length, addOnProdDO.taxIdList.length);
				should.equal(createdAddOnProduct.name, addOnProdDO.name);
				should.equal(createdAddOnProduct.price, addOnProdDO.price);
				should.equal(createdAddOnProduct.notes, addOnProdDO.notes);
				should.exist(createdAddOnProduct.id);
				should.exist(createdAddOnProduct.hotelId);

				done();
			}).catch((e: ThError) => {
				done(e);
			});
        });

		it("Should update the added Add On Product", function(done) {
			var addOnProdDO = addOnProdHelper.getSaveAddOnProductItemDOFrom(createdAddOnProduct);
			var saveAddOnProd = new SaveAddOnProductItem(testContext.appContext, testContext.sessionContext);
			saveAddOnProd.save(addOnProdDO).then((result: AddOnProductDO) => {
				should.equal(createdAddOnProduct.id, result.id);
				createdAddOnProduct = result;
				done();
			}).catch((e: ThError) => {
				done(e);
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
				done(e);
			});
        });
	});
	describe("Read Add On Products Tests", function() {
		it("Should create " + AddOnProductDataSource.NumAddOnProducts + " Add On Products", function(done) {
			var builder = new DefaultAddOnProductBuilder(testContext);
			builder.loadAddOnProducts(addOnProdDataSource, testDataBuilder.addOnProductCategoryList, testDataBuilder.taxes)
				.then((addedAddOnProducts: AddOnProductDO[]) => {
					should.equal(addedAddOnProducts.length, AddOnProductDataSource.NumAddOnProducts);

					addOnProdListIndexer.insertAddOnProductList(testDataBuilder.addOnProductList);
					addOnProdListIndexer.insertAddOnProductList(addedAddOnProducts);

					done();
				}).catch((error: any) => {
					done(error);
				});
        });
		it("Should get the unique category id's from the Add On Products", function(done) {
			var addOnProdRepo = testContext.appContext.getRepositoryFactory().getAddOnProductRepository();
			addOnProdRepo.getAddOnProductCategoryIdList({ hotelId: testContext.sessionContext.sessionDO.hotel.id }).then((categoryIdList: string[]) => {
				var prevCategoryIdList = addOnProdListIndexer.categoryIdList;
				should.equal(categoryIdList.length, prevCategoryIdList.length);
				should.equal(testUtils.compareStringArrays(categoryIdList, prevCategoryIdList), true);
				done();
			}).catch((error: any) => {
				done(error);
			});
        });
		it("Should get all the Add On Products", function(done) {
			var addOnProdRepo = testContext.appContext.getRepositoryFactory().getAddOnProductRepository();
			addOnProdRepo.getAddOnProductList({ hotelId: testContext.sessionContext.sessionDO.hotel.id }, {})
				.then((searchResult: AddOnProductSearchResultRepoDO) => {
					should.equal(searchResult.addOnProductList.length, addOnProdListIndexer.addAllAddOnProductIdList.length);
					done();
				}).catch((error: any) => {
					done(error);
				});
        });
		it("Should get all the Add On Products With A Random Name", function(done) {
			var addOnProdRepo = testContext.appContext.getRepositoryFactory().getAddOnProductRepository();
			var randomName = addOnProdListIndexer.randomAddOnProductNameSubstring;
			addOnProdRepo.getAddOnProductList({ hotelId: testContext.sessionContext.sessionDO.hotel.id }, { name: randomName })
				.then((searchResult: AddOnProductSearchResultRepoDO) => {
					should.equal(searchResult.addOnProductList.length, addOnProdListIndexer.filterAddOnProductsByName(randomName).length);
					done();
				}).catch((error: any) => {
					done(error);
				});
        });
		it("Should get all the Add On Products With A Random Category Id", function(done) {
			var addOnProdRepo = testContext.appContext.getRepositoryFactory().getAddOnProductRepository();
			var randomCategId = addOnProdListIndexer.randomAddOnProductCategoryId;
			addOnProdRepo.getAddOnProductList({ hotelId: testContext.sessionContext.sessionDO.hotel.id }, { categoryIdList: [randomCategId] })
				.then((searchResult: AddOnProductSearchResultRepoDO) => {
					var actualAddonProducts = addOnProdListIndexer.filterAddOnProductsByCategoryId(randomCategId);
					should.equal(searchResult.addOnProductList.length, actualAddonProducts.length);
					done();
				}).catch((error: any) => {
					done(error);
				});
        });
		it("Should not get an error with invalid name regex", function(done) {
			var addOnProdRepo = testContext.appContext.getRepositoryFactory().getAddOnProductRepository();
			addOnProdRepo.getAddOnProductList({ hotelId: testContext.sessionContext.sessionDO.hotel.id }, { name: InvalidAddOnProductName })
				.then((searchResult: AddOnProductSearchResultRepoDO) => {
					should.equal(searchResult.addOnProductList.length, addOnProdListIndexer.filterAddOnProductsByName(InvalidAddOnProductName).length);
					done();
				}).catch((error: any) => {
					done(error);
				});
        });
	});
	describe("Add On Products Lazy Loading Tests", function() {
		it("Should get the count for the Add On Products", function(done) {
			var addOnProdRepo = testContext.appContext.getRepositoryFactory().getAddOnProductRepository();
			addOnProdRepo.getAddOnProductListCount({ hotelId: testContext.sessionContext.sessionDO.hotel.id }, {})
				.then((meta: LazyLoadMetaResponseRepoDO) => {
					should.equal(meta.numOfItems, addOnProdListIndexer.addAllAddOnProductIdList.length);
					done();
				}).catch((error: any) => {
					done(error);
				});
        });
		it("Should get the first page of Add On Products", function(done) {
			var addOnProdRepo = testContext.appContext.getRepositoryFactory().getAddOnProductRepository();
			addOnProdRepo.getAddOnProductList({ hotelId: testContext.sessionContext.sessionDO.hotel.id }, {}, { pageNumber: 0, pageSize: addOnProdListIndexer.lazyLoadingPageSize })
				.then((searchResult: AddOnProductSearchResultRepoDO) => {
					should.equal(searchResult.addOnProductList.length, addOnProdListIndexer.lazyLoadingPageSize);
					done();
				}).catch((error: any) => {
					done(error);
				});
        });
		it("Should get the second page of Add On Products", function(done) {
			var addOnProdRepo = testContext.appContext.getRepositoryFactory().getAddOnProductRepository();
			addOnProdRepo.getAddOnProductList({ hotelId: testContext.sessionContext.sessionDO.hotel.id }, {}, { pageNumber: 1, pageSize: addOnProdListIndexer.lazyLoadingPageSize })
				.then((searchResult: AddOnProductSearchResultRepoDO) => {
					should.equal(searchResult.addOnProductList.length, AddOnProductListIndexer.SecondPageCount);
					done();
				}).catch((error: any) => {
					done(error);
				});
        });
	});
});