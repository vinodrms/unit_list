import {AHotelRepository} from '../AHotelRepository';
import {HotelDO} from '../../data-objects/HotelDO';
import {ResponseWrapper, ResponseStatusCode} from '../../../../utils/responses/ResponseWrapper';

export class MongoHotelRepository extends AHotelRepository {
	_hotelsEntity: Sails.Model;

	constructor() {
		super();
		this._hotelsEntity = sails.models.hotelsentity;
	}

	public addHotel(hotel: HotelDO): Promise<HotelDO> {
		return new Promise<HotelDO>((resolve, reject) => {
			this.addHotelCore(resolve, reject, hotel);
		});
	}
	private addHotelCore(resolve, reject, hotel: HotelDO) {
		this._hotelsEntity.create(hotel).then((createdHotel: Sails.QueryResult) => {
			var savedHotel: HotelDO = new HotelDO();
			savedHotel.buildFromObject(createdHotel);
			resolve(savedHotel);
		}).catch((err: Error) => {
			reject(new ResponseWrapper(ResponseStatusCode.HotelRepositoryErrorAddingHotel));
		});
	}
}