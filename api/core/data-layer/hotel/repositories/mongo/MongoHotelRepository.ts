import {AMongoHotelRepository} from './AMongoHotelRepository';
import {HotelDO} from '../../data-objects/HotelDO';
import {UserDO} from '../../data-objects/user/UserDO';
import {MongoHotelAccountRepository} from './actions/MongoHotelAccountRepository';
import {MongoHotelDetailsRepository} from './actions/MongoHotelDetailsRepository';
import {ActionTokenDO} from '../../data-objects/user/ActionTokenDO';
import {HotelContactDetailsDO} from '../../data-objects/hotel-contact-details/HotelContactDetailsDO';
import {GeoLocationDO} from '../../../common/data-objects/geo-location/GeoLocationDO';
import {HotelMetaRepoDO, BasicHotelInfoRepoDO, UserAccountActivationRepoDO, RequestResetPasswordRepoDO,
ResetPasswordRepoDO, PaymentsPoliciesRepoDO, PropertyDetailsRepoDO} from '../IHotelRepository';

export class MongoHotelRepository extends AMongoHotelRepository {
	private _hotelsEntity: Sails.Model;
	private _accountActionsRepository: MongoHotelAccountRepository;
	private _hotelDetailsRepository: MongoHotelDetailsRepository;

	constructor() {
		var hotelsEntity = sails.models.hotelsentity;
		super(hotelsEntity);
		this._hotelsEntity = hotelsEntity;
		this._accountActionsRepository = new MongoHotelAccountRepository(this._hotelsEntity);
		this._hotelDetailsRepository = new MongoHotelDetailsRepository(this._hotelsEntity);
	}
	protected addHotel(hotel: HotelDO): Promise<HotelDO> {
		return this._accountActionsRepository.addHotel(hotel);
	}
	public getHotelByUserEmail(email: string): Promise<HotelDO> {
		return this._accountActionsRepository.getHotelByUserEmail(email);
	}
	public activateUserAccount(activationParams: UserAccountActivationRepoDO): Promise<UserDO> {
		return this._accountActionsRepository.activateUserAccount(activationParams);
	}
	protected requestResetPassword(reqParams: RequestResetPasswordRepoDO): Promise<UserDO> {
		return this._accountActionsRepository.requestResetPassword(reqParams);
	}
	protected resetPassword(resetParams: ResetPasswordRepoDO): Promise<UserDO> {
		return this._accountActionsRepository.resetPassword(resetParams);
	}
	public cleanRepository(): Promise<Object> {
		return this._hotelsEntity.destroy({});
	}

	protected getHotelById(id: string): Promise<HotelDO> {
		return this._hotelDetailsRepository.getHotelById(id);
	}
	protected updateBasicInformation(hotelMeta: HotelMetaRepoDO, basicInfo: BasicHotelInfoRepoDO): Promise<HotelDO> {
		return this._hotelDetailsRepository.updateBasicInformation(hotelMeta, basicInfo);
	}
	protected updatePaymentsPolicies(hotelMeta: HotelMetaRepoDO, paymPoliciesParams: PaymentsPoliciesRepoDO): Promise<HotelDO> {
		return this._hotelDetailsRepository.updatePaymentsPolicies(hotelMeta, paymPoliciesParams);
	}
	protected updatePropertyDetails(hotelMeta: HotelMetaRepoDO, propertyDetails: PropertyDetailsRepoDO): Promise<HotelDO> {
		return this._hotelDetailsRepository.updatePropertyDetails(hotelMeta, propertyDetails);
	}
}