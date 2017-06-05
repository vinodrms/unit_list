import {ISendgridTemplate} from '../ISendgridTemplate';
import {BookingConfirmationEmailTemplateDO} from '../../../data-objects/BookingConfirmationEmailTemplateDO';

export class SendgridBookingConfirmationTemplate implements ISendgridTemplate {
    constructor(private _emailTemplateDO: BookingConfirmationEmailTemplateDO) {
    }

    public getTemplateMetadata(): any {

        return {
            id: '566a3b78-4095-4e8c-bb45-5d637ba6447d',
            subs: {
                "%guestName%": this._emailTemplateDO.guestName,
                "%hotelName%": this._emailTemplateDO.hotelName,
                "%hotelAddressLine1%": this._emailTemplateDO.hotelAddressLine1,
                "%hotelAddressLine2%": this._emailTemplateDO.hotelAddressLine2,
                "%hotelEmail%": this._emailTemplateDO.hotelEmail,
                "%hotelPhone%": this._emailTemplateDO.hotelPhone,
                "%hotelCountry%": this._emailTemplateDO.hotelCountry
            }
        };
    }
}