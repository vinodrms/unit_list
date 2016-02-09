require("sails-test-helper");
import should = require('should');

import {TestContext} from '../../../helpers/TestContext';
import {SendgridAccountActivationTemplate} from '../../../../core/services/email/templates/sendgrid/SendgridAccountActivationTemplate';
import {EmailTemplate} from '../../../../core/services/email/templates/EmailTemplate';
import {EmailTemplateFactory} from '../../../../core/services/email/templates/EmailTemplateFactory';
import {AEmailService, EmailHeaderDO} from '../../../../core/services/email/sender/AEmailService';
import {ErrorContainer, ErrorCode} from '../../../../core/utils/responses/ResponseWrapper';

describe("Email Integration Tests", function() {
    var emailService: AEmailService;

    before(function(done: any) {
        var testContext = new TestContext();

        var emailHeaderDO: EmailHeaderDO = {
            destinationEmail: 'dragos.pricope@gmail.com',
            subject: 'Test',
            attachments: []
        };

        var emailTemplateDO = {
            firstName: 'Dragos',
            lastName: 'Pricope',
            email: 'dragos.pricope@gmail.com',
            activationLink: 'http://google.com',
        };
        var emailTemplate:EmailTemplate = EmailTemplateFactory.getAccountActivationEmailTemplate(emailTemplateDO);
        
        this.emailService = testContext.appContext.getServiceFactory().getEmailService(emailHeaderDO, emailTemplate);
        this.emailService.sendEmail().then((result: any) => {
           
        }).catch((error: ErrorContainer) => {
            done(error);
        });

        done();
    });

    describe("Email delivery test", function() {
        it("Should successfully send an email", function(done) {
            done();
        });
    });
});