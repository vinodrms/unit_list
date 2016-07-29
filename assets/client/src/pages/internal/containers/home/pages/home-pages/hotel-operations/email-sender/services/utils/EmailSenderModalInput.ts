import {CustomerDO} from '../../../../../../../../services/customers/data-objects/CustomerDO';
import {EmailConfirmationParams} from '../../../../../../../../services/hotel-operations/common/utils/EmailConfirmationParams';

export class EmailSenderModalInput {
    private _customerList: CustomerDO[];
    private _emailConfirmationParams: EmailConfirmationParams;

    constructor(customerList: CustomerDO[], emailConfirmationParams: EmailConfirmationParams) {
        this._customerList = customerList;
        this._emailConfirmationParams = emailConfirmationParams;
    }

    public get customerList(): CustomerDO[] {
        return this._customerList;
    }
    public set customerList(customerList: CustomerDO[]) {
        this._customerList = customerList;
    }
    public get emailConfirmationParams(): EmailConfirmationParams {
        return this._emailConfirmationParams;
    }
    public set emailConfirmationParams(emailConfirmationParams: EmailConfirmationParams) {
        this._emailConfirmationParams = emailConfirmationParams;
    }
}