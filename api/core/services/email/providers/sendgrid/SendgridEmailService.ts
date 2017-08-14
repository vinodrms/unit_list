import {UnitPalConfig} from '../../../../utils/environment/UnitPalConfig';
import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {AEmailService} from '../../AEmailService';
import {BaseEmailTemplateDO} from '../../data-objects/BaseEmailTemplateDO';
import {EmailHeaderDO} from '../../IEmailService';
import {SendgridMailObjectBuilder} from './SendgridMailObject';

export class SendgridEmailService extends AEmailService {
    private static SEND_MAIL_API_ENDPOINT = '/v3/mail/send';
    private static SEND_MAIL_HTTP_METHOD = 'POST';
    
    private _emailProviderSettings: any;
    private _sendgrid: any;

    public sendEmail(emailHeaderDO: EmailHeaderDO, emailTemplate: BaseEmailTemplateDO): Promise<boolean> {
        return new Promise<boolean>((resolve: { (result: boolean): void }, reject: { (err: ThError): void }) => {
            this.sendEmailCore(resolve, reject, emailHeaderDO, emailTemplate);
        });
    }

    private sendEmailCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }, emailHeaderDO: EmailHeaderDO, emailTemplate: BaseEmailTemplateDO) {
        this.init();
        
        var sendgridMailObject = new SendgridMailObjectBuilder(this._unitPalConfig, emailHeaderDO, emailTemplate);
        var requestBody = sendgridMailObject.getSendgridMailObject().toJSON();
        var request = this._sendgrid.emptyRequest();
        request.method = SendgridEmailService.SEND_MAIL_HTTP_METHOD;
        request.path = SendgridEmailService.SEND_MAIL_API_ENDPOINT;
        request.body = requestBody;
        
        this._sendgrid.API(request, function (response) {
            if (response.statusCode >= 400) {
				var thError = new ThError(ThStatusCode.SendGridServiceErrorSendingEmail, response.body);
                ThLogger.getInstance().logError(ThLogLevel.Error, "Error sending email", emailHeaderDO, thError);
                reject(thError);
                return;
            }
            resolve(true);
        });
    }

    private init() {
        this._emailProviderSettings = this._unitPalConfig.getEmailProviderSettings();
        this._sendgrid = require('sendgrid').SendGrid(this._emailProviderSettings.apiKey);
    }
}