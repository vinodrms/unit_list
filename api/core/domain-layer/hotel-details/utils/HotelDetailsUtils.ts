import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {SessionContext} from '../../../utils/SessionContext';
import {UserDO} from '../../../data-layer/hotel/data-objects/user/UserDO';
import {HotelDO} from '../../../data-layer/hotel/data-objects/HotelDO';

export class HotelDetailsUtils {
	constructor(private _sessionContext: SessionContext) {
	}

	public buildHotelDetailsResponseAsync(hotel: HotelDO, finishBuildResponse: { (err: ThError, result?: { user: UserDO, hotel: HotelDO }): void }) {
		this.buildHotelDetailsResponse(hotel).then((result: { user: UserDO, hotel: HotelDO }) => {
			finishBuildResponse(null, result);
		}).catch((error: any) => {
			finishBuildResponse(error);
		});
	}
	private buildHotelDetailsResponse(hotel: HotelDO): Promise<{ user: UserDO, hotel: HotelDO }> {
		return new Promise<{ user: UserDO, hotel: HotelDO }>((resolve: { (result: { user: UserDO, hotel: HotelDO }): void }, reject: { (err: ThError): void }) => {
			try {
				this.buildHotelDetailsResponseCore(hotel, resolve, reject);
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
	private buildHotelDetailsResponseCore(hotel: HotelDO, resolve: { (result: { user: UserDO, hotel: HotelDO }): void }, reject: { (err: ThError): void }) {
		var user: UserDO = _.find(hotel.users, (currentUser: UserDO) => {
			return currentUser.email == this._sessionContext.sessionDO.user.email;
		});
		delete hotel.users;
		delete user.password;
		delete user.accountActivationToken;
		delete user.resetPasswordToken;
		process.nextTick(() => {
			resolve({ user: user, hotel: hotel });
		});
	}
}