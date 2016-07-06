import {ISendgridTemplate} from '../ISendgridTemplate';
import {AccountRequestResetPasswordTemplateDO} from '../../../data-objects/AccountRequestResetPasswordTemplateDO';

export class SendgridRequestResetPasswordTemplate implements ISendgridTemplate {
    constructor(private _emailTemplateDO: AccountRequestResetPasswordTemplateDO) {
    }

    public getTemplateMetadata(): any {
        return {
            id: 'a3c180f6-2b28-4d93-b62c-094ac96dd0e9',
            subs: {
                "%firstName%": this._emailTemplateDO.firstName,
                "%lastName%": this._emailTemplateDO.lastName,
                "%activationLink%": this._emailTemplateDO.activationLink
            }
        };
    }
}