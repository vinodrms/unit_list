import {ResponseStatusCode, ResponseWrapper} from '../../../../utils/responses/ResponseWrapper';
import {AEmailSender, EmailSenderDO} from '../AEmailSender';

var email = require("emailjs");

export class SmtpEmailSender extends AEmailSender {
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
			to: this._emailSenderDO.destinationEmail,
			subject: this._emailSenderDO.subject,
			attachment: [{ data: this._emailContent, alternative: true }]
		};
	}
	private trySendingEmail(server: any, message: Object, resolve: any, reject: any) {
		server.send(message, ((err) => {
			if (err) {
				reject(new ResponseWrapper(ResponseStatusCode.SmtpEmailSenderErrorSendingEmail));
				return;
			}
			resolve(true);
		}));
	}
}