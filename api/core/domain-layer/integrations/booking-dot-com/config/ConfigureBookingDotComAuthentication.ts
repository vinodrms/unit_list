import { ThError } from "../../../../utils/th-responses/ThError";
import { ThLogger, ThLogLevel } from "../../../../utils/logging/ThLogger";
import { ThStatusCode } from "../../../../utils/th-responses/ThResponse";
import { BookingDotComAuthenticationDO } from "../../../../data-layer/integrations/booking-dot-com/authentication/BookingDotComAuthenticationDO"
import { SessionContext } from "../../../../utils/SessionContext";
import { AppContext } from "../../../../utils/AppContext";
import { ValidationResultParser } from "../../../common/ValidationResultParser";
import { HotelDO } from "../../../../data-layer/hotel/data-objects/HotelDO";
import { HotelMetaRepoDO } from "../../../../data-layer/hotel/repositories/IHotelRepository";

export class ConfigureBookingDotComAuthentication {

	private inputDO: BookingDotComAuthenticationDO;
	private loadedHotel: HotelDO;

	constructor(private appContext: AppContext, private sessionContext: SessionContext) {
	}

    public configure(authenticationDO: BookingDotComAuthenticationDO): Promise<BookingDotComAuthenticationDO> {
		this.inputDO = authenticationDO;
		return new Promise<BookingDotComAuthenticationDO>((resolve: { (result: BookingDotComAuthenticationDO): void }, reject: { (err: ThError): void }) => {
			try {
				this.configureCore(resolve, reject);
			} catch (error) {
				var thError = new ThError(ThStatusCode.ConfigureBookingDotComAuthenticationError, error);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error configuring Booking.com authentication.", this.inputDO, thError);
				reject(thError);
			}
		});
	}
	private configureCore(resolve: { (result: BookingDotComAuthenticationDO): void }, reject: { (err: ThError): void }) {
		var validationResult = BookingDotComAuthenticationDO.getValidationStructure().validateStructure(this.inputDO);
		if (!validationResult.isValid()) {
			var parser = new ValidationResultParser(validationResult, this.inputDO);
			parser.logAndReject("Error validating data for booking.com authentication", reject);
			return;
		}
		var hotelRepository = this.appContext.getRepositoryFactory().getHotelRepository();
		hotelRepository.getHotelById(this.sessionContext.sessionDO.hotel.id).then((hotel: HotelDO) => {
			this.loadedHotel = hotel;
			this.appContext.getRepositoryFactory().getHotelRepository().updateBookingDotComAuthentication(this.getHotelMetaDO(), this.inputDO).then((updatedHotel: HotelDO) => {
				var updatedAuthenticationDO = new BookingDotComAuthenticationDO();
				updatedAuthenticationDO = updatedHotel.bookingDotComConfigurationDO.authentication;
				resolve(updatedAuthenticationDO);
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
