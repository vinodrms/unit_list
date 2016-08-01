import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';
import {ValidationResultParser} from '../../../common/ValidationResultParser';
import {EmailConfirmationDO} from './EmailConfirmationDO';
import {EmailConfirmationFactory} from './utils/EmailConfirmationFactory';
import {IEmailConfirmationStrategy} from './utils/IEmailConfirmationStrategy';

export class EmailConfirmation {
    private _emailConfirmationDO: EmailConfirmationDO;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
    }

    public send(emailConfirmationDO: EmailConfirmationDO): Promise<boolean> {
        this._emailConfirmationDO = emailConfirmationDO;
        return new Promise<boolean>((resolve: { (result: boolean): void }, reject: { (err: ThError): void }) => {
            this.sendCore(resolve, reject);
        });
    }
    private sendCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
        var validationResult = EmailConfirmationDO.getValidationStructure().validateStructure(this._emailConfirmationDO);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this._emailConfirmationDO);
            parser.logAndReject("Error validating send email fields", reject);
            return;
        }
        if (this._emailConfirmationDO.emailList.length == 0) {
            resolve(true);
            return;
        }

        var emailConfFactory = new EmailConfirmationFactory(this._appContext, this._sessionContext);
        var emailConfStrategy: IEmailConfirmationStrategy = emailConfFactory.getEmailConfirmationStrategy(this._emailConfirmationDO.type);

        validationResult = emailConfStrategy.getValidationStructure().validateStructure(this._emailConfirmationDO.parameters);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this._emailConfirmationDO);
            parser.logAndReject("Error validating send email inner field parameters", reject);
            return;
        }

        emailConfStrategy.send(this._emailConfirmationDO).then((result: boolean) => {
            resolve(result);
        }).catch((error: ThError) => {
            var thError = new ThError(ThStatusCode.EmailConfirmationError, error);
            if (thError.isNativeError()) {
                ThLogger.getInstance().logError(ThLogLevel.Error, "error sending email confirmation", this._emailConfirmationDO, thError);
            }
            reject(thError);
        });
    }
}