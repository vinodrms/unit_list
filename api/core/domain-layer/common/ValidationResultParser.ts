import {ValidationResult, InvalidConstraintType} from '../../utils/th-validation/rules/core/ValidationResult';
import {ThLogger, ThLogLevel} from '../../utils/logging/ThLogger';
import {ThError} from '../../utils/th-responses/ThError';
import { ThStatusCode } from '../../utils/th-responses/ThResponse';
import { IntermediateValidationResult } from "../../utils/th-validation/rules/core/AValidationRule";

export class ValidationResultParser {
	constructor(private _validationResult: ValidationResult, private _inputDO: Object) {
	}

	public logAndReject(logMessage: string, reject: { (err: ThError): void }) {
		var thError: ThError;

		if (this._validationResult.containsInvalidConstraint(InvalidConstraintType.Password)) {
			thError = new ThError(ThStatusCode.DataPasswordValidationError, null);
		}
		else if (this._validationResult.containsInvalidConstraint(InvalidConstraintType.Email)) {
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
	private getValidationErrorsJson(): { type: InvalidConstraintType, key: string }[] {
		var validationErrorsJson = [];
		
		

		_.map(this._validationResult.getInvalidConstraintList(), (result: IntermediateValidationResult) => {
			return result.constraintType;
		}).forEach((invalidConstraintType: InvalidConstraintType) => {
			validationErrorsJson.push({
				type: invalidConstraintType,
				key: this.getInvalidConstraintTypeStringRepresentation(invalidConstraintType)
			});
		});
		return validationErrorsJson;
	}
	private getInvalidConstraintTypeStringRepresentation(type: InvalidConstraintType): string {
		return InvalidConstraintType[type];
	}
}