import {ThLogger, ThLogLevel} from '../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {MongoRepository, MongoErrorCodes} from '../../../../common/base/MongoRepository';
import {HotelDO} from '../../../data-objects/HotelDO';
import {HotelContactDetailsDO} from '../../../data-objects/hotel-contact-details/HotelContactDetailsDO';
import {GeoLocationDO} from '../../../../common/data-objects/geo-location/GeoLocationDO';
import {HotelMetaRepoDO, BasicHotelInfoRepoDO, PaymentsPoliciesRepoDO, PaymentMethodIdListRepoDO} from '../../IHotelRepository';

export class MongoHotelDetailsRepository extends MongoRepository {
	constructor(private _hotelsEntity: Sails.Model) {
		super(_hotelsEntity);
	}
	public getHotelById(id: string): Promise<HotelDO> {
		return new Promise<HotelDO>((resolve, reject) => {
			this.getHotelByIdCore(resolve, reject, id);
		});
	}
	private getHotelByIdCore(resolve: { (result: HotelDO): void }, reject: { (err: ThError): void }, id: string) {
		this._hotelsEntity.findOne({ "id": id }).then((foundHotel: Sails.QueryResult) => {
			if (!foundHotel) {
				var thError = new ThError(ThStatusCode.HotelRepositoryHotelIdNotFound, null);
				ThLogger.getInstance().logBusiness(ThLogLevel.Info, "Invalid id to retrieve hotel", { id: id }, thError);
				reject(thError);
				return;
			}
			var hotel: HotelDO = new HotelDO();
			hotel.buildFromObject(foundHotel);
			resolve(hotel);
		}).catch((err: Error) => {
			var thError = new ThError(ThStatusCode.HotelRepositoryErrorFindingHotelById, err);
			ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting hotel by id", { id: id }, thError);
			reject(thError);
		});
	}
	public updateBasicInformation(hotelMeta: HotelMetaRepoDO, basicInfo: BasicHotelInfoRepoDO): Promise<HotelDO> {
		return this.findAndModifyHotel(hotelMeta, {
			"contactDetails": basicInfo.contactDetails,
			"geoLocation": basicInfo.geoLocation,
			"logoUrl": basicInfo.logoUrl
		});
	}
	public addPaymentsPolicies(hotelMeta: HotelMetaRepoDO, paymPoliciesParams: PaymentsPoliciesRepoDO): Promise<HotelDO> {
		return this.findAndModifyHotel(hotelMeta, {
			"paymentMethodIdList": paymPoliciesParams.paymentMethodIdList,
			"ccyCode": paymPoliciesParams.ccyCode,
			"taxes": paymPoliciesParams.taxes
		});
	}
	public updatePaymentMethodIdList(hotelMeta: HotelMetaRepoDO, updatePaymMethodParams: PaymentMethodIdListRepoDO): Promise<HotelDO> {
		return this.findAndModifyHotel(hotelMeta, {
			"paymentMethodIdList": updatePaymMethodParams.paymentMethodIdList
		});
	}

	private findAndModifyHotel(hotelMeta: { id: string, versionId: number }, updateQuery: Object): Promise<HotelDO> {
		return new Promise<HotelDO>((resolve: { (updatedHotel: HotelDO): void }, reject: { (err: any): void }) => {
			this.findAndModifyHotelCore(resolve, reject, hotelMeta, updateQuery);
		});
	}
	private findAndModifyHotelCore(resolve: { (updatedHotel: HotelDO): void }, reject: { (err: ThError): void }, hotelMeta: { id: string, versionId: number }, updateQuery: any) {
		updateQuery.$inc = { "versionId": 1 };
		this.findAndModify(
			{
				$and: [
					{ "id": hotelMeta.id },
					{ "versionId": hotelMeta.versionId }
				]
			}, updateQuery).then((updatedDBHotel: Object) => {
				if (!updatedDBHotel) {
					var thError = new ThError(ThStatusCode.HotelDetailsRepositoryProblemUpdatingAccount, null);
					ThLogger.getInstance().logBusiness(ThLogLevel.Info, "Problem updating account - concurrency", { hotelMeta: hotelMeta, updateQuery: updateQuery }, thError);
					reject(thError);
					return;
				}
				var updatedHotel: HotelDO = new HotelDO();
				updatedHotel.buildFromObject(updatedDBHotel);
				resolve(updatedHotel);
			}).catch((err: Error) => {
				var thError = new ThError(ThStatusCode.HotelDetailsRepositoryErrorUpdatingAccount, err);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error activating hotel account", { hotelMeta: hotelMeta, updateQuery: updateQuery }, thError);
				reject(thError);
			});
	}
}