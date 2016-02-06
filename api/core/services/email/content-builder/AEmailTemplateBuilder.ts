import {IEmailTemplateBuilder} from './IEmailTemplateBuilder';
import {ErrorContainer, ErrorCode} from '../../../utils/responses/ResponseWrapper';
import {Logger} from '../../../utils/logging/Logger';

import path = require('path');
var EmailTemplates = require('swig-email-templates');

export abstract class AEmailTemplateBuilder implements IEmailTemplateBuilder {
	private static HtmlPath = "custom/html";

	constructor() {
	}
	protected abstract getHtmlName(): string;
	protected abstract getContent(): Object;

	public buildEmailContentAsync(finishBuildEmailContentCallback: { (err: any, emailContent?: string): void; }) {
		this.buildEmailContent().then((emailContent: string) => {
			finishBuildEmailContentCallback(null, emailContent);
		}).catch((err: any) => {
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
		var emailData = this.getContent();
		templates.render(templatePath, emailData, (err: any, html: string, text: string) => {
			if (err || !html) {
				Logger.getInstance().logError("Error rendering email template", { emailData: emailData, options: options }, err);
				reject(new ErrorContainer(ErrorCode.EmailTemplateBuilderProblemBuildingContent, err));
				return;
			}
			resolve(html);
		});
	}
	private getEmailTemplatePath(): string {
		return this.getHtmlName() + ".html";
	}
}