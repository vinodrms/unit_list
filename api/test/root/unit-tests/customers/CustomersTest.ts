require("sails-test-helper");
import should = require('should');
import supertest = require('supertest');
import _ = require("underscore");

import {ThError} from '../../../../core/utils/th-responses/ThError';
import {ThStatusCode} from '../../../../core/utils/th-responses/ThResponse';
import {TestContext} from '../../../helpers/TestContext';
import {DefaultDataBuilder} from '../../../db-initializers/DefaultDataBuilder';
import {TestUtils} from '../../../helpers/TestUtils';
import {CustomersTestHelper} from './helpers/CustomersTestHelper';
import {SaveCustomerItem} from '../../../../core/domain-layer/customers/SaveCustomerItem';
import {CustomerDO, CustomerType} from '../../../../core/data-layer/customers/data-objects/CustomerDO';
import {CustomerSearchResultRepoDO} from '../../../../core/data-layer/customers/repositories/ICustomerRepository';

describe("Hotel Customers Tests", function() {
	var SearchText = "testsearchtext";

	var testContext: TestContext;
	var testDataBuilder: DefaultDataBuilder;
	var testUtils: TestUtils;
	var custHelper: CustomersTestHelper;

	var addedIndividualCustomer: CustomerDO;
	var addedCompanyCustomer: CustomerDO;

	before(function(done: any) {
		testContext = new TestContext();
		testDataBuilder = new DefaultDataBuilder(testContext);
		testUtils = new TestUtils();
		custHelper = new CustomersTestHelper(testDataBuilder, testContext);
		testDataBuilder.buildWithDoneCallback(done);
    });

	describe("CRUD Customers Flow", function() {
		it("Should create an individual customer", function(done) {
			var individualCustDO = custHelper.getIndividualCustomer();
			var saveCustItem = new SaveCustomerItem(testContext.appContext, testContext.sessionContext);
			saveCustItem.save(individualCustDO).then((cust: CustomerDO) => {
				should.exist(cust.id);
				should.exist(cust.priceProductDetails.bookingCode);
				should.equal(cust.type, CustomerType.Individual);

				var custDetails: any = cust.customerDetails;
				should.equal(custDetails.firstName, individualCustDO.customerDetails.firstName);
				should.equal(custDetails.lastName, individualCustDO.customerDetails.lastName);

				addedIndividualCustomer = cust;
				done();
			}).catch((error: any) => {
				done(error);
			});
        });
		it("Should create a company", function(done) {
			var priceProductId = testUtils.getRandomListElement(testDataBuilder.priceProductList).id;
			var companyCustDO = custHelper.getCompanyCustomer(priceProductId);
			var saveCustItem = new SaveCustomerItem(testContext.appContext, testContext.sessionContext);
			saveCustItem.save(companyCustDO).then((cust: CustomerDO) => {
				should.exist(cust.id);
				should.exist(cust.priceProductDetails.bookingCode);
				should.equal(cust.type, CustomerType.Company);

				var custDetails: any = cust.customerDetails;
				should.equal(custDetails.firstName, companyCustDO.customerDetails.firstName);
				should.equal(custDetails.lastName, companyCustDO.customerDetails.lastName);

				addedCompanyCustomer = cust;
				done();
			}).catch((error: any) => {
				done(error);
			});
        });

		it("Should update the individual customer's name", function(done) {
			var individualCustDO = addedIndividualCustomer;
			individualCustDO.customerDetails['firstName'] = SearchText;

			var saveCustItem = new SaveCustomerItem(testContext.appContext, testContext.sessionContext);
			saveCustItem.save(individualCustDO).then((cust: CustomerDO) => {
				should.equal(cust.id, addedIndividualCustomer.id);
				should.equal(cust.customerDetails['firstName'], SearchText);

				addedIndividualCustomer = cust;
				done();
			}).catch((error: any) => {
				done(error);
			});
        });

		it("Should update the company's notes", function(done) {
			var companyCustDO = addedCompanyCustomer;
			companyCustDO.notes = SearchText;

			var saveCustItem = new SaveCustomerItem(testContext.appContext, testContext.sessionContext);
			saveCustItem.save(companyCustDO).then((cust: CustomerDO) => {
				should.equal(cust.id, addedCompanyCustomer.id);
				should.equal(cust.notes, SearchText);

				addedCompanyCustomer = cust;
				done();
			}).catch((error: any) => {
				done(error);
			});
        });
	});

	describe("Customers Filters And Text Index Tests", function() {
		it("Should get customers using search text", function(done) {
			var customersRepo = testContext.appContext.getRepositoryFactory().getCustomerRepository();
			customersRepo.getCustomerList({ hotelId: testContext.sessionContext.sessionDO.hotel.id }, { searchText: SearchText })
				.then((searchResult: CustomerSearchResultRepoDO) => {
					var foundCustomerList: CustomerDO[] = searchResult.customerList;
					should.equal(foundCustomerList.length >= 2, true);

					var foundIndividualCustomer = _.find(foundCustomerList, (customer: CustomerDO) => { return customer.id === addedIndividualCustomer.id });
					should.exist(foundIndividualCustomer);

					var foundCompanyCustomer = _.find(foundCustomerList, (customer: CustomerDO) => { return customer.id === addedCompanyCustomer.id });
					should.exist(foundCompanyCustomer);

					done();
				}).catch((error: any) => {
					done(error);
				});
        });
		it("Should get only Company customers using search text", function(done) {
			var customersRepo = testContext.appContext.getRepositoryFactory().getCustomerRepository();
			customersRepo.getCustomerList({ hotelId: testContext.sessionContext.sessionDO.hotel.id }, { searchText: SearchText, type: CustomerType.Company })
				.then((searchResult: CustomerSearchResultRepoDO) => {
					var foundCustomerList: CustomerDO[] = searchResult.customerList;
					should.equal(foundCustomerList.length >= 1, true);

					var foundIndividualCustomer = _.find(foundCustomerList, (customer: CustomerDO) => { return customer.id === addedIndividualCustomer.id });
					should.not.exist(foundIndividualCustomer);

					var foundCompanyCustomer = _.find(foundCustomerList, (customer: CustomerDO) => { return customer.id === addedCompanyCustomer.id });
					should.exist(foundCompanyCustomer);

					done();
				}).catch((error: any) => {
					done(error);
				});
        });
	});
});