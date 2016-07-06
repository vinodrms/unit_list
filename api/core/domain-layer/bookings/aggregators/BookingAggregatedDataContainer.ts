import {HotelDO} from '../../../data-layer/hotel/data-objects/HotelDO';
import {BookingAggregatedData} from './BookingAggregatedData';

export class BookingAggregatedDataContainer {
    hotel: HotelDO;
    bookingAggregatedDataList: BookingAggregatedData[];
}