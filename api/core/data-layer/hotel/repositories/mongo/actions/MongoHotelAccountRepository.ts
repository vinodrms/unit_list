import {BaseMongoRepository} from '../../../../common/base/BaseMongoRepository';
import {MongoErrorCodes} from '../../../../common/base/BaseMongoRepository';
import {ErrorContainer, ErrorCode} from '../../../../../utils/responses/ResponseWrapper';
import {Logger, LogLevel} from '../../../../../utils/logging/Logger';
import {HotelDO} from '../../../data-objects/HotelDO';
import {UserDO, AccountStatus} from '../../../data-objects/user/UserDO';

export class MongoHotelAccountRepository extends BaseMongoRepository {
	constructor(private _hotelsEntity: Sails.Model) {
		super();
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
				Logger.getInstance().logBusiness(LogLevel.Warning, "Account already exists", hotel, err);
				reject(new ErrorContainer(ErrorCode.HotelRepositoryAccountAlreadyExists, err));
			}
			else {
				Logger.getInstance().logError(LogLevel.Error, "Error adding hotel", hotel, err);
				reject(new ErrorContainer(ErrorCode.HotelRepositoryErrorAddingHotel, err));
			}
		});
	}

	public getHotelByUserEmail(email: string): Promise<HotelDO> {
		return new Promise<HotelDO>((resolve, reject) => {
			this.getHotelByUserEmailCore(resolve, reject, email);
		});
	}
	private getHotelByUserEmailCore(resolve, reject, email: string) {
		this._hotelsEntity.findOne({ "users.email": email }).then((foundHotel: Sails.QueryResult) => {
			if (!foundHotel) {
				Logger.getInstance().logBusiness(LogLevel.Info, "Invalid email to retrieve hotel", { email: email });
				reject(new ErrorContainer(ErrorCode.HotelRepositoryAccountNotFound));
				return;
			}
			var hotel: HotelDO = new HotelDO();
			hotel.buildFromObject(foundHotel);
			resolve(hotel);
		}).catch((err: Error) => {
			Logger.getInstance().logError(LogLevel.Error, "Error getting hotel by email", { email: email }, err);
			reject(new ErrorContainer(ErrorCode.HotelRepositoryErrorFindingAccount, err));
		});
	}

	public activateUserAccount(email: string, activationCode: string): Promise<HotelDO> {
		return new Promise<HotelDO>((resolve, reject) => {
			this.activateUserAccountCore(resolve, reject, email, activationCode);
		});
	}
	private activateUserAccountCore(resolve, reject, email: string, activationCode: string) {
		var currentTimestamp = new Date().getTime();
		this._hotelsEntity.update(
			{
				$and: [
					{ "users.email": email },
					{ "users.accountStatus": AccountStatus.Pending },
					{ "users.accountActivationToken.code": activationCode },
					{ "users.accountActivationToken.expiryTimestamp": { $gte: currentTimestamp } }
				]
			}, {
				"users.$.accountStatus": AccountStatus.Active,
				"users.$.accountActivationToken.updatedTimestamp": currentTimestamp
			}).then((updatedHotels: Array<Sails.QueryResult>) => {
				if (!updatedHotels || updatedHotels.length == 0) {
					Logger.getInstance().logBusiness(LogLevel.Info, "Problem activating hotel account", { email: email, activationCode: activationCode });
					reject(new ErrorContainer(ErrorCode.HotelRepositoryAccountCouldNotBeActivated));
					return;
				}
				var updatedHotel: HotelDO = new HotelDO();
				updatedHotel.buildFromObject(updatedHotels[0]);
				resolve(updatedHotel);
			}).catch((err: Error) => {
				Logger.getInstance().logError(LogLevel.Error, "Error activating hotel account", { email: email, activationCode: activationCode }, err);
				reject(new ErrorContainer(ErrorCode.HotelRepositoryErrorActivatingAccount, err));
			});
	}
}