export enum EmailTemplateTypes {
    AccountActivation,
	AccountRequestResetPassword,
	AccountPasswordWasReset,
    BookingConfirmation,
    Invoice
}

export class BaseEmailTemplateDO {
    constructor(private _emailTemplateType: EmailTemplateTypes) {
    }
    public getEmailTemplateType(): EmailTemplateTypes {
        return this._emailTemplateType;
    }
}