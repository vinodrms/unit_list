import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {AEmailService} from '../../AEmailService';
import {SendgridTemplateFactory} from './SendgridTemplateFactory';

import _ = require("underscore");
import fs = require("fs");
import path = require("path");

export class SendgridEmailService extends AEmailService {
    private static SEND_MAIL_API_ENDPOINT = '/v3/mail/send';
    private static SEND_MAIL_HTTP_METHOD = 'POST';
    private static MAIL_CONTENT_TYPE = 'text/html';

    private _emailProviderSettings: any;
    private _emailTemplateMetadata: any;

    private _sendgridMailHelper: any;
    private _sendgridMailObject: any;
    private _sendgridMailPersonalization: any;
    private _sendgrid: any;

    public sendEmail(): Promise<boolean> {
        return new Promise<boolean>((resolve: { (result: boolean): void }, reject: { (err: ThError): void }) => {
            this.sendEmailCore(resolve, reject);
        });
    }

    private sendEmailCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
        this.init();
        this.buildSendgridMailObject();

        var requestBody = this._sendgridMailObject.toJSON();
        var request = this._sendgrid.emptyRequest();
        request.method = SendgridEmailService.SEND_MAIL_HTTP_METHOD;
        request.path = SendgridEmailService.SEND_MAIL_API_ENDPOINT;
        request.body = requestBody;
        
        this._sendgrid.API(request, function (response) {
            if (response.statusCode >= 400) {
				var thError = new ThError(ThStatusCode.SendGridServiceErrorSendingEmail, response.body);
                ThLogger.getInstance().logError(ThLogLevel.Error, "Error sending email", this._emailHeaderDO, thError);
                reject(thError);
                return;
            }
            resolve(true);
        });
    }

    private init() {
        this._emailProviderSettings = this._unitPalConfig.getEmailProviderSettings();
        this._sendgrid = require('sendgrid').SendGrid(this._emailProviderSettings.apiKey);
        this._sendgridMailHelper = require('sendgrid').mail;

        var templateFactory: SendgridTemplateFactory = new SendgridTemplateFactory();
        var emailTemplate = templateFactory.getTemplate(this._emailTemplate);
        this._emailTemplateMetadata = emailTemplate.getTemplateMetadata();
    }

    private buildSendgridMailObject() {
        this._sendgridMailObject = new this._sendgridMailHelper.Mail();
        
        // content field is mandatory, but it has no purpose
        var content = new this._sendgridMailHelper.Content(SendgridEmailService.MAIL_CONTENT_TYPE, 'content');
        this._sendgridMailObject.addContent(content);
        
        var fromEmail = new this._sendgridMailHelper.Email(this._emailProviderSettings.from);
        this._sendgridMailObject.setFrom(fromEmail);
        this._sendgridMailObject.setTemplateId(this._emailTemplateMetadata.id);

        this.buildSendgridMailPersonalization();
        this._sendgridMailObject.addPersonalization(this._sendgridMailPersonalization);
        
        this.addFileAttachmentsIfAny();
    }

    private buildSendgridMailPersonalization() {
        var toEmail = new this._sendgridMailHelper.Email(this._emailHeaderDO.destinationEmail);
        var subject = this._emailHeaderDO.subject;

        this._sendgridMailPersonalization = new this._sendgridMailHelper.Personalization();
        this._sendgridMailPersonalization.addTo(toEmail);
        this._sendgridMailPersonalization.setSubject(subject);
        this.addSubstitutionsIfAny();
    }

    private addSubstitutionsIfAny() {
        for (var tag in this._emailTemplateMetadata.subs) {
            var substitution = new this._sendgridMailHelper.Substitution(tag, this._emailTemplateMetadata.subs[tag]);
            this._sendgridMailPersonalization.addSubstitution(substitution);
        }
    }

    private addFileAttachmentsIfAny() {
        if (!_.isEmpty(this._emailHeaderDO.attachments)) {
            _.each(this._emailHeaderDO.attachments, (filePath) => {
                this._sendgridMailObject.addAttachment(this.getSendgridAttachmentObject(filePath));
            });
        }
    }

    private getSendgridAttachmentObject(filePath: string): any {
        var base64EncodedFile = this.base64Encode(filePath);
        var attachment = new this._sendgridMailHelper.Attachment();

        attachment.setContent(base64EncodedFile);
        attachment.setType("application/pdf");
        attachment.setFilename(path.posix.basename(filePath));
        return attachment;
    }

    private base64Encode(filePath): string {
        // read binary data
        var readFile = fs.readFileSync(filePath);
        // convert binary data to base64 encoded string
        return new Buffer(readFile).toString('base64');
    }
}