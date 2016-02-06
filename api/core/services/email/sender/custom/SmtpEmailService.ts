import {ErrorContainer, ErrorCode} from '../../../../utils/responses/ResponseWrapper';
import {Logger} from '../../../../utils/logging/Logger';
import {AEmailService} from '../AEmailService';

var email = require("emailjs");

export class SmtpEmailService extends AEmailService {
	protected sendEmail(): Promise<any> {
		return new Promise<string>((resolve, reject) => {
			this.sendEmailCore(resolve, reject);
		});
	}
	private sendEmailCore(resolve, reject) {
		var server = this.buildServerOptions(email);
		var message = this.buildEmailMessage();
		this.trySendingEmail(server, message, resolve, reject);
	}
	private buildServerOptions(emailjs: any): any {
		return emailjs.server.connect(this._unitPalConfig.getEmailProviderSettings());
	}
	private buildEmailMessage(): Object {
		var emailSettings: any = this._unitPalConfig.getEmailProviderSettings();
		return {
			text: "",
			from: emailSettings.user,
			to: this._emailMetadataDO.destinationEmail,
			subject: this._emailMetadataDO.subject,
			attachment: [{ data: this._emailContent, alternative: true }]
		};
	}
	private trySendingEmail(server: any, message: Object, resolve: any, reject: any) {
		server.send(message, ((err) => {
			if (err) {
				Logger.getInstance().logError("Error sending email", this._emailMetadataDO, err);
				reject(new ErrorContainer(ErrorCode.SmtpEmailServiceErrorSendingEmail, err));
				return;
			}
			resolve(true);
		}));
	}
}