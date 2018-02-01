import { HotelMetaRepoDO, BookingDotComAuthenticationRepoDO, BookingDotComHotelConfigurationRepoDO, BookingDotComRoomCategoriessConfigurationRepoDO, BookingDotComPriceProductsConfigurationRepoDO } from "../../IHotelRepository";
import { MongoRepository } from "../../../../common/base/MongoRepository";
import { HotelDO } from "../../../data-objects/HotelDO";
import { ThError } from "../../../../../utils/th-responses/ThError";
import { ThStatusCode } from "../../../../../utils/th-responses/ThResponse";
import { ThLogLevel, ThLogger } from "../../../../../utils/logging/ThLogger";

export class MongoHotelIntegrationsRepository extends MongoRepository {

	constructor(hotelsEntity: any) {
		super(hotelsEntity);
    }

  	public updateBookingDotComAuthentication(hotelMeta: HotelMetaRepoDO, authenticationInfo: BookingDotComAuthenticationRepoDO): Promise<HotelDO> {
		return this.findAndModifyHotel(hotelMeta, {
			"bookingDotCom.authentication": authenticationInfo
		});
	}
	public updateBookingDotComHotelConfiguration(hotelMeta: HotelMetaRepoDO, hotelConfigurationInfo: BookingDotComHotelConfigurationRepoDO): Promise<HotelDO> {
		return this.findAndModifyHotel(hotelMeta, {
			"bookingDotCom.hotelConfiguration": hotelConfigurationInfo
		});
	}
	public updateBookingDotComRoomCategoriesConfiguration(hotelMeta: HotelMetaRepoDO, roomCategoryConfigurationInfo: BookingDotComRoomCategoriessConfigurationRepoDO): Promise<HotelDO> {
		return this.findAndModifyHotel(hotelMeta, {
			"bookingDotCom.roomCategoryConfiguration": roomCategoryConfigurationInfo
		});
	}
	public updateBookingDotComPriceProductsConfiguration(hotelMeta: HotelMetaRepoDO, priceProductConfigurationInfo: BookingDotComPriceProductsConfigurationRepoDO): Promise<HotelDO> {
		return this.findAndModifyHotel(hotelMeta, {
			"bookingDotCom.priceProductConfiguration": priceProductConfigurationInfo
		});
	}
	public enableBookingDotComIntegration(hotelMeta: HotelMetaRepoDO, enabled: boolean): Promise<HotelDO> {
		return this.findAndModifyHotel(hotelMeta, {
			"bookingDotCom.enabled": enabled
		});
    }
    public updateLastSyncTimestamp(hotelMeta: HotelMetaRepoDO, lastSyncTimestamp: number) {
        return this.findAndModifyHotel(hotelMeta, {
			"bookingDotCom.lastSyncTimestamp": lastSyncTimestamp
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
				ThLogger.getInstance().logBusiness(ThLogLevel.Info, "Problem updating hotel integration data - concurrency", { hotelMeta: hotelMeta, updateQuery: updateQuery }, thError);
				reject(thError);
			},
			(err: Error) => {
				var thError = new ThError(ThStatusCode.HotelDetailsRepositoryErrorUpdatingAccount, err);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error updatigng hotel integration data", { hotelMeta: hotelMeta, updateQuery: updateQuery }, thError);
				reject(thError);
			},
			(updatedDBHotel: Object) => {
				var updatedHotel: HotelDO = new HotelDO();
				updatedHotel.buildFromObject(updatedDBHotel);
				resolve(updatedHotel);
			}
		);
	}
}
