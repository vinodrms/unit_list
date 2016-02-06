import {MongoErrorCodes} from '../../../common/base/BaseMongoRepository';
import {ErrorContainer, ErrorCode} from '../../../../utils/responses/ResponseWrapper';
import {Logger} from '../../../../utils/logging/Logger';
import {AMongoHotelRepository} from './AMongoHotelRepository';
import {HotelDO} from '../../data-objects/HotelDO';

export class MongoHotelRepository extends AMongoHotelRepository {
	private _hotelsEntity: Sails.Model;

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
			var errorCode = this.getMongoErrorCode(err);
			if (errorCode == MongoErrorCodes.DuplicateKeyError) {
				Logger.getInstance().logBusiness("Account already exists", hotel, err);
				reject(new ErrorContainer(ErrorCode.HotelRepositoryAccountAlreadyExists, err));
			}
			else {
				Logger.getInstance().logError("Error adding hotel", hotel, err);
				reject(new ErrorContainer(ErrorCode.HotelRepositoryErrorAddingHotel, err));
			}
		});
	}
	cleanRepository(): Promise<Object> {
		return this._hotelsEntity.destroy({});
	}
}