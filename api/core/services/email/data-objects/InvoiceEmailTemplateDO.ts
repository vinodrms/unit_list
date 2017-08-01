import {BaseEmailTemplateDO, EmailTemplateTypes} from './BaseEmailTemplateDO';

export class InvoiceEmailTemplateDO extends BaseEmailTemplateDO {

    private _hotelName: string;
    private _hotelAddressLine1: string;
    private _hotelAddressLine2: string;
    private _hotelEmail: string;
    private _hotelPhone: string;
    private _hotelCountry: string;

    constructor() {
        super(EmailTemplateTypes.Invoice);
    }

    public get hotelName(): string {
        return this._hotelName;
    }

    public set hotelName(hotelName: string) {
        this._hotelName = hotelName;
    }

    public get hotelAddressLine1(): string {
        return this._hotelAddressLine1;
    }

    public set hotelAddressLine1(hotelAddressLine1: string) {
        this._hotelAddressLine1 = hotelAddressLine1;
    }

    public get hotelAddressLine2(): string {
        return this._hotelAddressLine2;
    }

    public set hotelAddressLine2(hotelAddressLine2: string) {
        this._hotelAddressLine2 = hotelAddressLine2;
    }

    public get hotelEmail(): string {
        return this._hotelEmail;
    }

    public set hotelEmail(hotelEmail: string) {
        this._hotelEmail = hotelEmail;
    }

    public get hotelPhone(): string {
        return this._hotelPhone;
    }

    public set hotelPhone(hotelPhone: string) {
        this._hotelPhone = hotelPhone;
    }

    public get hotelCountry(): string {
        return this._hotelCountry;
    }

    public set hotelCountry(hotelCountry: string) {
        this._hotelCountry = hotelCountry;
    }

}