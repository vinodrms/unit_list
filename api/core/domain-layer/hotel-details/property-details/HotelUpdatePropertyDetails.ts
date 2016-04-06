import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {HotelDO} from '../../../data-layer/hotel/data-objects/HotelDO';
import {AmenityDO} from '../../../data-layer/common/data-objects/amenity/AmenityDO';
import {OperationHoursDO} from '../../../data-layer/hotel/data-objects/operation-hours/OperationHoursDO';
import {ThHourDO} from '../../../utils/th-dates/data-objects/ThHourDO';
import {HotelDetailsBuilder, HotelDetailsDO} from '../utils/HotelDetailsBuilder';
import {HotelUpdatePropertyDetailsDO, HotelUpdatePropertyDetailsHourDO} from './HotelUpdatePropertyDetailsDO';
import {HotelMetaRepoDO, PropertyDetailsRepoDO} from '../../../data-layer/hotel/repositories/IHotelRepository';
import {ValidationResultParser} from '../../common/ValidationResultParser';
import {ThUtils} from '../../../utils/ThUtils';
import {ThDateUtils} from '../../../utils/th-dates/ThDateUtils';

import _ = require('underscore');

export class HotelUpdatePropertyDetails {
	private _thUtils: ThUtils;
	private _thDateUtils: ThDateUtils;

	private _loadedHotel: HotelDO;
	private _availableAmenityList: AmenityDO[];

	private _validatedOperationHoursDO: OperationHoursDO;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext, private _propertyDetailsDO: HotelUpdatePropertyDetailsDO) {
		this._thUtils = new ThUtils();
		this._thDateUtils = new ThDateUtils();
	}

	public update(): Promise<HotelDetailsDO> {
		return new Promise<HotelDetailsDO>((resolve: { (result: HotelDetailsDO): void }, reject: { (err: ThError): void }) => {
			this.updateCore(resolve, reject);
		});
	}
	private updateCore(resolve: { (result: HotelDetailsDO): void }, reject: { (err: ThError): void }) {
		var validationResult = HotelUpdatePropertyDetailsDO.getValidationStructure().validateStructure(this._propertyDetailsDO);
		if (!validationResult.isValid()) {
			var parser = new ValidationResultParser(validationResult, this._propertyDetailsDO);
			parser.logAndReject("Error validating update property details fields", reject);
			return;
		}

		var hotelRepository = this._appContext.getRepositoryFactory().getHotelRepository();
		hotelRepository.getHotelById(this._sessionContext.sessionDO.hotel.id)
			.then((hotel: HotelDO) => {
				this._loadedHotel = hotel;

				var settingsRepository = this._appContext.getRepositoryFactory().getSettingsRepository();
				return settingsRepository.getHotelAmenities();
			})
			.then((amenityList: AmenityDO[]) => {
				this._availableAmenityList = amenityList;

				return this.validatePropertyDetails();
			})
			.then((validationResult: boolean) => {
				var hotelRepository = this._appContext.getRepositoryFactory().getHotelRepository();

				var hotelMeta = this.buildHotelMetaRepoDO();
				var propertyDetails = this.buildPropertyDetailsRepoDO();
				return hotelRepository.updatePropertyDetails(hotelMeta, propertyDetails);
			})
			.then((hotel: HotelDO) => {
				var hotelDetailsBuilder = new HotelDetailsBuilder(this._sessionContext, hotel);
				return hotelDetailsBuilder.build();
			})
			.then((result: HotelDetailsDO) => {
				resolve(result);
			}).catch((error: any) => {
				var thError = new ThError(ThStatusCode.HotelUpdatePropertyDetailsUpdateError, error);
				if (thError.isNativeError()) {
					ThLogger.getInstance().logBusiness(ThLogLevel.Error, "error updating property details", this._propertyDetailsDO, thError);
				}
				reject(thError);
			});
	}
	private validatePropertyDetails(): Promise<boolean> {
		return new Promise<boolean>((resolve: { (result: boolean): void }, reject: { (err: ThError): void }) => {
			try {
				this.validatePropertyDetailsCore(resolve, reject);
			} catch (error) {
				var thError = new ThError(ThStatusCode.HotelUpdatePropertyDetailsValidationError, error);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error validating property details", this._propertyDetailsDO, thError);
			}
		});
	}
	private validatePropertyDetailsCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
		if (!this.amenityIdListIsValid()) {
			var thError = new ThError(ThStatusCode.HotelUpdatePropertyDetailsInvalidAmenityIdList, null);
			ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "invalid amenity id list", this._propertyDetailsDO, thError);
			reject(thError);
			return;
		}
		if (!this.operationHoursAreValid()) {
			var thError = new ThError(ThStatusCode.HotelUpdatePropertyDetailsInvalidOperationHours, null);
			ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Invalid operation hours", this._propertyDetailsDO, thError);
			reject(thError);
			return;
		}
		if (!this._thDateUtils.isValidTimezone(this._propertyDetailsDO.timezone)) {
			var thError = new ThError(ThStatusCode.HotelUpdatePropertyDetailsInvalidTimezone, null);
			ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Invalid timezone", this._propertyDetailsDO, thError);
			reject(thError);
			return;
		}
		resolve(true);
	}
	private amenityIdListIsValid(): boolean {
		var isValid = true;
		_.forEach(this._propertyDetailsDO.amenityIdList, (amenityId: string) => {
			var foundAmenity: AmenityDO = _.find(this._availableAmenityList, (amenity: AmenityDO) => {
				return amenity.id === amenityId;
			});
			if (this._thUtils.isUndefinedOrNull(foundAmenity)) {
				isValid = false;
			}
		});
		return isValid;
	}

	private operationHoursAreValid(): boolean {
		this._validatedOperationHoursDO = new OperationHoursDO();
		this._validatedOperationHoursDO.checkInFrom = this.buildHourDOFrom(this._propertyDetailsDO.operationHours.checkInFrom);
		this._validatedOperationHoursDO.checkOutTo = this.buildHourDOFrom(this._propertyDetailsDO.operationHours.checkOutTo);
		this._validatedOperationHoursDO.cancellationHour = this.buildOptionalHourDOFrom(this._propertyDetailsDO.operationHours.cancellationHour);
        if (!this._validatedOperationHoursDO.checkInFrom.isValid() || !this._validatedOperationHoursDO.checkOutTo.isValid() ||
            !this._validatedOperationHoursDO.cancellationHour.isValid()) {
			return false;
		}
		this._validatedOperationHoursDO.checkInToOptional = this.buildOptionalHourDOFrom(this._propertyDetailsDO.operationHours.checkInToOptional);
		this._validatedOperationHoursDO.checkOutFromOptional = this.buildOptionalHourDOFrom(this._propertyDetailsDO.operationHours.checkOutFromOptional);
		return true;
	}
	private buildOptionalHourDOFrom(inputHour: HotelUpdatePropertyDetailsHourDO): ThHourDO {
		var hourDO = this.buildHourDOFrom(inputHour);
		if (!hourDO.isValid()) {
			hourDO.hour = null;
			hourDO.minute = null;
		}
		return hourDO;
	}
	private buildHourDOFrom(inputHour: HotelUpdatePropertyDetailsHourDO): ThHourDO {
		var hour = new ThHourDO();
		hour.buildFromObject(inputHour);
		return hour;
	}

	private buildHotelMetaRepoDO(): HotelMetaRepoDO {
		return {
			id: this._loadedHotel.id,
			versionId: this._loadedHotel.versionId
		};
	}
	private buildPropertyDetailsRepoDO(): PropertyDetailsRepoDO {
		return {
			amenityIdList: this._propertyDetailsDO.amenityIdList,
			timezone: this._propertyDetailsDO.timezone,
			operationHours: this._validatedOperationHoursDO
		};
	}
}