require("sails-test-helper");
import should = require('should');

import {TestContext} from '../../../helpers/TestContext';
import {IVatProvider, VatDetailsDO} from '../../../../core/services/vat/IVatProvider';
import {ThError} from '../../../../core/utils/th-responses/ThError';
import {ThStatusCode, ThResponse} from '../../../../core/utils/th-responses/ThResponse';

describe("VAT Integration Tests", function() {
	var vatProvider: IVatProvider;

    before(function(done: any) {
		var testContext = new TestContext();
		vatProvider = testContext.appContext.getServiceFactory().getVatProviderProxyService();
		done();
    });

    describe("Company Details from VAT [EU]", function() {
        it("Should find the details for Threeangle Software [EU]", function(done) {
            vatProvider.checkVAT("RO", "34121562").then((vatDetails: VatDetailsDO) => {
				should.equal(vatDetails.getCompanyName(), "THREEANGLE SOFTWARE SOLUTIONS SRL");
				should.equal(vatDetails.getVatNumber(), "34121562");
				should.equal(vatDetails.getCountryCode(), "RO");
				should.equal(vatDetails.getFullVatNumber(), "RO34121562");
				done();
			}).catch((error: ThError) => {
				done(error);
			});
        });
		it("Should return invalid VAT number [EU]", function(done) {
			vatProvider.checkVAT("RO", "999999999").then((vatDetails: VatDetailsDO) => {
				done("Error: got company details even though the VAT is invalid!");
			}).catch((error: ThError) => {
				should.equal(error.getThStatusCode(), ThStatusCode.VatProviderInvalidVat);
				done();
			});
		});
        it("Should return non eu country error code [NON-EU]", function(done) {
			vatProvider.checkVAT("CU", "999999999").then((vatDetails: VatDetailsDO) => {
                done(new Error("Got vat details for non eu country"));
			}).catch((error: ThError) => {
				should.equal(error.getThStatusCode(), ThStatusCode.VatProviderProxyServiceNonEuCountry);
				done();
			});
		});
        it("Should return invalid VAT number [NON-EU]", function(done) {
			vatProvider.checkVAT("CU", "999#9999").then((vatDetails: VatDetailsDO) => {
				done("Error: got company details even though the VAT is invalid!");
			}).catch((error: ThError) => {
				should.equal(error.getThStatusCode(), ThStatusCode.VatProviderInvalidVat);
				done();
			});
		});
        it("Should return invalid country code", function(done) {
			vatProvider.checkVAT("ZZ", "9999999").then((vatDetails: VatDetailsDO) => {
				done("Error: got company details even though the country code is invalid!");
			}).catch((error: ThError) => {
				should.equal(error.getThStatusCode(), ThStatusCode.VatProviderInvalidCountryCode);
				done();
			});
		});
    });
});