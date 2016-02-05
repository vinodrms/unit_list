import {EmailTemplateDO, AEmailTemplateBuilder} from '../AEmailTemplateBuilder';

export class AccountActivationEmailTemplateDO {
	firstName: string;
	lastName: string;
	email: string;
	activationLink: string;
}

export class AccountActivationEmailTemplateBuilder extends AEmailTemplateBuilder {
	constructor(emailDO: EmailTemplateDO, private _activationEmailDO: AccountActivationEmailTemplateDO) {
		super(emailDO);
	}
	protected getContent(): Object {
		return this._activationEmailDO;
	}
	protected getHtmlName(): string {
		return "AccountActivationEmailTemplate";
	}
}