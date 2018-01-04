import {BaseController} from './base/BaseController';
import { ConfigureBookingDotComAuthentication } from '../core/domain-layer/integrations/booking-dot-com/authentication/ConfigureBookingDotComAuthentication';
import { BookingDotComAuthenticationDO } from '../core/data-layer/integrations/booking-dot-com/authentication/BookingDotComAuthenticationDO';
import { ConfigureBookingDotComHotel } from '../core/domain-layer/integrations/booking-dot-com/hotel-configuration/ConfigureBookingDotComHotel';
import { ConfigureBookingDotComPriceProducts } from '../core/domain-layer/integrations/booking-dot-com/price-product-configuration/ConfigureBookingDotComPriceProducts';
import { ConfigureBookingDotComRooms } from '../core/domain-layer/integrations/booking-dot-com/room-configuration/ConfigureBookingDotComRooms';
import { BookingDotComHotelConfigurationDO } from '../core/data-layer/integrations/booking-dot-com/hotel-configuration/BookingDotComHotelConfigurationDO';
import { ThStatusCode } from '../core/utils/th-responses/ThResponse';
import { AppContext } from '../core/utils/AppContext';
import { SessionContext } from '../core/utils/SessionContext';
import { HotelDO } from '../core/data-layer/hotel/data-objects/HotelDO';
import { BookingDotComPriceProductConfigurationsDO } from '../core/data-layer/integrations/booking-dot-com/price-product-configuration/BookingDotComPriceProductConfigurationDO';
import { BookingDotComRoomCategoryConfigurationsDO } from '../core/data-layer/integrations/booking-dot-com/room-configuration/BookingDotComRoomCategoryConfigurationDO';
import { EnableBookingDotComIntegration } from '../core/domain-layer/integrations/booking-dot-com/EnableBookingDotComIntegration';
import { BookingDotComApi } from '../core/domain-layer/integrations/booking-dot-com/BookingDotComApi';

class BookingDotComIntegrationController extends BaseController {

    public configureAuthentication(req: any, res: any) {
		var configureAuthentication = new ConfigureBookingDotComAuthentication(req.appContext, req.sessionContext);
		configureAuthentication.configure(req.body).then((updatedConfiguration: BookingDotComAuthenticationDO) => {
			this.returnSuccesfulResponse(req, res, updatedConfiguration);
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.ConfigureBookingDotComAuthenticationError);
		});
	}

	public configureHotel(req: any, res: any) {
		var configureHotel = new ConfigureBookingDotComHotel(req.appContext, req.sessionContext);
		configureHotel.configure(req.body).then((updatedConfiguration: BookingDotComHotelConfigurationDO) => {
			this.returnSuccesfulResponse(req, res, updatedConfiguration);
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.ConfigureBookingDotComHotelError);
		});
	}

	public configurePriceProducts(req: any, res: any) {
		var configurePriceProducts = new ConfigureBookingDotComPriceProducts(req.appContext, req.sessionContext);
		var updatedPPConfiguration: BookingDotComPriceProductConfigurationsDO;
		configurePriceProducts.configure(req.body).then((updatedConfiguration: BookingDotComPriceProductConfigurationsDO) => {
			updatedPPConfiguration = updatedConfiguration;
			var bookingDotComApi: BookingDotComApi = new BookingDotComApi(req.appContext, req.sessionContext);
			return bookingDotComApi.synchronizeRateCategories();
		}).then(() => {
			this.returnSuccesfulResponse(req, res, updatedPPConfiguration);
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.ConfigureBookingDotComPriceProductsError);
		});
	}

	public configureRooms(req: any, res: any) {
		var configureRooms = new ConfigureBookingDotComRooms(req.appContext, req.sessionContext);
		configureRooms.configure(req.body).then((updatedConfiguration: BookingDotComRoomCategoryConfigurationsDO) => {
			this.returnSuccesfulResponse(req, res, updatedConfiguration);
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.ConfigureBookingDotComRoomsError);
		});
	}

	public getConfiguration(req: any, res: any) {
		var appContext: AppContext = req.appContext;
		var sessionContext: SessionContext = req.sessionContext;
		appContext.getRepositoryFactory().getHotelRepository().getHotelById(sessionContext.sessionDO.hotel.id).then((hotel: HotelDO) => {
			var bookingDotComConfiguration = hotel.bookingDotComConfigurationDO;
			this.returnSuccesfulResponse(req, res, bookingDotComConfiguration);
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.GetBookingDotComConfigurationError);
		});
	}

	public setEnabled(req: any, res: any) {
		var enableBookingDotComIntegration = new EnableBookingDotComIntegration(req.appContext, req.sessionContext);
		enableBookingDotComIntegration.setEnabled(req.body["enabled"]).then((enabled: boolean) => {
			this.returnSuccesfulResponse(req, res, {enabled: enabled});
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.EnableBookingDotComIntegrationError);
		});		
	}
}

var controller = new BookingDotComIntegrationController();
module.exports = {
	configureAuthentication: controller.configureAuthentication.bind(controller),
	configureHotel: controller.configureHotel.bind(controller),
	configurePriceProducts: controller.configurePriceProducts.bind(controller),
	configureRooms: controller.configureRooms.bind(controller),
	getConfiguration: controller.getConfiguration.bind(controller),
	setEnabled: controller.setEnabled.bind(controller),
};