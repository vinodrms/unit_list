import {AppContext} from '../../../../../utils/AppContext';
import {SessionContext} from '../../../../../utils/SessionContext';
import {EmailConfirmationType} from '../EmailConfirmationDO';
import {IEmailConfirmationStrategy} from './IEmailConfirmationStrategy';
import {BookingEmailConfirmationStrategy} from './strategies/BookingEmailConfirmationStrategy';
import {InvoiceEmailConfirmationStrategy} from './strategies/InvoiceEmailConfirmationStrategy';

export class EmailConfirmationFactory {
    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
    }

    public getEmailConfirmationStrategy(emailConfirmationType: EmailConfirmationType): IEmailConfirmationStrategy {
        switch (emailConfirmationType) {
            case EmailConfirmationType.Invoice:
                return new InvoiceEmailConfirmationStrategy(this._appContext, this._sessionContext);
            default:
                return new BookingEmailConfirmationStrategy(this._appContext, this._sessionContext);
        }
    }
}