import {BaseMongoRepository} from '../../../common/base/BaseMongoRepository';
import {IRepositoryCleaner} from '../../../common/base/IRepositoryCleaner';
import {HotelDO} from '../../data-objects/HotelDO';
import {IHotelRepository} from '../IHotelRepository';

export abstract class AMongoHotelRepository extends BaseMongoRepository implements IHotelRepository, IRepositoryCleaner {
	public addHotelAsyncWrapper(hotel: HotelDO, finishAddHotelCallback: { (err: any, savedHotel?: HotelDO): void; }) {
		this.addHotel(hotel).then((savedHotel: HotelDO) => {
			finishAddHotelCallback(null, savedHotel);
		}).catch((error: any) => {
			finishAddHotelCallback(error);
		});
	}
	public abstract addHotel(hotel: HotelDO): Promise<HotelDO>;
	public abstract cleanRepository(): Promise<Object>;
}