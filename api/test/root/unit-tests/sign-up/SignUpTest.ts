require("sails-test-helper");
import should = require('should');

import {TestContext} from '../../../helpers/TestContext';
import {ThError} from '../../../../core/utils/th-responses/ThError';
import {ThStatusCode, ThResponse} from '../../../../core/utils/th-responses/ThResponse';
import {HotelSignUp, HotelSignUpDO} from '../../../../core/domain-layer/hotel-account/HotelSignUp';
import {ActionTokenDO} from '../../../../core/data-layer/hotel/data-objects/user/ActionTokenDO';

describe("Sign Up Tests", function() {
    var testContext: TestContext;
	var signUpDO: HotelSignUpDO = {
		email: "dragos.pricope@gmail.com",
		firstName: "Dragos",
		lastName: "Pricope",
		hotelName: "3angleTECH Hotel",
		password: "1234"
	};

	before(function(done: any) {
		testContext = new TestContext();
		done();
    });

    describe("Check Sign Up", function() {
        it("Should return an activation code", function(done) {
			var signUp = new HotelSignUp(testContext.appContext, testContext.sessionContext, signUpDO);
			signUp.signUp().then((accountActivationToken: ActionTokenDO) => {
				should.exist(accountActivationToken.code);
				should.exist(accountActivationToken.expiryTimestamp);
				done();
			}).catch((error: ThError) => {
				done(error);
			});
        });
		it("Should return account already exists error code", function(done) {
			var signUp = new HotelSignUp(testContext.appContext, testContext.sessionContext, signUpDO);
			signUp.signUp().then((accountActivationToken: ActionTokenDO) => {
				done("Signed up with the same email twice!");
			}).catch((error: ThError) => {
				should.equal(error.getThStatusCode(), ThStatusCode.HotelRepositoryAccountAlreadyExists);
				done();
			});
        });
    });
});