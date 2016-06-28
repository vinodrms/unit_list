import {ISendgridTemplate} from '../ISendgridTemplate';
import {AccountActivationEmailTemplateDO} from '../../../data-objects/AccountActivationEmailTemplateDO';

export class SendgridAccountActivationTemplate implements ISendgridTemplate {
    constructor(private _emailTemplateDO: AccountActivationEmailTemplateDO) {
    }

    public getTemplateMetadata(): any {
        return {
            id: '42fd289b-266a-4b81-9535-5501817f6990',
            subs: {
                "%firstName%": this._emailTemplateDO.firstName,
                "%lastName%": this._emailTemplateDO.lastName,
                "%email%": this._emailTemplateDO.email,
                "%activationLink%": this._emailTemplateDO.activationLink
            }
        };
    }
}