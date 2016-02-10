require("sails-test-helper");
import should = require('should');

import {TestContext} from '../../../helpers/TestContext';
import {AEmailService, EmailHeaderDO} from '../../../../core/services/email/AEmailService';
import {AccountActivationEmailTemplateDO} from '../../../../core/services/email/data-objects/AccountActivationEmailTemplateDO';

describe("Email Integration Tests", function() {
    var testContext;
    var emailService: AEmailService;

    before(function(done: any) {
		testContext = new TestContext();
        var emailHeaderDO: EmailHeaderDO = {
            destinationEmail: 'dragos.pricope@gmail.com',
            subject: 'Test',
            attachments: []
        };

        var emailTemplateDO: AccountActivationEmailTemplateDO = new AccountActivationEmailTemplateDO();
        emailTemplateDO.activationLink = 'http://google.com';
        emailTemplateDO.firstName = 'Dragos';
        emailTemplateDO.lastName = 'Pricope';
        emailTemplateDO.email = 'dragos.pricope@gmail.com';

        this.emailService = testContext.appContext.getServiceFactory().getEmailService(emailHeaderDO, emailTemplateDO);
        this.emailService.sendEmail().then((result: any) => {
            done();
        }).catch((error: any) => {
            done(error);
        });
    });

    describe("Email delivery test", function() {
        it("Should successfully send an email", function(done) {
            done();
        });
    });
});