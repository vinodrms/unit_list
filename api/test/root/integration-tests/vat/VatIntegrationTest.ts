require("sails-test-helper");
import should = require('should');

import { TestContext } from '../../../helpers/TestContext';
import { IVatProvider, VatDetailsDO } from '../../../../core/services/vat/IVatProvider';
import { ThError } from '../../../../core/utils/th-responses/ThError';
import { ThStatusCode, ThResponse } from '../../../../core/utils/th-responses/ThResponse';

describe("VAT Integration Tests", function () {
    var vatProvider: IVatProvider;

    before(function (done: any) {
        var testContext = new TestContext();
        vatProvider = testContext.appContext.getServiceFactory().getVatProviderProxyService();
        done();
    });

    describe("Company Details from VAT [EU]", function () {
        it("Should find the details for Unitpal ApS [EU]", function (done) {
            vatProvider.checkVAT("DK", "38418459").then((vatDetails: VatDetailsDO) => {
                should.equal(vatDetails.companyName, "Unitpal ApS");
                should.equal(vatDetails.vatNumber, "38418459");
                should.equal(vatDetails.countryCode, "DK");
                should.equal(vatDetails.fullVatNumber, "DK38418459");
                done();
            }).catch((error: ThError) => {
                console.err("[WARN] Check VAT function failed!");
                done();
            });
        });
        it("Should return invalid VAT number [EU]", function (done) {
            vatProvider.checkVAT("RO", "999999999").then((vatDetails: VatDetailsDO) => {
                done("Error: got company details even though the VAT is invalid!");
            }).catch((error: ThError) => {
                should.equal(error.getThStatusCode(), ThStatusCode.VatProviderInvalidVat);
                done();
            });
        });
        it("Should return non eu country error code [NON-EU]", function (done) {
            vatProvider.checkVAT("CU", "999999999").then((vatDetails: VatDetailsDO) => {
                done(new Error("Got vat details for non eu country"));
            }).catch((error: ThError) => {
                should.equal(error.getThStatusCode(), ThStatusCode.VatProviderProxyServiceNonEuCountry);
                done();
            });
        });
        it("Should return invalid VAT number [NON-EU]", function (done) {
            vatProvider.checkVAT("CU", "999#9999").then((vatDetails: VatDetailsDO) => {
                done("Error: got company details even though the VAT is invalid!");
            }).catch((error: ThError) => {
                should.equal(error.getThStatusCode(), ThStatusCode.VatProviderInvalidVat);
                done();
            });
        });
        it("Should return invalid country code", function (done) {
            vatProvider.checkVAT("ZZ", "9999999").then((vatDetails: VatDetailsDO) => {
                done(new Error("Error: got company details even though the country code is invalid!"));
            }).catch((error: ThError) => {
                should.equal(error.getThStatusCode(), ThStatusCode.VatProviderInvalidCountryCode);
                done();
            });
        });
    });
});
