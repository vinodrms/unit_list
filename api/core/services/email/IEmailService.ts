import {BaseEmailTemplateDO} from './data-objects/BaseEmailTemplateDO';

export interface EmailHeaderDO {
	to?: string[];
	cc?: string[];
	bcc?: string[];
	subject: string;
    attachments: string[];
	fromName?: string;
}

export interface IEmailService {
	sendEmail(emailHeaderDO: EmailHeaderDO, emailTemplate: BaseEmailTemplateDO): Promise<any>;
}