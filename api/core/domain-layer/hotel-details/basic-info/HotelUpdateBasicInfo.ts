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
import {HotelDetailsBuilder, HotelDetailsDO} from '../utils/HotelDetailsBuilder';
import {ValidationResultParser} from '../../common/ValidationResultParser';
import {HotelMetaRepoDO, BasicHotelInfoRepoDO} from '../../../data-layer/hotel/repositories/IHotelRepository';

export class HotelUpdateBasicInfo {
	private _loadedHotel: HotelDO;
	constructor(private _appContext: AppContext, private _sessionContext: SessionContext, private _basicInfoDO: HotelUpdateBasicInfoDO) {
	}

	public update(): Promise<HotelDetailsDO> {
		return new Promise<HotelDetailsDO>((resolve: { (result: HotelDetailsDO): void }, reject: { (err: ThError): void }) => {
			this.updateCore(resolve, reject);
		});
	}
	private updateCore(resolve: { (result: HotelDetailsDO): void }, reject: { (err: ThError): void }) {
		var validationResult = HotelUpdateBasicInfoDO.getValidationStructure().validateStructure(this._basicInfoDO);
		if (!validationResult.isValid()) {
			var parser = new ValidationResultParser(validationResult, this._basicInfoDO);
			parser.logAndReject("Error validating update basic information fields", reject);
			return;
		}

		var hotelRepository = this._appContext.getRepositoryFactory().getHotelRepository();
		hotelRepository.getHotelById(this._sessionContext.sessionDO.hotel.id)
			.then((hotel: HotelDO) => {
				this._loadedHotel = hotel;
				var hotelMeta: HotelMetaRepoDO = this.buildHotelMetaRepoDO();
				var basicHotelInfo: BasicHotelInfoRepoDO = this.buildBasicHotelInfoRepoDO();
				var hotelRepository = this._appContext.getRepositoryFactory().getHotelRepository();
				return hotelRepository.updateBasicInformation(hotelMeta, basicHotelInfo);
			})
			.then((hotel: HotelDO) => {
				var hotelDetailsBuilder = new HotelDetailsBuilder(this._sessionContext, hotel);
				return hotelDetailsBuilder.build();
			})
			.then((hotelDetails: HotelDetailsDO) => {
				resolve(hotelDetails);
			}).catch((error: any) => {
				var thError = new ThError(ThStatusCode.HotelGetDetailsError, error);
				if (thError.isNativeError()) {
					ThLogger.getInstance().logError(ThLogLevel.Error, "Error updating hotel basic information", this._sessionContext, thError);
				}
				reject(thError);
			});
	}
	private buildHotelMetaRepoDO(): HotelMetaRepoDO {
		return {
			id: this._loadedHotel.id,
			versionId: this._loadedHotel.versionId
		};
	}
	private buildBasicHotelInfoRepoDO(): BasicHotelInfoRepoDO {
		var newContactDetails = new HotelContactDetailsDO();
		newContactDetails.buildFromObject(this._basicInfoDO.contactDetails);
		var newGeoLocation = new GeoLocationDO();
		newGeoLocation.buildFromObject(this._basicInfoDO.geoLocation);
		return {
			contactDetails: newContactDetails,
			geoLocation: newGeoLocation,
			logoUrl: this._basicInfoDO.logoUrl
		}
	}
}