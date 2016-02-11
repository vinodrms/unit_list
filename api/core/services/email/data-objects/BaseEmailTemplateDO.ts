export enum EmailTemplateTypes {
    AccountActivation,
	AccountRequestResetPassword,
	AccountPasswordWasReset
}

export class BaseEmailTemplateDO {
    constructor(private _emailTemplateType: EmailTemplateTypes) {
    }
    public getEmailTemplateType(): EmailTemplateTypes {
        return this._emailTemplateType;
    }
}