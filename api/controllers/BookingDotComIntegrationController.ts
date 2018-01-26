import { BaseController } from './base/BaseController';
import { BookingDotComAuthenticationDO } from '../core/data-layer/integrations/booking-dot-com/authentication/BookingDotComAuthenticationDO';
import { BookingDotComHotelConfigurationDO } from '../core/data-layer/integrations/booking-dot-com/hotel-configuration/BookingDotComHotelConfigurationDO';
import { ThStatusCode } from '../core/utils/th-responses/ThResponse';
import { AppContext } from '../core/utils/AppContext';
import { SessionContext } from '../core/utils/SessionContext';
import { HotelDO } from '../core/data-layer/hotel/data-objects/HotelDO';
import { BookingDotComPriceProductConfigurationsDO } from '../core/data-layer/integrations/booking-dot-com/price-product-configuration/BookingDotComPriceProductConfigurationDO';
import { BookingDotComRoomCategoryConfigurationsDO } from '../core/data-layer/integrations/booking-dot-com/room-configuration/BookingDotComRoomCategoryConfigurationDO';
import { ThError } from '../core/utils/th-responses/ThError';
import { ConfigureBookingDotComPriceProducts } from '../core/domain-layer/integrations/booking-dot-com/config/ConfigureBookingDotComPriceProducts';
import { ConfigureBookingDotComRooms } from '../core/domain-layer/integrations/booking-dot-com/config/ConfigureBookingDotComRooms';
import { EnableBookingDotComIntegration } from '../core/domain-layer/integrations/booking-dot-com/config/EnableBookingDotComIntegration';
import { AvailabilityApiCaller } from '../core/domain-layer/integrations/booking-dot-com/client/availability-api/AvailabilityApiCaller';
import { ConfigureBookingDotComHotel } from '../core/domain-layer/integrations/booking-dot-com/config/ConfigureBookingDotComHotel';
import { ConfigureBookingDotComAuthentication } from '../core/domain-layer/integrations/booking-dot-com/config/ConfigureBookingDotComAuthentication';

class BookingDotComIntegrationController extends BaseController {
    private readonly daysToSynchronize = 30;

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
        let configurePriceProducts = new ConfigureBookingDotComPriceProducts(req.appContext, req.sessionContext);
        let updatedPPConfiguration: BookingDotComPriceProductConfigurationsDO;
        configurePriceProducts.configure(req.body).then((updatedConfiguration: BookingDotComPriceProductConfigurationsDO) => {
            updatedPPConfiguration = updatedConfiguration;
            let availabilityApiCaller: AvailabilityApiCaller = new AvailabilityApiCaller(req.appContext, req.sessionContext);
            return availabilityApiCaller.synchronizeRateCategories(this.daysToSynchronize);
        }).then(() => {
            this.returnSuccesfulResponse(req, res, updatedPPConfiguration);
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, ThStatusCode.ConfigureBookingDotComPriceProductsError);
        });
    }

    public configureRooms(req: any, res: any) {
        let configureRooms = new ConfigureBookingDotComRooms(req.appContext, req.sessionContext);
        configureRooms.configure(req.body).then((updatedConfiguration: BookingDotComRoomCategoryConfigurationsDO) => {
            this.returnSuccesfulResponse(req, res, updatedConfiguration);
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, ThStatusCode.ConfigureBookingDotComRoomsError);
        });
    }

    public getConfiguration(req: any, res: any) {
        let appContext: AppContext = req.appContext;
        let sessionContext: SessionContext = req.sessionContext;
        appContext.getRepositoryFactory().getHotelRepository().getHotelById(sessionContext.sessionDO.hotel.id).then((hotel: HotelDO) => {
            let bookingDotComConfiguration = hotel.bookingDotComConfigurationDO;
            this.returnSuccesfulResponse(req, res, bookingDotComConfiguration);
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, ThStatusCode.GetBookingDotComConfigurationError);
        });
    }

    public setEnabled(req: any, res: any) {
        let enableBookingDotComIntegration = new EnableBookingDotComIntegration(req.appContext, req.sessionContext);
        enableBookingDotComIntegration.setEnabled(req.body["enabled"]).then((enabled: boolean) => {
            this.returnSuccesfulResponse(req, res, { enabled: enabled });
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, ThStatusCode.EnableBookingDotComIntegrationError);
        });
    }

    public synchronizeRatesAndAvailability(req: any, res: any) {
        debugger
        let availabilityApiCaller: AvailabilityApiCaller = new AvailabilityApiCaller(req.appContext, req.sessionContext);
            return availabilityApiCaller.synchronizeRateCategories(this.daysToSynchronize).then(() => {
            this.returnSuccesfulResponse(req, res, {});
        }).catch((err: any) => {
            debugger
            this.returnErrorResponse(req, res, err, ThStatusCode.SynchronizeRatesAndAvailabilityError);
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
    synchronizeRatesAndAvailability: controller.synchronizeRatesAndAvailability.bind(controller),

};
