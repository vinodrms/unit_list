import { ThError } from "../../../../utils/th-responses/ThError";
import { ThLogger, ThLogLevel } from "../../../../utils/logging/ThLogger";
import { ThStatusCode } from "../../../../utils/th-responses/ThResponse";
import { BookingDotComHotelConfigurationDO } from "../../../../data-layer/integrations/booking-dot-com/hotel-configuration/BookingDotComHotelConfigurationDO"
import { SessionContext } from "../../../../utils/SessionContext";
import { AppContext } from "../../../../utils/AppContext";
import { ValidationResultParser } from "../../../common/ValidationResultParser";
import { HotelDO } from "../../../../data-layer/hotel/data-objects/HotelDO";
import { HotelMetaRepoDO } from "../../../../data-layer/hotel/repositories/IHotelRepository";

export class ConfigureBookingDotComHotel {

	private inputDO: BookingDotComHotelConfigurationDO;
	private loadedHotel: HotelDO;
	
	constructor(private appContext: AppContext, private sessionContext: SessionContext) {
	}

    public configure(hotelConfigurationDO: BookingDotComHotelConfigurationDO): Promise<BookingDotComHotelConfigurationDO> {
		this.inputDO = hotelConfigurationDO;
		return new Promise<BookingDotComHotelConfigurationDO>((resolve: { (result: BookingDotComHotelConfigurationDO): void }, reject: { (err: ThError): void }) => {
			try {
				this.configureCore(resolve, reject);
			} catch (error) {
				var thError = new ThError(ThStatusCode.ConfigureBookingDotComHotelError, error);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error configuring Booking.com hotel.", this.inputDO, thError);
				reject(thError);
			}
		});
	}
	private configureCore(resolve: { (result: BookingDotComHotelConfigurationDO): void }, reject: { (err: ThError): void }) {
		var validationResult = BookingDotComHotelConfigurationDO.getValidationStructure().validateStructure(this.inputDO);
		if (!validationResult.isValid()) {
			var parser = new ValidationResultParser(validationResult, this.inputDO);
			parser.logAndReject("Error validating data for booking.com authentication", reject);
			return;
		}
		var hotelRepository = this.appContext.getRepositoryFactory().getHotelRepository();
		hotelRepository.getHotelById(this.sessionContext.sessionDO.hotel.id).then((hotel: HotelDO) => {
			this.loadedHotel = hotel;
			this.appContext.getRepositoryFactory().getHotelRepository().updateBookingDotComHotelConfiguration(this.getHotelMetaDO(), this.inputDO).then((updatedHotel: HotelDO) => {
				var updatedHotelConfigurationDO = new BookingDotComHotelConfigurationDO();
				updatedHotelConfigurationDO = updatedHotel.bookingDotComConfigurationDO.hotelConfiguration;
				resolve(updatedHotelConfigurationDO);
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