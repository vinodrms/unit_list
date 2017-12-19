import { ThError } from "../../../utils/th-responses/ThError";
import { ThLogger, ThLogLevel } from "../../../utils/logging/ThLogger";
import { ThStatusCode } from "../../../utils/th-responses/ThResponse";
import { SessionContext } from "../../../utils/SessionContext";
import { AppContext } from "../../../utils/AppContext";
import { ValidationResultParser } from "../../common/ValidationResultParser";
import { HotelDO } from "../../../data-layer/hotel/data-objects/HotelDO";
import { HotelMetaRepoDO } from "../../../data-layer/hotel/repositories/IHotelRepository";

export class EnableBookingDotComIntegration {

    private enabled: boolean;
	private loadedHotel: HotelDO;
	
	constructor(private appContext: AppContext, private sessionContext: SessionContext) {
	}

    public setEnabled(enabled: boolean): Promise<boolean> {
        this.enabled = enabled;
		return new Promise<boolean>((resolve: { (result: boolean): void }, reject: { (err: ThError): void }) => {
			try {
				this.setEnabledCore(resolve, reject);
			} catch (error) {
				var thError = new ThError(ThStatusCode.ConfigureBookingDotComHotelError, error);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error enabling Booking.com integration.", this.enabled, thError);
				reject(thError);
			}
		});
	}
	private setEnabledCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {

		var hotelRepository = this.appContext.getRepositoryFactory().getHotelRepository();
		hotelRepository.getHotelById(this.sessionContext.sessionDO.hotel.id).then((hotel: HotelDO) => {
			this.loadedHotel = hotel;
			this.appContext.getRepositoryFactory().getHotelRepository().enableBookingDotComIntegration(this.getHotelMetaDO(), this.enabled).then((updatedHotel: HotelDO) => {
				resolve(updatedHotel.bookingDotComConfigurationDO.enabled);
			}).catch((error: any) => {
				reject(error);
			});
		});
	}
	private getHotelMetaDO(): HotelMetaRepoDO {
		return {
			id: this.loadedHotel.id,
			versionId: this.loadedHotel.versionId
		};
	}
}