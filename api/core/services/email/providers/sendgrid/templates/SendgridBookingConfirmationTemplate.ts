import {ISendgridTemplate} from '../ISendgridTemplate';
import {BookingConfirmationEmailTemplateDO} from '../../../data-objects/BookingConfirmationEmailTemplateDO';

export class SendgridBookingConfirmationTemplate implements ISendgridTemplate {
    constructor(private _emailTemplateDO: BookingConfirmationEmailTemplateDO) {
    }

    public getTemplateMetadata(): any {
        return {
            id: '566a3b78-4095-4e8c-bb45-5d637ba6447d',
            subs: {
                
            }
        };
    }
}