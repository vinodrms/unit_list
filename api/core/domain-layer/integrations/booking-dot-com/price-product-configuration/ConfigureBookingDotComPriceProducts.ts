import { ThError } from "../../../../utils/th-responses/ThError";
import { ThLogger, ThLogLevel } from "../../../../utils/logging/ThLogger";
import { ThStatusCode } from "../../../../utils/th-responses/ThResponse";
import { SessionContext } from "../../../../utils/SessionContext";
import { AppContext } from "../../../../utils/AppContext";
import { ValidationResultParser } from "../../../common/ValidationResultParser";
import { HotelDO } from "../../../../data-layer/hotel/data-objects/HotelDO";
import { HotelMetaRepoDO } from "../../../../data-layer/hotel/repositories/IHotelRepository";
import { BookingDotComPriceProductConfigurationsDO } from "../../../../data-layer/integrations/booking-dot-com/price-product-configuration/BookingDotComPriceProductConfigurationDO";

export class ConfigureBookingDotComPriceProducts {

	private inputDO: BookingDotComPriceProductConfigurationsDO;
	private loadedHotel: HotelDO;
	
	constructor(private appContext: AppContext, private sessionContext: SessionContext) {
	}

    public configure(hotelConfigurationDO: BookingDotComPriceProductConfigurationsDO): Promise<BookingDotComPriceProductConfigurationsDO> {
		this.inputDO = hotelConfigurationDO;
		return new Promise<BookingDotComPriceProductConfigurationsDO>((resolve: { (result: BookingDotComPriceProductConfigurationsDO): void }, reject: { (err: ThError): void }) => {
			try {
				this.configureCore(resolve, reject);
			} catch (error) {
				var thError = new ThError(ThStatusCode.ConfigureBookingDotComHotelError, error);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error configuring Booking.com price products.", this.inputDO, thError);
				reject(thError);
			}
		});
	}
	private configureCore(resolve: { (result: BookingDotComPriceProductConfigurationsDO): void }, reject: { (err: ThError): void }) {
		var validationResult = BookingDotComPriceProductConfigurationsDO.getValidationStructure().validateStructure(this.inputDO);
		if (!validationResult.isValid()) {
			var parser = new ValidationResultParser(validationResult, this.inputDO);
			parser.logAndReject("Error validating data for booking.com price products", reject);
			return;
		}
		var hotelRepository = this.appContext.getRepositoryFactory().getHotelRepository();
		hotelRepository.getHotelById(this.sessionContext.sessionDO.hotel.id).then((hotel: HotelDO) => {
			this.loadedHotel = hotel;
			this.appContext.getRepositoryFactory().getHotelRepository().updateBookingDotComPriceProductsConfiguration(this.getHotelMetaDO(), this.inputDO).then((updatedHotel: HotelDO) => {
				var updatedPriceProductConfigurationsDO = new BookingDotComPriceProductConfigurationsDO();
				updatedPriceProductConfigurationsDO = updatedHotel.bookingDotComConfigurationDO.priceProductConfiguration;
				resolve(updatedPriceProductConfigurationsDO);
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