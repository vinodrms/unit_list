import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {UserDO} from '../../../data-layer/hotel/data-objects/user/UserDO';
import {HotelDO} from '../../../data-layer/hotel/data-objects/HotelDO';
import {HotelDetailsBuilder, HotelDetailsDO} from '../utils/HotelDetailsBuilder';
import async = require("async");

export class HotelGetDetails {
	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
	}
	public getDetails(): Promise<HotelDetailsDO> {
		return new Promise<HotelDetailsDO>((resolve: { (result: HotelDetailsDO): void }, reject: { (err: ThError): void }) => {
			this.getDetailsCore(resolve, reject);
		});
	}
	private getDetailsCore(resolve: { (result: HotelDetailsDO): void }, reject: { (err: ThError): void }) {
		async.waterfall([
			((finishGetHotelByUserEmailCallback) => {
				var hotelRepository = this._appContext.getRepositoryFactory().getHotelRepository();
				hotelRepository.getHotelByUserEmailAsync(this._sessionContext.sessionDO.user.email, finishGetHotelByUserEmailCallback);
			}),
			((hotel: HotelDO, finishBuildResponse) => {
				var hotelDetailsBuilder = new HotelDetailsBuilder(this._sessionContext, hotel);
				hotelDetailsBuilder.buildAsync(finishBuildResponse);
			})
		], ((error: any, details: HotelDetailsDO) => {
			if (error) {
				var thError = new ThError(ThStatusCode.HotelGetDetailsError, error);
				if (thError.isNativeError()) {
					ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting hotel details", this._sessionContext, thError);
				}
				reject(thError);
			}
			else {
				resolve(details);
			}
		}));
	}
}