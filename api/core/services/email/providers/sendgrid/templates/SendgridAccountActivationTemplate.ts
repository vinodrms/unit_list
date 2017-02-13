import {ISendgridTemplate} from '../ISendgridTemplate';
import {AccountActivationEmailTemplateDO} from '../../../data-objects/AccountActivationEmailTemplateDO';

export class SendgridAccountActivationTemplate implements ISendgridTemplate {
    constructor(private _emailTemplateDO: AccountActivationEmailTemplateDO) {
    }

    public getTemplateMetadata(): any {
        return {
            id: '147e3a62-edf9-4e23-972a-029487964102',
            subs: {
                "%firstName%": this._emailTemplateDO.firstName,
                "%lastName%": this._emailTemplateDO.lastName,
                "%email%": this._emailTemplateDO.email,
                "%activationLink%": this._emailTemplateDO.activationLink
            }
        };
    }
}