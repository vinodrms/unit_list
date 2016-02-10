import {MongoErrorCodes} from '../../../common/base/BaseMongoRepository';
import {ErrorContainer, ErrorCode} from '../../../../utils/responses/ResponseWrapper';
import {Logger} from '../../../../utils/logging/Logger';
import {AMongoHotelRepository} from './AMongoHotelRepository';
import {HotelDO} from '../../data-objects/HotelDO';
import {UserDO} from '../../data-objects/user/UserDO';
import {MongoHotelAccountRepository} from './actions/MongoHotelAccountRepository';
import {ActionTokenDO} from '../../data-objects/user/ActionTokenDO';

export class MongoHotelRepository extends AMongoHotelRepository {
	private _hotelsEntity: Sails.Model;
	private _accountActionsRepository: MongoHotelAccountRepository;

	constructor() {
		super();
		this._hotelsEntity = sails.models.hotelsentity;
		this._accountActionsRepository = new MongoHotelAccountRepository(this._hotelsEntity);
	}
	protected addHotel(hotel: HotelDO): Promise<HotelDO> {
		return this._accountActionsRepository.addHotel(hotel);
	}
	public getHotelByUserEmail(email: string): Promise<HotelDO> {
		return this._accountActionsRepository.getHotelByUserEmail(email);
	}
	public activateUserAccount(email: string, activationCode: string): Promise<UserDO> {
		return this._accountActionsRepository.activateUserAccount(email, activationCode);
	}
	protected requestResetPassword(email: string, token: ActionTokenDO): Promise<UserDO> {
		return this._accountActionsRepository.requestResetPassword(email, token);
	}
	protected resetPassword(email: string, activationCode: string, newPassword: string): Promise<UserDO> {
		return this._accountActionsRepository.resetPassword(email, activationCode, newPassword);
	}
	public cleanRepository(): Promise<Object> {
		return this._hotelsEntity.destroy({});
	}
}