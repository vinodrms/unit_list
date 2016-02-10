import {BaseEmailTemplateDO, EmailTemplateTypes} from './BaseEmailTemplateDO';

export class AccountPasswordWasResetTemplateDO extends BaseEmailTemplateDO {
	private _firstName: string;
    private _lastName: string;

	constructor() {
        super(EmailTemplateTypes.AccountPasswordWasReset);
    }

	public get firstName(): string {
        return this._firstName;
    }
    public set firstName(firstName: string) {
        this._firstName = firstName;
    }
    public get lastName(): string {
        return this._lastName;
    }
    public set lastName(lastName: string) {
        this._lastName = lastName;
    }
}