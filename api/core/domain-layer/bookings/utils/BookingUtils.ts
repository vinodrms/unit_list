import {HotelDO} from '../../../data-layer/hotel/data-objects/HotelDO';
import {ThDateDO} from '../../../utils/th-dates/data-objects/ThDateDO';
import {ThTimestampDO} from '../../../utils/th-dates/data-objects/ThTimestampDO';

export class BookingUtils {
    public getCurrentThDateForHotel(hotelDO: HotelDO): ThDateDO {
        var hotelTimestamp = this.getCurrentThTimestampForHotel(hotelDO);
        return hotelTimestamp.thDateDO;
    }
    public getCurrentThTimestampForHotel(hotelDO: HotelDO): ThTimestampDO {
        return ThTimestampDO.buildThTimestampForTimezone(hotelDO.timezone);
    }
}