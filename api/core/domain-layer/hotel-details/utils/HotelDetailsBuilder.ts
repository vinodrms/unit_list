import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {SessionContext} from '../../../utils/SessionContext';
import {UserDO} from '../../../data-layer/hotel/data-objects/user/UserDO';
import {HotelDO} from '../../../data-layer/hotel/data-objects/HotelDO';

export interface HotelDetailsDO {
	user: UserDO;
	hotel: HotelDO;
}

export class HotelDetailsBuilder {
	constructor(private _sessionContext: SessionContext, private _hotel: HotelDO) {
	}

	public buildAsync(finishBuildResponse: { (err: ThError, result?: HotelDetailsDO): void }) {
		this.build().then((result: HotelDetailsDO) => {
			finishBuildResponse(null, result);
		}).catch((error: any) => {
			finishBuildResponse(error);
		});
	}
	private build(): Promise<HotelDetailsDO> {
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
		process.nextTick(() => {
			resolve({ user: user, hotel: this._hotel });
		});
	}
}