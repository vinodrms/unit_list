import {ErrorCode, ResponseWrapper} from './ResponseWrapper';

import _ = require("underscore");

export class ErrorParser {
	private _errorCode: ErrorCode;
	private _isUncatchedError: boolean;

	constructor(private _error: any, private _defaultErrorCode: ErrorCode) {
		this.parseError();
	}
	private parseError() {
		this._errorCode = this._defaultErrorCode;
		this._isUncatchedError = true;

		if (!_.isUndefined(this._error) && !_.isUndefined(this._error.code)) {
			var possibleErrorCode: any = this._error.code;
			if (this.isStandardErrorCode(possibleErrorCode)) {
				this._errorCode = possibleErrorCode;
				this._isUncatchedError = false;
			}
		}
	}
	private isStandardErrorCode(possibleErrorCode: any): boolean {
		for (var errorCode: ErrorCode = 0; errorCode < ErrorCode.NUM_OF_ITEMS; errorCode++) {
			if (errorCode === possibleErrorCode) {
				return true;
			}
		}
		return false;
	}
	public isUncatchedError(): boolean {
		return this._isUncatchedError;
	}
	public getResponseWrapper(): ResponseWrapper {
		return new ResponseWrapper(this._errorCode);
	}
}