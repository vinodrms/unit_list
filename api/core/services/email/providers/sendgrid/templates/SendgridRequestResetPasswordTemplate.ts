import {ISendgridTemplate} from '../ISendgridTemplate';
import {AccountRequestResetPasswordTemplateDO} from '../../../data-objects/AccountRequestResetPasswordTemplateDO';

export class SendgridRequestResetPasswordTemplate implements ISendgridTemplate {
    constructor(private _emailTemplateDO: AccountRequestResetPasswordTemplateDO) {
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
                ],
                "%activationLink%": [
                    this._emailTemplateDO.activationLink
                ]
            }
        };
    }
}