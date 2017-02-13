import {ISendgridTemplate} from '../ISendgridTemplate';
import {AccountPasswordWasResetTemplateDO} from '../../../data-objects/AccountPasswordWasResetTemplateDO';

export class SendgridPasswordWasResetTemplate implements ISendgridTemplate {
    constructor(private _emailTemplateDO: AccountPasswordWasResetTemplateDO) {
    }

    public getTemplateMetadata(): any {
        return {
            id: 'f76fde37-f567-4a90-8014-00dcca013660',
            subs: {
                "%firstName%": this._emailTemplateDO.firstName,
                "%lastName%": this._emailTemplateDO.lastName
            }
        };
    }
}