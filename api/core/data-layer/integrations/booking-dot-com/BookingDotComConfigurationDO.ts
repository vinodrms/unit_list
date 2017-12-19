import { BaseDO } from "../../common/base/BaseDO";
import { BookingDotComAuthenticationDO } from "./authentication/BookingDotComAuthenticationDO";
import { BookingDotComHotelConfigurationDO } from "./hotel-configuration/BookingDotComHotelConfigurationDO";
import { BookingDotComRoomConfigurationsDO } from "./room-configuration/BookingDotComRoomConfigurationDO";
import { BookingDotComPriceProductConfigurationsDO } from "./price-product-configuration/BookingDotComPriceProductConfigurationDO";

export class BookingDotComConfigurationDO extends BaseDO {

    public enabled: boolean;
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