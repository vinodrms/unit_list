import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {HotelDO} from '../../../data-layer/hotel/data-objects/HotelDO';
import {HotelMetaRepoDO} from '../../../data-layer/hotel/repositories/IHotelRepository';

export class HotelConfigurations {
	private _loadedHotel: HotelDO;
	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
	}

	public markAsCompleted(): Promise<boolean> {
		return new Promise<boolean>((resolve: { (result: boolean): void }, reject: { (err: ThError): void }) => {
			this.markAsCompletedCore(resolve, reject);
		});
	}
	private markAsCompletedCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
		var hotelRepository = this._appContext.getRepositoryFactory().getHotelRepository();
		hotelRepository.getHotelById(this._sessionContext.sessionDO.hotel.id)
			.then((hotel: HotelDO) => {
				this._loadedHotel = hotel;
				var hotelMeta: HotelMetaRepoDO = {
					id: this._loadedHotel.id,
					versionId: this._loadedHotel.versionId
				};
				var hotelRepository = this._appContext.getRepositoryFactory().getHotelRepository();
				return hotelRepository.markConfigurationCompleted(hotelMeta);
			})
			.then((hotel: HotelDO) => {
				resolve(hotel.configurationCompleted);
			}).catch((error: any) => {
				var thError = new ThError(ThStatusCode.HotelConfigurationsErrorMarkingAsCompleted, error);
				if (thError.isNativeError()) {
					ThLogger.getInstance().logError(ThLogLevel.Error, "Error marking hotel configurations as completed", this._sessionContext, thError);
				}
				reject(thError);
			});
	}
}