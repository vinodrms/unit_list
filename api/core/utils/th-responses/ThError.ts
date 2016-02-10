import {ThStatusCode} from './ThResponse';
import {ThUtils} from '../ThUtils';

var _ = require("underscore");

export enum ThErrorType {
	Native,
	ThError
}

export class ThError {
	_thErrorType: ThErrorType;
	_thStatusCode: ThStatusCode;
	_nativeError: Error;

	/* 
		'err' can be a native error or another instance of ThError
	*/
	constructor(thStatusCode: ThStatusCode, err: any) {
		this.parse(thStatusCode, err);
	}
	private parse(thStatusCode: ThStatusCode, err: any) {
		var thUtils = new ThUtils();
		if (thUtils.isUndefinedOrNull(err)) {
			this.buildThError(ThErrorType.ThError, thStatusCode, null);
			return;
		}
		else if (this.isThError(thUtils, err)) {
			this.buildThError(ThErrorType.ThError, err._thStatusCode, err._nativeError);
			return;
		}
		this.buildThError(ThErrorType.Native, thStatusCode, err);
	}
	private buildThError(thErrorType: ThErrorType, thStatusCode: ThStatusCode, err: any) {
		this._thErrorType = thErrorType;
		this._thStatusCode = thStatusCode;
		this._nativeError = err;
	}
	private isThError(thUtils: ThUtils, err: any): boolean {
		if (thUtils.isUndefinedOrNull(err, "_thStatusCode")) {
			return false;
		}
		var possibleThStatusCode = err._thStatusCode;
		for (var thStatusCode in ThStatusCode) {
			if (thStatusCode == possibleThStatusCode) {
				return true;
			}
		}
		return false;
	}
	public isNativeError(): boolean {
		return this._thErrorType === ThErrorType.Native;
	}
	public getThStatusCode(): ThStatusCode {
		return this._thStatusCode;
	}
}