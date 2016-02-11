require("sails-test-helper");
import should = require('should');

import {TestContext} from '../../../helpers/TestContext';
import {IVatProvider} from '../../../../core/services/vat/IVatProvider';
import {VatDetailsDO} from '../../../../core/services/vat/VatDetailsDO';
import {ThError} from '../../../../core/utils/th-responses/ThError';
import {ThStatusCode, ThResponse} from '../../../../core/utils/th-responses/ThResponse';

describe("VAT Integration Tests", function() {
	var vatProvider: IVatProvider;

    before(function(done: any) {
		var testContext = new TestContext();
		vatProvider = testContext.appContext.getServiceFactory().getVatProvider();
		done();
    });

    describe("Company Details from VAT", function() {
        it("Should find the details for Threeangle Software", function(done) {
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
		it("Should return invalid company", function(done) {
			vatProvider.checkVAT("RO", "999999999").then((vatDetails: VatDetailsDO) => {
				done("Error: got company details even though the VAT is incorrect!");
			}).catch((error: ThError) => {
				should.equal(error.getThStatusCode(), ThStatusCode.VatProviderInvalidVat);
				done();
			});
		});
    });
});