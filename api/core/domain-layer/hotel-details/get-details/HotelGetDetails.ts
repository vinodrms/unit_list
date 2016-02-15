import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {UserDO} from '../../../data-layer/hotel/data-objects/user/UserDO';
import {HotelDO} from '../../../data-layer/hotel/data-objects/HotelDO';
import {HotelDetailsUtils} from '../utils/HotelDetailsUtils';
import async = require("async");

export class HotelGetDetails {
	private _hotelDetailsUtils: HotelDetailsUtils;
	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
		this._hotelDetailsUtils = new HotelDetailsUtils(this._sessionContext);
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
				this._hotelDetailsUtils.buildHotelDetailsResponseAsync(hotel, finishBuildResponse);
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

}