import {UnitPalConfig} from '../../utils/environment/UnitPalConfig';
import {AppContext} from '../../utils/AppContext';
import {BaseEmailTemplateDO} from './data-objects/BaseEmailTemplateDO';

import async = require("async");

export class EmailHeaderDO {
	destinationEmail: string;
	subject: string;
    attachments: string[];
}

export abstract class AEmailService {

	constructor(protected _unitPalConfig: UnitPalConfig, protected _emailHeaderDO: EmailHeaderDO, protected _emailTemplate: BaseEmailTemplateDO) {
    }
    
	protected abstract sendEmail(): Promise<any>;
    
    public sendEmailAsync(finishSendEmailCallback: { (err: any, emailContent?: string): void; }) {
		this.sendEmail().then((result: any) => {
			finishSendEmailCallback(null, result);
		}).catch((response: any) => {
			finishSendEmailCallback(response);
		});
	}
    
}