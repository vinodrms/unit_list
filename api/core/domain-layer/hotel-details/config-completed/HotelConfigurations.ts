import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {ThUtils} from '../../../utils/ThUtils';
import {SessionContext} from '../../../utils/SessionContext';
import {HotelDO} from '../../../data-layer/hotel/data-objects/HotelDO';
import {HotelMetaRepoDO} from '../../../data-layer/hotel/repositories/IHotelRepository';

import _ = require('underscore');

export class HotelConfigurations {
	private _thUtils: ThUtils;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
		this._thUtils = new ThUtils();
	}

	public markAsCompleted(): Promise<HotelDO> {
		return new Promise<HotelDO>((resolve: { (result: HotelDO): void }, reject: { (err: ThError): void }) => {
			this.markAsCompletedCore(resolve, reject);
		});
	}
	private markAsCompletedCore(resolve: { (result: HotelDO): void }, reject: { (err: ThError): void }) {
		var hotelRepository = this._appContext.getRepositoryFactory().getHotelRepository();
		hotelRepository.getHotelById(this._sessionContext.sessionDO.hotel.id)
			.then((hotel: HotelDO) => {
				return this.markConfigCompletedFor(hotel);
			})
			.then((hotel: HotelDO) => {
				resolve(hotel);
			}).catch((error: any) => {
				var thError = new ThError(ThStatusCode.HotelConfigurationsErrorMarkingAsCompleted, error);
				if (thError.isNativeError()) {
					ThLogger.getInstance().logError(ThLogLevel.Error, "Error marking hotel configurations as completed", this._sessionContext, thError);
				}
				reject(thError);
			});
	}

	private markConfigCompletedFor(loadedHotel: HotelDO): Promise<HotelDO> {
		return new Promise<HotelDO>((resolve: { (result: HotelDO): void }, reject: { (err: ThError): void }) => {
			this.markConfigCompletedForCore(resolve, reject, loadedHotel);
		});
	}
	private markConfigCompletedForCore(resolve: { (result: HotelDO): void }, reject: { (err: ThError): void }, loadedHotel: HotelDO) {
		if (loadedHotel.configurationCompleted) {
			resolve(loadedHotel);
			return;
		}
		if (this._thUtils.isUndefinedOrNull(loadedHotel.timezone)
			|| !_.isString(loadedHotel.timezone)
			|| loadedHotel.timezone.length == 0) {
			var thError = new ThError(ThStatusCode.HotelConfigurationsNullTimezone, null);
			ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "null timezone in mark hotel config completed", this._sessionContext, thError);
			reject(thError);
			return;
		}
		var hotelMeta: HotelMetaRepoDO = {
			id: loadedHotel.id,
			versionId: loadedHotel.versionId
		};
		var hotelRepository = this._appContext.getRepositoryFactory().getHotelRepository();
		hotelRepository.markConfigurationCompleted(hotelMeta, loadedHotel).then((hotel: HotelDO) => {
			resolve(hotel);
		}).catch((error: any) => {
			reject(error);
		});
	}
}