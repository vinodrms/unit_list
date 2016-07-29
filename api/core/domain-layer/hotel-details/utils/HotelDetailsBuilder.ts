import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {SessionContext} from '../../../utils/SessionContext';
import {UserDO} from '../../../data-layer/hotel/data-objects/user/UserDO';
import {HotelDO} from '../../../data-layer/hotel/data-objects/HotelDO';
import {ThTimestampDO} from '../../../utils/th-dates/data-objects/ThTimestampDO';

import _ = require('underscore');

export interface HotelDetailsDO {
	user: UserDO;
	hotel: HotelDO;
	currentThTimestamp: ThTimestampDO;
}

export class HotelDetailsBuilder {
	constructor(private _sessionContext: SessionContext, private _hotel: HotelDO) {
	}
	public build(): Promise<HotelDetailsDO> {
		return new Promise<HotelDetailsDO>((resolve: { (result: HotelDetailsDO): void }, reject: { (err: ThError): void }) => {
			try {
				this.buildCore(resolve, reject);
			}
			catch (e) {
				var thError = new ThError(ThStatusCode.HotelGetDetailsErrorFormattingResponse, e);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error updating hotel details", this._sessionContext, thError);
				process.nextTick(() => {
					reject(thError);
				});
			}
		});
	}
	private buildCore(resolve: { (result: HotelDetailsDO): void }, reject: { (err: ThError): void }) {
		var user: UserDO = _.find(this._hotel.userList, (currentUser: UserDO) => {
			return currentUser.email == this._sessionContext.sessionDO.user.email;
		});
		if (!user) {
			var thError = new ThError(ThStatusCode.HotelGetDetailsErrorFindingUserByEmail, null);
			ThLogger.getInstance().logBusiness(ThLogLevel.Error, "Error getting hotel details by email", this._sessionContext, thError);
			reject(thError);
			return;
		}
		delete this._hotel.userList;
		delete user.password;
		delete user.accountActivationToken;
		delete user.resetPasswordToken;
		var currentThTimestamp: ThTimestampDO;
		if (_.isString(this._hotel.timezone) && this._hotel.timezone.length > 0) {
			currentThTimestamp = ThTimestampDO.buildThTimestampForTimezone(this._hotel.timezone);
		}
		process.nextTick(() => {
			resolve({ user: user, hotel: this._hotel, currentThTimestamp: currentThTimestamp });
		});
	}
}