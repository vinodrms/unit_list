import {AEmailTemplateBuilder} from '../AEmailTemplateBuilder';

export class AccountActivationEmailTemplateDO {
	firstName: string;
	lastName: string;
	email: string;
	activationLink: string;
}

export class AccountActivationEmailTemplateBuilder extends AEmailTemplateBuilder {
	constructor(private _activationEmailDO: AccountActivationEmailTemplateDO) {
		super();
	}
	protected getContent(): Object {
		return this._activationEmailDO;
	}
	protected getHtmlName(): string {
		return "AccountActivationEmailTemplate";
	}
}