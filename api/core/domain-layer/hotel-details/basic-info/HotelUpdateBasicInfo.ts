import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {UserDO} from '../../../data-layer/hotel/data-objects/user/UserDO';
import {HotelDO} from '../../../data-layer/hotel/data-objects/HotelDO';
import {HotelUpdateBasicInfoDO} from './HotelUpdateBasicInfoDO'
import {HotelContactDetailsDO} from '../../../data-layer/hotel/data-objects/hotel-contact-details/HotelContactDetailsDO';
import {GeoLocationDO} from '../../../data-layer/common/data-objects/geo-location/GeoLocationDO';
import {HotelDetailsUtils} from '../utils/HotelDetailsUtils';
import {ValidationResultParser} from '../../common/ValidationResultParser';

import async = require("async");

export class HotelUpdateBasicInfo {
	private _hotelDetailsUtils: HotelDetailsUtils;
	private _loadedHotel: HotelDO;
	constructor(private _appContext: AppContext, private _sessionContext: SessionContext, private _basicInfoDO: HotelUpdateBasicInfoDO) {
		this._hotelDetailsUtils = new HotelDetailsUtils(this._sessionContext);
	}

	public update(): Promise<{ user: UserDO, hotel: HotelDO }> {
		return new Promise<{ user: UserDO, hotel: HotelDO }>((resolve: { (result: { user: UserDO, hotel: HotelDO }): void }, reject: { (err: ThError): void }) => {
			this.updateCore(resolve, reject);
		});
	}
	private updateCore(resolve: { (result: { user: UserDO, hotel: HotelDO }): void }, reject: { (err: ThError): void }) {
		var validationResult = HotelUpdateBasicInfoDO.getValidationStructure().validateStructure(this._basicInfoDO);
		if (!validationResult.isValid()) {
			var parser = new ValidationResultParser(validationResult, this._basicInfoDO);
			parser.logAndReject("Error validating update basic information fields", reject);
			return;
		}

		async.waterfall([
			((finishGetHotelByIdCallback) => {
				var hotelRepository = this._appContext.getRepositoryFactory().getHotelRepository();
				hotelRepository.getHotelByIdAsync(this._sessionContext.sessionDO.hotel.id, finishGetHotelByIdCallback);
			}),
			((hotel: HotelDO, finishUpdateBasicInformationCallback) => {
				this._loadedHotel = hotel;
				var newContactDetails = new HotelContactDetailsDO();
				newContactDetails.buildFromObject(this._basicInfoDO.contactDetails);
				var newGeoLocation = new GeoLocationDO();
				newGeoLocation.buildFromObject(this._basicInfoDO.geoLocation);

				var hotelRepository = this._appContext.getRepositoryFactory().getHotelRepository();
				hotelRepository.updateBasicInformationAsync({
					id: this._loadedHotel.id,
					versionId: this._loadedHotel.versionId
				}, {
						contactDetails: newContactDetails,
						geoLocation: newGeoLocation,
						logoUrl: this._basicInfoDO.logoUrl
					}, finishUpdateBasicInformationCallback);
			}),
			((hotel: HotelDO, finishBuildResponse) => {
				this._hotelDetailsUtils.buildHotelDetailsResponseAsync(hotel, finishBuildResponse);
			})
		], ((error: any, response: { user: UserDO, hotel: HotelDO }) => {
			if (error) {
				var thError = new ThError(ThStatusCode.HotelGetDetailsError, error);
				if (thError.isNativeError()) {
					ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting hotel details", this._sessionContext, thError);
				}
				reject(thError);
			}
			else {
				resolve(response);
			}
		}));
	}
}