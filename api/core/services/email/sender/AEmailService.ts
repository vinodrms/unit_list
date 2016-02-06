import {UnitPalConfig} from '../../../utils/environment/UnitPalConfig';
import {IEmailTemplateBuilder} from '../content-builder/IEmailTemplateBuilder';
import {AppContext} from '../../../utils/AppContext';

import async = require("async");

export class EmailMetadataDO {
	destinationEmail: string;
	subject: string;
}

export abstract class AEmailService {
	protected _emailContent: string;

	constructor(protected _unitPalConfig: UnitPalConfig, protected _emailMetadataDO: EmailMetadataDO, private _templateBuilder: IEmailTemplateBuilder) {
	}
	public buildEmailContentAndSendAsyncWrapper(finishBuildAndSendEmailContentCallback: { (err: any, result?: string): void; }) {
		this.buildEmailContentAndSend().then((result: string) => {
			finishBuildAndSendEmailContentCallback(null, result);
		}).catch((err: any) => {
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

	private sendEmailAsyncWrapper(finishSendEmailCallback: { (err: any, emailContent?: string): void; }) {
		this.sendEmail().then((result: any) => {
			finishSendEmailCallback(null, result);
		}).catch((response: any) => {
			finishSendEmailCallback(response);
		});
	}
	protected abstract sendEmail(): Promise<any>;
}