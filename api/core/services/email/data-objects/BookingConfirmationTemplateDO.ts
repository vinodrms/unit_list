import {BaseEmailTemplateDO, EmailTemplateTypes} from './BaseEmailTemplateDO';

export class BookingConfirmationTemplateDO extends BaseEmailTemplateDO {
    constructor() {
        super(EmailTemplateTypes.AccountRequestResetPassword);
    }
}