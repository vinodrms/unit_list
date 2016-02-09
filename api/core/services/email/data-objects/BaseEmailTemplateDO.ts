export enum EmailTemplateTypes {
    AccountActivation
}

export class BaseEmailTemplateDO {
    constructor(private _emailTemplateType: EmailTemplateTypes) {
    }
    public get emailTemplateType(): EmailTemplateTypes {
        return this._emailTemplateType;
    }
}