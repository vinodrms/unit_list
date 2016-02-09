import {UnitPalConfig} from '../../../utils/environment/UnitPalConfig';

import bcrypt = require('bcrypt');

import util = require('util');

export class AuthUtils {
	private static AccountActionExpiryOffsetMillis: number = 7 * 24 * 60 * 60 * 1000;

	constructor(private _unitPalConfig: UnitPalConfig) {
	}
	public encrypPassword(password: string) {
		var saltSync = bcrypt.genSaltSync();
		return bcrypt.hashSync(password, saltSync);
	}
	public isSamePassword(unencryptedPassword: string, encrypedPassword: string) {
		return bcrypt.compareSync(unencryptedPassword, encrypedPassword);
	}

	public getAccountActionExpiryTimestamp(): number {
		return new Date().getTime() + AuthUtils.AccountActionExpiryOffsetMillis;
	}
	public getActivationLink(email: string, activationCode: string) {
		var contextRoot = this._unitPalConfig.getAppContextRoot();
		var encodedEmail = encodeURIComponent(email);
		var encodedActivationCode = encodeURIComponent(activationCode);
		return util.format("%s/api/account/activate?email=%s&activationCode=%s", contextRoot, encodedEmail, encodedActivationCode);
	}
}