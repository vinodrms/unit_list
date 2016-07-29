import {AppContext} from '../../../../../utils/AppContext';
import {SessionContext} from '../../../../../utils/SessionContext';
import {EmailConfirmationType} from '../EmailConfirmationDO';
import {IEmailConfirmationStrategy} from './IEmailConfirmationStrategy';
import {BookingEmailConfirmationStrategy} from './strategies/BookingEmailConfirmationStrategy';

export class EmailConfirmationFactory {
    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
    }

    public getEmailConfirmationStrategy(emailConfirmationType: EmailConfirmationType): IEmailConfirmationStrategy {
        switch (emailConfirmationType) {
            default:
                return new BookingEmailConfirmationStrategy(this._appContext, this._sessionContext);
        }
    }
}