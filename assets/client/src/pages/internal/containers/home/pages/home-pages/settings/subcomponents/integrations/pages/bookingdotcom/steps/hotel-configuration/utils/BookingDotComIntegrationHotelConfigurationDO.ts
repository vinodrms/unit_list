import { BaseDO } from "../../../../../../../../../../../../../../common/base/BaseDO";

export class BookingDotComHotelConfigurationDO extends BaseDO {
    hotelId: string;

    protected getPrimitivePropertyKeys(): string[] {
        return ["hotelId"];
    }
}