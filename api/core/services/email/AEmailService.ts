import {UnitPalConfig} from '../../utils/environment/UnitPalConfig';
import {AppContext} from '../../utils/AppContext';
import {BaseEmailTemplateDO} from './data-objects/BaseEmailTemplateDO';
import {IEmailService, EmailHeaderDO} from './IEmailService';

import async = require("async");

export abstract class AEmailService implements IEmailService {

	constructor(protected _unitPalConfig: UnitPalConfig, protected _emailHeaderDO: EmailHeaderDO, protected _emailTemplate: BaseEmailTemplateDO) {
    }

	protected abstract sendEmail(): Promise<any>;

    public sendEmailAsync(finishSendEmailCallback: { (err: any, result?: string): void; }) {
		this.sendEmail().then((result: any) => {
			finishSendEmailCallback(null, result);
		}).catch((response: any) => {
			finishSendEmailCallback(response);
		});
	}

}