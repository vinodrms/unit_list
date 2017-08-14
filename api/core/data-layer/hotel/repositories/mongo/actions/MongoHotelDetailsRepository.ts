import { ThLogger, ThLogLevel } from '../../../../../utils/logging/ThLogger';
import { ThError } from '../../../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../../../utils/th-responses/ThResponse';
import { ThUtils } from '../../../../../utils/ThUtils';
import { MongoRepository, MongoErrorCodes, MongoSearchCriteria } from '../../../../common/base/MongoRepository';
import { HotelDO } from '../../../data-objects/HotelDO';
import { HotelContactDetailsDO } from '../../../data-objects/hotel-contact-details/HotelContactDetailsDO';
import { GeoLocationDO } from '../../../../common/data-objects/geo-location/GeoLocationDO';
import { HotelMetaRepoDO, BasicHotelInfoRepoDO, PaymentsPoliciesRepoDO, PropertyDetailsRepoDO, SequenceValue } from '../../IHotelRepository';
import { LazyLoadRepoDO } from '../../../../common/repo-data-objects/LazyLoadRepoDO';
import { ThTimestampDO } from '../../../../../utils/th-dates/data-objects/ThTimestampDO';
import { HotelSequenceType, HotelSequencesDO } from '../../../data-objects/sequences/HotelSequencesDO';

import _ = require("underscore");

export class MongoHotelDetailsRepository extends MongoRepository {
	private static PrefixLength = 3;

	constructor(hotelsEntity: any) {
		super(hotelsEntity);
	}
	public getHotelById(id: string): Promise<HotelDO> {
		return new Promise<HotelDO>((resolve, reject) => {
			this.getHotelByIdCore(resolve, reject, id);
		});
	}
	private getHotelByIdCore(resolve: { (result: HotelDO): void }, reject: { (err: ThError): void }, id: string) {
		this.findOneDocument({ "id": id },
			() => {
				var thError = new ThError(ThStatusCode.HotelRepositoryHotelIdNotFound, null);
				ThLogger.getInstance().logBusiness(ThLogLevel.Info, "Invalid id to retrieve hotel", { id: id }, thError);
				reject(thError);
			},
			(err: Error) => {
				var thError = new ThError(ThStatusCode.HotelRepositoryErrorFindingHotelById, err);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting hotel by id", { id: id }, thError);
				reject(thError);
			},
			(foundHotel: Object) => {
				var hotel: HotelDO = new HotelDO();
				hotel.buildFromObject(foundHotel);
				resolve(hotel);
			}
		);
	}
	public updateBasicInformation(hotelMeta: HotelMetaRepoDO, basicInfo: BasicHotelInfoRepoDO): Promise<HotelDO> {
		return this.findAndModifyHotel(hotelMeta, {
			"contactDetails": basicInfo.contactDetails,
			"geoLocation": basicInfo.geoLocation,
			"logoUrl": basicInfo.logoUrl
		});
	}
	public updatePaymentsPolicies(hotelMeta: HotelMetaRepoDO, paymPoliciesParams: PaymentsPoliciesRepoDO): Promise<HotelDO> {
		return this.findAndModifyHotel(hotelMeta, {
			"paymentMethodList": paymPoliciesParams.paymentMethodList,
			"ccyCode": paymPoliciesParams.ccyCode,
			"additionalInvoiceDetails": paymPoliciesParams.additionalInvoiceDetails,
			"paymentDueInDays": paymPoliciesParams.paymentDueInDays
		});
	}

	public updatePropertyDetails(hotelMeta: HotelMetaRepoDO, propertyDetails: PropertyDetailsRepoDO): Promise<HotelDO> {
		return this.findAndModifyHotel(hotelMeta, {
			"amenityIdList": propertyDetails.amenityIdList,
			"operationHours": propertyDetails.operationHours,
			"timezone": propertyDetails.timezone
		});
	}
	public markConfigurationCompleted(hotelMeta: HotelMetaRepoDO, hotel: HotelDO): Promise<HotelDO> {
		return this.findAndModifyHotel(hotelMeta, {
			"configurationCompleted": true,
			"configurationCompletedTimestamp": ThTimestampDO.buildThTimestampForTimezone(hotel.timezone)
		});
	}

	private findAndModifyHotel(hotelMeta: HotelMetaRepoDO, updateQuery: Object): Promise<HotelDO> {
		return new Promise<HotelDO>((resolve: { (updatedHotel: HotelDO): void }, reject: { (err: any): void }) => {
			this.findAndModifyHotelCore(resolve, reject, hotelMeta, updateQuery);
		});
	}
	private findAndModifyHotelCore(resolve: { (updatedHotel: HotelDO): void }, reject: { (err: ThError): void }, hotelMeta: HotelMetaRepoDO, updateQuery: any) {
		updateQuery.$inc = { "versionId": 1 };
		var findQuery: Object = {
			"id": hotelMeta.id,
			"versionId": hotelMeta.versionId
		};
		this.findAndModifyDocument(
			findQuery, updateQuery,
			() => {
				var thError = new ThError(ThStatusCode.HotelDetailsRepositoryProblemUpdatingAccount, null);
				ThLogger.getInstance().logBusiness(ThLogLevel.Info, "Problem updating account - concurrency", { hotelMeta: hotelMeta, updateQuery: updateQuery }, thError);
				reject(thError);
			},
			(err: Error) => {
				var thError = new ThError(ThStatusCode.HotelDetailsRepositoryErrorUpdatingAccount, err);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error activating hotel account", { hotelMeta: hotelMeta, updateQuery: updateQuery }, thError);
				reject(thError);
			},
			(updatedDBHotel: Object) => {
				var updatedHotel: HotelDO = new HotelDO();
				updatedHotel.buildFromObject(updatedDBHotel);
				resolve(updatedHotel);
			}
		);
	}

	public getHotelList(lazyLoad: LazyLoadRepoDO): Promise<HotelDO[]> {
		return new Promise<HotelDO[]>((resolve: { (result: HotelDO[]): void }, reject: { (err: ThError): void }) => {
			this.getHotelListCore(resolve, reject, lazyLoad);
		});
	}
	private getHotelListCore(resolve: { (result: HotelDO[]): void }, reject: { (err: ThError): void }, lazyLoad?: LazyLoadRepoDO) {
		var mongoSearchCriteria: MongoSearchCriteria = {
			criteria: {},
			lazyLoad: lazyLoad
		}
		this.findMultipleDocuments(mongoSearchCriteria,
			(err: Error) => {
				var thError = new ThError(ThStatusCode.HotelDetailsRepositoryErrorGettingList, err);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting hotel list", { msearchCriteria: mongoSearchCriteria }, thError);
				reject(thError);
			},
			(foundHotelList: Object[]) => {
				var hotelList: HotelDO[] = [];
				foundHotelList.forEach((foundHotel: Object) => {
					var hotel = new HotelDO();
					hotel.buildFromObject(foundHotel);
					hotelList.push(hotel);
				});
				resolve(hotelList);
			}
		);
	}

	public getNextSequenceValue(hotelId: string, sequenceType: HotelSequenceType): Promise<SequenceValue> {
		return new Promise<SequenceValue>((resolve: { (result: SequenceValue): void }, reject: { (err: ThError): void }) => {
			this.getNextSequenceValueCore(resolve, reject, hotelId, sequenceType);
		});
	}

	private getNextSequenceValueCore(resolve: { (result: SequenceValue): void }, reject: { (err: ThError): void },
		hotelId: string, sequenceType: HotelSequenceType) {

		var sequenceKey = HotelSequencesDO.getSequenceKey(sequenceType);
		var incQuery = {};
		incQuery["sequences." + sequenceKey] = 1;

		this.findAndModifyDocument(
			{ "id": hotelId }, { $inc: incQuery },
			() => {
				var thError = new ThError(ThStatusCode.HotelDetailsRepositoryProblemGettingSequence, null);
				ThLogger.getInstance().logBusiness(ThLogLevel.Info, "Problem getting sequence", { hotelId: hotelId, sequenceType: sequenceType }, thError);
				reject(thError);
			},
			(err: Error) => {
				var thError = new ThError(ThStatusCode.HotelDetailsRepositoryErrorGettingSequence, err);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting sequence", { hotelId: hotelId, sequenceType: sequenceType }, thError);
				reject(thError);
			},
			(updatedDBHotel: Object) => {
				var updatedHotel: HotelDO = new HotelDO();
				updatedHotel.buildFromObject(updatedDBHotel);

				resolve({
					hotelPrefix: this.getHotelPrefix(updatedHotel),
					sequence: updatedHotel.sequences[sequenceKey] - 1
				});
			}
		);
	}
	private getHotelPrefix(hotel: HotelDO): string {
		var name = hotel.contactDetails.name;
		return name.trim().substring(0, Math.min(MongoHotelDetailsRepository.PrefixLength, name.length)).toUpperCase();
	}
}