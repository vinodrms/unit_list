import {ResponseStatusCode, ResponseWrapper} from '../../../utils/responses/ResponseWrapper';
import {HotelDO} from '../data-objects/HotelDO';

export abstract class AHotelRepository {
	public addHotelAsyncWrapper(hotel : HotelDO, finishAddHotelCallback: { (err: ResponseWrapper, savedHotel? : HotelDO): void; }) {
		this.addHotel(hotel).then((savedHotel: HotelDO) => {
			finishAddHotelCallback(null, savedHotel);
		}).catch((error: ResponseWrapper) => {
			finishAddHotelCallback(error);
		});
	}
	public abstract addHotel(hotel : HotelDO) : Promise<HotelDO>;
}