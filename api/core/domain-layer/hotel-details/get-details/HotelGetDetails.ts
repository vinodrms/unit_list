import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {UserDO} from '../../../data-layer/hotel/data-objects/user/UserDO';
import {HotelDO} from '../../../data-layer/hotel/data-objects/HotelDO';
import {HotelDetailsBuilder, HotelDetailsDO} from '../utils/HotelDetailsBuilder';

export class HotelGetDetails {
	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
	}
	public getDetails(): Promise<HotelDetailsDO> {
		return new Promise<HotelDetailsDO>((resolve: { (result: HotelDetailsDO): void }, reject: { (err: ThError): void }) => {
			this.getDetailsCore(resolve, reject);
		});
	}
	private getDetailsCore(resolve: { (result: HotelDetailsDO): void }, reject: { (err: ThError): void }) {
		var hotelRepository = this._appContext.getRepositoryFactory().getHotelRepository();
		hotelRepository.getHotelByUserEmail(this._sessionContext.sessionDO.user.email)
			.then((hotel: HotelDO) => {
				var hotelDetailsBuilder = new HotelDetailsBuilder(this._sessionContext, hotel);
				return hotelDetailsBuilder.build();
			})
			.then((details: HotelDetailsDO) => {
				resolve(details);
			}).catch((error: any) => {
				var thError = new ThError(ThStatusCode.HotelGetDetailsError, error);
				if (thError.isNativeError()) {
					ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting hotel details", this._sessionContext, thError);
				}
				reject(thError);
			});
	}
}