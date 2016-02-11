import {BaseEmailTemplateDO, EmailTemplateTypes} from './BaseEmailTemplateDO';

export class AccountRequestResetPasswordTemplateDO extends BaseEmailTemplateDO {
	private _firstName: string;
    private _lastName: string;
    private _activationLink: string;

	constructor() {
        super(EmailTemplateTypes.AccountRequestResetPassword);
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
    public get activationLink(): string {
        return this._activationLink;
    }
    public set activationLink(activationLink: string) {
        this._activationLink = activationLink;
    }
}