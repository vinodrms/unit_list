import {AEmailService} from '../../AEmailService';
import {ErrorContainer, ErrorCode} from '../../../../utils/responses/ResponseWrapper';
import {Logger, LogLevel} from '../../../../utils/logging/Logger';
import {SendgridTemplateFactory} from './SendgridTemplateFactory';

import sendgrid = require("sendgrid");
import _ = require("underscore");

export class SendgridEmailService extends AEmailService {

    protected sendEmail(): Promise<any> {
        return new Promise<string>((resolve, reject) => {
            this.sendEmailCore(resolve, reject);
        });
    }

    private sendEmailCore(resolve, reject) {
        var server = this.initServer(sendgrid);
        var message = this.buildEmailMessage(server);
        this.trySendingEmail(server, message, resolve, reject);
    }

    private initServer(sendgrid: any): any {
        var emailProviderSettings: any = this._unitPalConfig.getEmailProviderSettings();
        return sendgrid(emailProviderSettings.apiKey);
    }

    private buildEmailMessage(server: any): any {
        var templateFactory: SendgridTemplateFactory = new SendgridTemplateFactory();
        var emailTemplate = templateFactory.getTemplate(this._emailTemplate);
        var emailTemplateMetadata = emailTemplate.getTemplateMetadata();
        var sendgridEmail = new server.Email(this.getSendgridEmailInitData());

        for (var tag in emailTemplateMetadata.subs) {
            sendgridEmail.addSubstitution(tag, emailTemplateMetadata.subs[tag]);
        }
        
        sendgridEmail.setFilters({
            templates: {
                settings: {
                    enable: 1,
                    template_id: emailTemplateMetadata.id
                }
            }
        });

        return sendgridEmail;
    }
    
    private getSendgridEmailInitData() {
        var emailSettings: any = this._unitPalConfig.getEmailProviderSettings();
        
        var sendgridEmailInitData = {
            to: this._emailHeaderDO.destinationEmail,
            from: emailSettings.from,
            subject: this._emailHeaderDO.subject,
            files: [],
            html: `<p></p>`
        };
        
        if(!_.isEmpty(this._emailHeaderDO.attachments)) {
            _.each(this._emailHeaderDO.attachments, (fileName) => {
                sendgridEmailInitData.files.push({
                    filename: fileName, 
                    content: 'data'
                });
            });
        }
        
        return sendgridEmailInitData;
    }
    
    private trySendingEmail(server: any, message: Object, resolve: any, reject: any) {
        server.send(message, ((err, json) => {
            if (err) {
                Logger.getInstance().logError(LogLevel.Error, "Error sending email", this._emailHeaderDO, err);
                reject(new ErrorContainer(ErrorCode.SmtpEmailServiceErrorSendingEmail, err));
                return;
            }
            resolve(true);
        }));
    }
}