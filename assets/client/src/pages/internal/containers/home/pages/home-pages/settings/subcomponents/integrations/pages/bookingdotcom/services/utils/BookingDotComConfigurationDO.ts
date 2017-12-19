import { BaseDO } from "../../../../../../../../../../../../../common/base/BaseDO";
import { BookingDotComAuthenticationDO } from "../../steps/authentication/utils/BookingDotComIntegrationAuthenticationDO";
import { BookingDotComHotelConfigurationDO } from "../../steps/hotel-configuration/utils/BookingDotComIntegrationHotelConfigurationDO";
import { BookingDotComPriceProductConfigurationsDO } from "../../steps/price-product-configuration/utils/BookingDotComPriceProductConfigurationDO";
import { BookingDotComRoomConfigurationsDO } from "../../steps/room-configuration/utils/BookingDotComRoomConfigurationDO";

export class BookingDotComConfigurationDO extends BaseDO {
    
        public enabled: boolean = false;
        public authentication: BookingDotComAuthenticationDO;
        public hotelConfiguration: BookingDotComHotelConfigurationDO;
        public roomConfiguration: BookingDotComRoomConfigurationsDO;
        public priceProductConfiguration: BookingDotComPriceProductConfigurationsDO;
    
        protected getPrimitivePropertyKeys(): string[] {
            return ["enabled"];
        }
    
        public buildFromObject(object: Object) {
            super.buildFromObject(object);
    
            this.authentication = new BookingDotComAuthenticationDO();
            this.authentication.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "authentication"));
            this.hotelConfiguration = new BookingDotComHotelConfigurationDO();
            this.hotelConfiguration.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "hotelConfiguration"));
            this.roomConfiguration = new BookingDotComRoomConfigurationsDO();
            this.roomConfiguration.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "roomConfiguration"));
            this.priceProductConfiguration = new BookingDotComPriceProductConfigurationsDO();
            this.priceProductConfiguration.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "priceProductConfiguration"));
    
        }
}