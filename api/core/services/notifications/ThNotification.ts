import {Locales, Translation} from '../../utils/localization/Translation';

export enum ThNotificationCode {
	AllotmentArchivedAutomatically
}

var ThNotificationMessage: { [index: number]: string; } = {};
ThNotificationMessage[ThNotificationCode.AllotmentArchivedAutomatically] = "Your allotment for customer %customerName% has been automatically archived as it reached the expired date.";

export class ThNotification {
	private _code: ThNotificationCode;
	private _parameters: Object;
	private _hotelId: string;
	private _userId: string;

	constructor(code: ThNotificationCode, parameters: Object, hotelId: string, userId: string) {
		this._code = code;
		this._parameters = parameters;
		this._hotelId = hotelId;
		this._userId = userId;
	}
    public getTranslatedNotificationMessage(locale: Locales) {
        var translation = new Translation(locale);
        return translation.getTranslation(ThNotificationMessage[this._code], this._parameters);
    }

	public get code(): ThNotificationCode {
		return this._code;
	}
	public set code(code: ThNotificationCode) {
		this._code = code;
	}
	public get parameters(): Object {
		return this._parameters;
	}
	public set parameters(parameters: Object) {
		this._parameters = parameters;
	}
	public get hotelId(): string {
		return this._hotelId;
	}
	public set hotelId(hotelId: string) {
		this._hotelId = hotelId;
	}
	public get userId(): string {
		return this._userId;
	}
	public set userId(userId: string) {
		this._userId = userId;
	}
}