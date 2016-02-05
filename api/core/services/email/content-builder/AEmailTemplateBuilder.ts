import {ResponseStatusCode, ResponseWrapper} from '../../../utils/responses/ResponseWrapper';

import path = require('path');
import extend = require('extend');
var EmailTemplates = require('swig-email-templates');

export class EmailTemplateDO {
	destinationEmail: string;
	subject: string;
}

export abstract class AEmailTemplateBuilder {
	private static HtmlPath = "custom/html";

	constructor(protected _emailTemplateDO: EmailTemplateDO) {
	}
	protected abstract getHtmlName(): string;
	protected abstract getContent(): Object;

	public buildEmailContentAsyncWrapper(finishBuildEmailContentCallback: { (err: ResponseWrapper, emailContent?: string): void; }) {
		this.buildEmailContent().then((emailContent: string) => {
			finishBuildEmailContentCallback(null, emailContent);
		}).catch((err: ResponseWrapper) => {
			finishBuildEmailContentCallback(err);
		});
	}
	private buildEmailContent(): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			this.buildEmailContentCore(resolve, reject);
		});
	}
	private buildEmailContentCore(resolve: any, reject: any) {
		var options = {
			root: path.join(__dirname, AEmailTemplateBuilder.HtmlPath)
		};
		var templates = new EmailTemplates(options);
		var templatePath = this.getEmailTemplatePath();
		var emailData = extend(true, this._emailTemplateDO, this.getContent());
		templates.render(templatePath, emailData, (err: any, html: string, text: string) => {
			if (err || !html) {
				reject(new ResponseWrapper(ResponseStatusCode.EmailTemplateBuilderProblemBuildingContent));
				return;
			}
			resolve(html);
		});
	}
	private getEmailTemplatePath(): string {
		return this.getHtmlName() + ".html";
	}
}