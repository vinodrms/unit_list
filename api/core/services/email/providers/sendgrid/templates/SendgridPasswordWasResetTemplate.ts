import {ISendgridTemplate} from '../ISendgridTemplate';
import {AccountPasswordWasResetTemplateDO} from '../../../data-objects/AccountPasswordWasResetTemplateDO';

export class SendgridPasswordWasResetTemplate implements ISendgridTemplate {
    constructor(private _emailTemplateDO: AccountPasswordWasResetTemplateDO) {
    }

    public getTemplateMetadata(): any {
        return {
            id: '1b22b1f6-775a-4576-895f-acd79bed6059',
            subs: {
                "%firstName%": [
                    this._emailTemplateDO.firstName
                ],
                "%lastName%": [
                    this._emailTemplateDO.lastName
                ]
            }
        };
    }
}