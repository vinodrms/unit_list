import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {ThUtils} from '../../../utils/ThUtils';
import {IBusinessValidationRule} from './IBusinessValidationRule';

export interface BusinessValidationRuleError {
    statusCode: ThStatusCode;
    errorMessage: string;
}

export abstract class ABusinessValidationRule<T> implements IBusinessValidationRule<T> {
    protected _thUtils: ThUtils;

    constructor(private _defaultValidationRuleError: BusinessValidationRuleError) {
        this._thUtils = new ThUtils();
    }

    public isValidOn(businessObject: T): Promise<T> {
        return new Promise<T>((resolve: { (result: T): void }, reject: { (err: ThError): void }) => {
            try {
                this.isValidOnCore(resolve, reject, businessObject);
            } catch (error) {
                var thError = new ThError(this._defaultValidationRuleError.statusCode, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, this._defaultValidationRuleError.errorMessage, businessObject, thError);
                reject(thError);
            }
        });
    }
    protected abstract isValidOnCore(resolve: { (result: T): void }, reject: { (err: ThError): void }, businessObject: T);

    protected logBusinessAndReject(reject: { (err: ThError): void }, businessObject: T, validationError: BusinessValidationRuleError) {
        var thError = new ThError(validationError.statusCode, null);
        ThLogger.getInstance().logError(ThLogLevel.Warning, validationError.errorMessage, businessObject, thError);
        reject(thError);
    }
}