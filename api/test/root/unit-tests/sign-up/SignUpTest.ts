require("sails-test-helper");
import should = require('should');

import {TestContext} from '../../../helpers/TestContext';
import {ErrorContainer, ErrorCode} from '../../../../core/utils/responses/ResponseWrapper';
import {HotelSignUp, HotelSignUpDO} from '../../../../core/domain-layer/signup/HotelSignUp';

describe("Sign Up Tests", function() {
    var testContext: TestContext;
	var signUpDO: HotelSignUpDO = {
		email: "paraschiv.ionut@gmail.com",
		firstName: "Ionut Cristian",
		lastName: "Paraschiv",
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
			signUp.signUp().then((activationCode: string) => {
				should.exist(activationCode);
				done();
			}).catch((error: ErrorContainer) => {
				done(error);
			});
        });
		it("Should return account already exists error code", function(done) {
			var signUp = new HotelSignUp(testContext.appContext, testContext.sessionContext, signUpDO);
			signUp.signUp().then((activationCode: string) => {
				done("Signed up with the same email twice!");
			}).catch((error: ErrorContainer) => {
				should.equal(error.code, ErrorCode.HotelRepositoryAccountAlreadyExists);
				done();
			});
        });
    });
});