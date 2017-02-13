import {ISendgridTemplate} from '../ISendgridTemplate';
import {AccountRequestResetPasswordTemplateDO} from '../../../data-objects/AccountRequestResetPasswordTemplateDO';

export class SendgridRequestResetPasswordTemplate implements ISendgridTemplate {
    constructor(private _emailTemplateDO: AccountRequestResetPasswordTemplateDO) {
    }

    public getTemplateMetadata(): any {
        return {
            id: '83f757ec-1f6d-46da-999b-96ecb70bddbf',
            subs: {
                "%firstName%": this._emailTemplateDO.firstName,
                "%lastName%": this._emailTemplateDO.lastName,
                "%activationLink%": this._emailTemplateDO.activationLink
            }
        };
    }
}