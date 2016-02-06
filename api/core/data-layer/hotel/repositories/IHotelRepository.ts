import {HotelDO} from '../data-objects/HotelDO';

export interface IHotelRepository {
	addHotelAsyncWrapper(hotel: HotelDO, finishAddHotelCallback: { (err: any, savedHotel?: HotelDO): void; });
	addHotel(hotel: HotelDO): Promise<HotelDO>;
}