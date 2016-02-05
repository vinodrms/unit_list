import {UnitPalConfig} from '../../../utils/environment/UnitPalConfig';
import {AEmailTemplateBuilder} from '../content-builder/AEmailTemplateBuilder';
import {AppContext} from '../../../utils/AppContext';
import {ResponseStatusCode, ResponseWrapper} from '../../../utils/responses/ResponseWrapper';

import async = require("async");

export class EmailSenderDO {
	destinationEmail: string;
	subject: string;
}

export abstract class AEmailSender {
	protected _emailContent: string;

	constructor(protected _unitPalConfig: UnitPalConfig, protected _emailSenderDO: EmailSenderDO, private _templateBuilder: AEmailTemplateBuilder) {
	}
	public buildEmailContentAndSendAsyncWrapper(finishBuildAndSendEmailContentCallback: { (err: ResponseWrapper, result?: string): void; }) {
		this.buildEmailContentAndSend().then((result: string) => {
			finishBuildAndSendEmailContentCallback(null, result);
		}).catch((err: ResponseWrapper) => {
			finishBuildAndSendEmailContentCallback(err);
		});
	}
	public buildEmailContentAndSend(): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			this.buildEmailContentAndSendCore(resolve, reject);
		});
	}

	private buildEmailContentAndSendCore(resolve, reject) {
		async.waterfall([
			((finishBuildEmailContentCallback) => {
				this._templateBuilder.buildEmailContentAsyncWrapper(finishBuildEmailContentCallback);
			}),
			((emailContent: string, finishSendEmailCallback) => {
				this._emailContent = emailContent;
				this.sendEmailAsyncWrapper(finishSendEmailCallback);
			})
		], ((error: any, emailSendResult: any) => {
			if (error) {
				reject(error);
			}
			else {
				resolve(emailSendResult);
			}
		}));
	}
	
	private sendEmailAsyncWrapper(finishSendEmailCallback: { (err: ResponseWrapper, emailContent?: string): void; }) {
		this.sendEmail().then((result: any) => {
			finishSendEmailCallback(null, result);
		}).catch((response: ResponseWrapper) => {
			finishSendEmailCallback(response);
		});
	}
	protected abstract sendEmail(): Promise<any>;
}