import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {UserDO} from '../../../data-layer/hotel/data-objects/user/UserDO';
import {HotelDO} from '../../../data-layer/hotel/data-objects/HotelDO';
import async = require("async");

export class HotelGetDetails {
	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
	}
	public getDetails(): Promise<{ user: UserDO, hotel: HotelDO }> {
		return new Promise<{ user: UserDO, hotel: HotelDO }>((resolve: { (result: { user: UserDO, hotel: HotelDO }): void }, reject: { (err: ThError): void }) => {
			this.getDetailsCore(resolve, reject);
		});
	}
	private getDetailsCore(resolve: { (result: { user: UserDO, hotel: HotelDO }): void }, reject: { (err: ThError): void }) {
		async.waterfall([
			((finishGetHotelByUserEmailCallback) => {
				var hotelRepository = this._appContext.getRepositoryFactory().getHotelRepository();
				hotelRepository.getHotelByUserEmailAsync(this._sessionContext.sessionDO.user.email, finishGetHotelByUserEmailCallback);
			}),
			((hotel: HotelDO, finishBuildResponse) => {
				this.buildHotelDetailsResponseAsync(hotel, finishBuildResponse);
			})
		], ((error: any, details: { user: UserDO, hotel: HotelDO }) => {
			if (error) {
				var thError = new ThError(ThStatusCode.HotelGetDetailsError, error);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting hotel details", this._sessionContext, thError);
				reject(thError);
			}
			else {
				resolve(details);
			}
		}));
	}
	private buildHotelDetailsResponseAsync(hotel: HotelDO, finishBuildResponse: { (err: ThError, result?: { user: UserDO, hotel: HotelDO }): void }) {
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
		resolve({ user: user, hotel: hotel });
	}
}