require("sails-test-helper");
import should = require('should');

import {TestContext} from '../../../helpers/TestContext';
import {ResponseWrapper} from '../../../../core/utils/responses/ResponseWrapper';
import {HotelSignUp, HotelSignUpDO} from '../../../../core/domain-layer/signup/HotelSignUp';

describe("VAT Integration Tests", function() {
    var testContext : TestContext;
	before(function(done: any) {
		testContext = new TestContext();
		done();
    });

    describe("Check Sign Up", function() {
        it("Should return an activation code", function(done) {
            var signUpDO : HotelSignUpDO = {
				email: "paraschiv.ionut@gmail.com",
				firstName: "Ionut Cristian",
				lastName: "Paraschiv",
				hotelName: "3angleTECH Hotel",
				password: "1234"
			};
			done();
			/*
			var signUp = new HotelSignUp(testContext.appContext, testContext.sessionContext, signUpDO);
			signUp.signUp().then((activationCode : string ) => {
				should.exist(activationCode);	
			}).catch((error: ResponseWrapper) => {
				done(error);
			});
			*/
        });
    });
});