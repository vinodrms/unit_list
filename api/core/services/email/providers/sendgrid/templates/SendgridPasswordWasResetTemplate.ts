import {ISendgridTemplate} from '../ISendgridTemplate';
import {AccountPasswordWasResetTemplateDO} from '../../../data-objects/AccountPasswordWasResetTemplateDO';

export class SendgridPasswordWasResetTemplate implements ISendgridTemplate {
    constructor(private _emailTemplateDO: AccountPasswordWasResetTemplateDO) {
    }

    public getTemplateMetadata(): any {
        return {
            id: 'f8ecf097-b87a-4439-a8b2-eb0b4fa9af09',
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