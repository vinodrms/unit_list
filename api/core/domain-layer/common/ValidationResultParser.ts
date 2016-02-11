import {ValidationResult, InvalidConstraint} from '../../utils/th-validation/rules/core/ValidationResult';
import {ThLogger, ThLogLevel} from '../../utils/logging/ThLogger';
import {ThError} from '../../utils/th-responses/ThError';
import {ThStatusCode} from '../../utils/th-responses/ThResponse';

export class ValidationResultParser {
	constructor(private _validationResult: ValidationResult, private _inputDO: Object) {
	}

	public logAndReject(logMessage: string, reject: { (err: ThError): void }) {
		var thError: ThError;

		if (this._validationResult.containsInvalidConstraint(InvalidConstraint.Password)) {
			thError = new ThError(ThStatusCode.DataPasswordValidationError, null);
		}
		else if (this._validationResult.containsInvalidConstraint(InvalidConstraint.Email)) {
			thError = new ThError(ThStatusCode.DataEmailValidationError, null);
		}
		else {
			thError = new ThError(ThStatusCode.DataValidationError, null);
		}
		ThLogger.getInstance().logBusiness(ThLogLevel.Error, logMessage, { parameters: this._inputDO, validationErrors: this.getValidationErrorsJson() }, thError);
		process.nextTick(() => {
			reject(thError);
		});
	}
	private getValidationErrorsJson(): { type: InvalidConstraint, key: string }[] {
		var validationErrorsJson = [];
		this._validationResult.getInvalidConstraints().forEach((invalidConstraint: InvalidConstraint) => {
			validationErrorsJson.push({
				type: invalidConstraint,
				key: InvalidConstraint[invalidConstraint]
			});
		});
		return validationErrorsJson;
	}
}