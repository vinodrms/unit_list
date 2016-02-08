import {HotelDO} from '../data-objects/HotelDO';

export interface IHotelRepository {
	addHotelAsync(hotel: HotelDO, finishAddHotelCallback: { (err: any, savedHotel?: HotelDO): void; });
	addHotel(hotel: HotelDO): Promise<HotelDO>;
	getHotelByUserEmail(email: string): Promise<HotelDO>;
}