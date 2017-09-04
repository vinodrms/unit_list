require("sails-test-helper");
import should = require('should');
import supertest = require('supertest');

import { TestContext } from '../../../helpers/TestContext';
import { ThError } from '../../../../core/utils/th-responses/ThError';
import { ThStatusCode, ThResponse } from '../../../../core/utils/th-responses/ThResponse';
import { UserDO } from '../../../../core/data-layer/hotel/data-objects/user/UserDO';
import { HotelSignUp } from '../../../../core/domain-layer/hotel-account/sign-up/HotelSignUp';
import { HotelSignUpDO } from '../../../../core/domain-layer/hotel-account/sign-up/HotelSignUpDO';
import { ActionTokenDO } from '../../../../core/data-layer/hotel/data-objects/user/ActionTokenDO';
import { UserAccountActivation } from '../../../../core/domain-layer/hotel-account/account-activation/UserAccountActivation';
import { UserAccountActivationDO } from '../../../../core/domain-layer/hotel-account/account-activation/UserAccountActivationDO';
import { UserAccountRequestResetPassword } from '../../../../core/domain-layer/hotel-account/reset-password/UserAccountRequestResetPassword';
import { UserAccountRequestResetPasswordDO } from '../../../../core/domain-layer/hotel-account/reset-password/UserAccountRequestResetPasswordDO';
import { UserAccountResetPassword } from '../../../../core/domain-layer/hotel-account/reset-password/UserAccountResetPassword';
import { UserAccountResetPasswordDO } from '../../../../core/domain-layer/hotel-account/reset-password/UserAccountResetPasswordDO';
import { UserAccountTestHelper } from "./helpers/UserAccountTestHelper";
import { HttpStatusCode } from "../../../../core/utils/http/HttpStatusCode";

import request = require('request');

describe("User Account Tests", function () {
	let testContext: TestContext;
	let helper: UserAccountTestHelper;
	let testAccountActivationToken: ActionTokenDO;

	let newPassword = "YyYyzh2718j"

	before(function (done: any) {
		testContext = new TestContext();
		helper = new UserAccountTestHelper(testContext);
		done();
	});

	describe("Check Sign Up Validations", function () {
		it("Should return invalid email error", function (done) {
			var signUpDO = helper.getSignUpDO();
			signUpDO.email = "invalidemailaggress@ns.invalid";
			var signUp = new HotelSignUp(testContext.appContext, testContext.sessionContext, signUpDO);
			signUp.signUp().then((accountActivationToken: ActionTokenDO) => {
				done(new Error("did not receive invalid email error"));
			}).catch((error: ThError) => {
				should.equal(error.getThStatusCode(), ThStatusCode.DataEmailValidationError);
				done();
			});
		});
		it("Should return invalid password error", function (done) {
			var signUpDO = helper.getSignUpDO();
			signUpDO.password = "tes111111";
			var signUp = new HotelSignUp(testContext.appContext, testContext.sessionContext, signUpDO);
			signUp.signUp().then((accountActivationToken: ActionTokenDO) => {
				done(new Error("did not receive invalid password error because no upper case was in the password"));
			}).catch((error: ThError) => {
				should.equal(error.getThStatusCode(), ThStatusCode.DataPasswordValidationError);
				done();
			});
		});
		it("Should return invalid password error", function (done) {
			var signUpDO = helper.getSignUpDO();
			signUpDO.password = "TEST111111";
			var signUp = new HotelSignUp(testContext.appContext, testContext.sessionContext, signUpDO);
			signUp.signUp().then((accountActivationToken: ActionTokenDO) => {
				done(new Error("did not receive invalid password error because no lower case was in the password"));
			}).catch((error: ThError) => {
				should.equal(error.getThStatusCode(), ThStatusCode.DataPasswordValidationError);
				done();
			});
		});
		it("Should return invalid password error", function (done) {
			var signUpDO = helper.getSignUpDO();
			signUpDO.password = "TESTtest";
			var signUp = new HotelSignUp(testContext.appContext, testContext.sessionContext, signUpDO);
			signUp.signUp().then((accountActivationToken: ActionTokenDO) => {
				done(new Error("did not receive invalid password error because no digits were in the password"));
			}).catch((error: ThError) => {
				should.equal(error.getThStatusCode(), ThStatusCode.DataPasswordValidationError);
				done();
			});
		});
		it("Should return invalid password error", function (done) {
			var signUpDO = helper.getSignUpDO();
			signUpDO.password = "Tt221";
			var signUp = new HotelSignUp(testContext.appContext, testContext.sessionContext, signUpDO);
			signUp.signUp().then((accountActivationToken: ActionTokenDO) => {
				done(new Error("did not receive invalid password error because the password length is to small"));
			}).catch((error: ThError) => {
				should.equal(error.getThStatusCode(), ThStatusCode.DataPasswordValidationError);
				done();
			});
		});
	});

	describe("Check Sign Up", function () {
		it("Should return an activation code", function (done) {
			var signUpDO = helper.getSignUpDO();
			var signUp = new HotelSignUp(testContext.appContext, testContext.sessionContext, signUpDO);
			signUp.signUp().then((accountActivationToken: ActionTokenDO) => {
				testAccountActivationToken = accountActivationToken;
				should.exist(accountActivationToken.code);
				should.exist(accountActivationToken.expiryTimestamp);
				done();
			}).catch((error: ThError) => {
				done(error._nativeError);
			});
		});
		it("Should return account already exists error code", function (done) {
			var signUpDO = helper.getSignUpDO();
			var signUp = new HotelSignUp(testContext.appContext, testContext.sessionContext, signUpDO);
			signUp.signUp().then((accountActivationToken: ActionTokenDO) => {
				done(new Error("Signed up with the same email twice!"));
			}).catch((error: ThError) => {
				should.equal(error.getThStatusCode(), ThStatusCode.HotelRepositoryAccountAlreadyExists);
				done();
			});
		});
	});
	describe("Check Account Activation", function () {
		it("Should not be able to log in using the unactivated account", function (done) {
			
			var userData = helper.getSignUpDO();

			request(helper.getLoginRequestOptions(userData.email, userData.password), (err, res, body) => {
				if (res.statusCode !== HttpStatusCode.Ok) {
					done();
				}
				else {
					done(err? err : "Login was successful");
				}
			});
		});
		it("Should not activate the account using the wrong token", function (done) {
			var activationDataDO: UserAccountActivationDO = {
				activationCode: testAccountActivationToken.code + "12334",
				email: helper.getSignUpDO().email
			};
			var accountActivation = new UserAccountActivation(testContext.appContext, testContext.sessionContext, activationDataDO);
			accountActivation.activate().then((user: UserDO) => {
				done(new Error("activated the account using wrong token"));
			}).catch((error: ThError) => {
				done();
			});
		});
		it("Should activate the account", function (done) {
			
			var activationDataDO: UserAccountActivationDO = {
				activationCode: testAccountActivationToken.code,
				email: helper.getSignUpDO().email
			};
			var accountActivation = new UserAccountActivation(testContext.appContext, testContext.sessionContext, activationDataDO);
			accountActivation.activate().then((user: UserDO) => {
				var signUpData = helper.getSignUpDO();
				should.equal(user.email, signUpData.email);
				should.notEqual(user.password, signUpData.password);
				should.equal(user.contactDetails.firstName, signUpData.firstName);
				should.equal(user.contactDetails.lastName, signUpData.lastName);
				done();
			}).catch((error: ThError) => {
				done(error._nativeError);
			});
		});
		it("Should not be able to activate the account twice", function (done) {
			
			var activationDataDO: UserAccountActivationDO = {
				activationCode: testAccountActivationToken.code,
				email: helper.getSignUpDO().email
			};
			var accountActivation = new UserAccountActivation(testContext.appContext, testContext.sessionContext, activationDataDO);
			accountActivation.activate().then((user: UserDO) => {
				done(new Error("Did activate the account twice using the same activation code"));
			}).catch((error: ThError) => {
				done();
			});
		});
		it("Should log in using the activated account", function (done) {
			
			var userData = helper.getSignUpDO();

			request(helper.getLoginRequestOptions(userData.email, userData.password), (err, res, body) => {
				if (res.statusCode === HttpStatusCode.Ok) {
					done();
				}
				else {
					done(err? err : "Login Failed");
				}
			});

		});
	});

	describe("Check Reset Password Flow", function () {
		it("Should return an activation code to request the password", function (done) {
			var reqPasswdDO: UserAccountRequestResetPasswordDO = {
				email: helper.getSignUpDO().email
			}
			var requestReset = new UserAccountRequestResetPassword(testContext.appContext, testContext.sessionContext, reqPasswdDO);
			requestReset.requestResetPassword().then((accountActivationToken: ActionTokenDO) => {
				testAccountActivationToken = accountActivationToken;
				should.exist(accountActivationToken.code);
				should.exist(accountActivationToken.expiryTimestamp);
				done();
			}).catch((error: ThError) => {
				done(error._nativeError);
			});
		});
		it("Should return another activation code to request the password", function (done) {
			var reqPasswdDO: UserAccountRequestResetPasswordDO = {
				email: helper.getSignUpDO().email
			}
			var requestReset = new UserAccountRequestResetPassword(testContext.appContext, testContext.sessionContext, reqPasswdDO);
			requestReset.requestResetPassword().then((accountActivationToken: ActionTokenDO) => {
				testAccountActivationToken = accountActivationToken;
				should.exist(accountActivationToken.code);
				should.exist(accountActivationToken.expiryTimestamp);
				done();
			}).catch((error: ThError) => {
				done(error._nativeError);
			});
		});
		it("Should log in using the old password even though we requested a reset", function (done) {
			var userData = helper.getSignUpDO();
			
			request(helper.getLoginRequestOptions(userData.email, userData.password), (err, res, body) => {
				if (res.statusCode === HttpStatusCode.Ok) {
					done();
				}
				else {
					done(err? err : "Login Failed");
				}
			});
		});
		it("Should not change the password using wrong activation code", function (done) {
			var resetPasswdDO: UserAccountResetPasswordDO = {
				email: helper.getSignUpDO().email,
				activationCode: testAccountActivationToken.code + "Wrong",
				password: newPassword
			}
			var resetReset = new UserAccountResetPassword(testContext.appContext, testContext.sessionContext, resetPasswdDO);
			resetReset.resetPassword().then((user: UserDO) => {
				done(new Error("Managed to reset the password using wrong activation code"));
			}).catch((error: ThError) => {
				done();
			});
		});
		it("Should change the password", function (done) {
			var resetPasswdDO: UserAccountResetPasswordDO = {
				email: helper.getSignUpDO().email,
				activationCode: testAccountActivationToken.code,
				password: newPassword
			}
			var resetReset = new UserAccountResetPassword(testContext.appContext, testContext.sessionContext, resetPasswdDO);
			resetReset.resetPassword().then((user: UserDO) => {
				var signUpData = helper.getSignUpDO();
				should.equal(user.email, signUpData.email);
				should.notEqual(user.password, signUpData.password);
				should.equal(user.contactDetails.firstName, signUpData.firstName);
				should.equal(user.contactDetails.lastName, signUpData.lastName);
				done();
			}).catch((error: ThError) => {
				done(error._nativeError);
			});
		});
		it("Should not change the password twice using the same activation code", function (done) {
			var resetPasswdDO: UserAccountResetPasswordDO = {
				email: helper.getSignUpDO().email,
				activationCode: testAccountActivationToken.code,
				password: newPassword
			}
			var resetReset = new UserAccountResetPassword(testContext.appContext, testContext.sessionContext, resetPasswdDO);
			resetReset.resetPassword().then((user: UserDO) => {
				done(new Error("Managed to reset the password twice using wrong the same reset password activation code"));
			}).catch((error: ThError) => {
				done();
			});
		});
		it("Should not be able to log in using the old password", function (done) {
			var userData = helper.getSignUpDO();
			
			request(helper.getLoginRequestOptions(userData.email, userData.password), (err, res, body) => {
				if (res.statusCode !== HttpStatusCode.Ok) {
					done();
				}
				else {
					done(err? err : "Login was successful");
				}
			});
		});
		it("Should log in using the new password", function (done) {
			var userData = helper.getSignUpDO();
			
			request(helper.getLoginRequestOptions(userData.email, newPassword), (err, res, body) => {
				if (res.statusCode === HttpStatusCode.Ok) {
					done();
				}
				else {
					done(err? err : "Login Failed");
				}
			});
		});
	});
});