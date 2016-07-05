import {ThDataValidators} from '../../../../../../../../../../../common/utils/form-utils/utils/ThDataValidators';

export class EmailRecipientVM {
    private _recipientName: string;
    private _email: string;
    private _selected: boolean;
    private _isValid: boolean;
    private _recipientId: string;

    constructor(recipientId: string, recipientName: string, email: string) {
        this.recipientId = recipientId;
        this.recipientName = recipientName;
        this.email = email;
        this.selected = false;
    }

    public get recipientName(): string {
        return this._recipientName;
    }
    public set recipientName(recipientName: string) {
        this._recipientName = recipientName;
    }
    public get email(): string {
        return this._email;
    }
    public set email(email: string) {
        this._email = email;
        this._isValid = ThDataValidators.isValidEmail(this._email);
    }
    public get selected(): boolean {
        return this._selected;
    }
    public set selected(selected: boolean) {
        this._selected = selected;
    }
    public get isValid(): boolean {
        return this._isValid;
    }
    public set isValid(isValid: boolean) {
        this._isValid = isValid;
    }
    public get recipientId(): string {
        return this._recipientId;
    }
    public set recipientId(recipientId: string) {
        this._recipientId = recipientId;
    }
}