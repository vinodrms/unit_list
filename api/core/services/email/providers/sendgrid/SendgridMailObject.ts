import {UnitPalConfig} from '../../../../utils/environment/UnitPalConfig';
import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {AEmailService} from '../../AEmailService';
import {SendgridTemplateFactory} from './SendgridTemplateFactory';
import {BaseEmailTemplateDO} from '../../data-objects/BaseEmailTemplateDO';
import {EmailHeaderDO} from '../../IEmailService';

import _ = require("underscore");
import fs = require("fs");
import path = require("path");

export class SendgridMailObjectBuilder {
    private static MAIL_CONTENT_TYPE = 'text/html';

    private _sendgridMailHelper: any;
    private _sendgridMailObject: any;
    private _sendgridMailPersonalization: any;
    
    private _emailTemplateMetadata: any;
    private _emailProviderSettings: any;

    constructor(protected _unitPalConfig: UnitPalConfig, private _emailHeaderDO: EmailHeaderDO, private _emailTemplate: BaseEmailTemplateDO) {
        this._sendgridMailHelper = require('sendgrid').mail;
        this._sendgridMailObject = new this._sendgridMailHelper.Mail();
        this._sendgridMailPersonalization = new this._sendgridMailHelper.Personalization();

        
        var templateFactory: SendgridTemplateFactory = new SendgridTemplateFactory();
        var sendgridEmailTemplate = templateFactory.getTemplate(this._emailTemplate);
        
        this._emailTemplateMetadata = sendgridEmailTemplate.getTemplateMetadata();
        this._emailProviderSettings = this._unitPalConfig.getEmailProviderSettings();
    }

    public getSendgridMailObject(): any {
        this._sendgridMailObject = new this._sendgridMailHelper.Mail();
        
        // content field is mandatory, but it has no purpose
        var content = new this._sendgridMailHelper.Content(SendgridMailObjectBuilder.MAIL_CONTENT_TYPE, 'content');
        this._sendgridMailObject.addContent(content);
        
        var fromEmail = new this._sendgridMailHelper.Email(this._emailProviderSettings.from);
        this._sendgridMailObject.setFrom(fromEmail);
        this._sendgridMailObject.setTemplateId(this._emailTemplateMetadata.id);

        this.buildSendgridMailPersonalization(this._emailHeaderDO);
        this._sendgridMailObject.addPersonalization(this._sendgridMailPersonalization);
        
        this.addFileAttachmentsIfAny(this._emailHeaderDO);

        return this._sendgridMailObject;
    }

    private buildSendgridMailPersonalization(emailHeaderDO: EmailHeaderDO) {
        _.forEach(emailHeaderDO.to, (emailAddress: string) => {
            this._sendgridMailPersonalization.addTo(new this._sendgridMailHelper.Email(emailAddress));
        });
        _.forEach(emailHeaderDO.cc, (emailAddress: string) => {
            this._sendgridMailPersonalization.addCc(new this._sendgridMailHelper.Email(emailAddress));
        });
        _.forEach(emailHeaderDO.bcc, (emailAddress: string) => {
            this._sendgridMailPersonalization.addBcc(new this._sendgridMailHelper.Email(emailAddress));
        });
        var subject = emailHeaderDO.subject;
        this._sendgridMailPersonalization.setSubject(subject);

        this.addSubstitutionsIfAny();
    }

    private addSubstitutionsIfAny() {
        for (var tag in this._emailTemplateMetadata.subs) {
            var substitution = new this._sendgridMailHelper.Substitution(tag, this._emailTemplateMetadata.subs[tag]);
            this._sendgridMailPersonalization.addSubstitution(substitution);
        }
    }

    private addFileAttachmentsIfAny(emailHeaderDO: EmailHeaderDO) {
        if (!_.isEmpty(emailHeaderDO.attachments)) {
            _.each(emailHeaderDO.attachments, (filePath) => {
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