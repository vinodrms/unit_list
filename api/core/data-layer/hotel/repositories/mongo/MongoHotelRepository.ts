import { MongoRepository } from '../../../common/base/MongoRepository';
import { HotelDO } from '../../data-objects/HotelDO';
import { UserDO } from '../../data-objects/user/UserDO';
import { MongoHotelAccountRepository } from './actions/MongoHotelAccountRepository';
import { MongoHotelDetailsRepository } from './actions/MongoHotelDetailsRepository';
import { ActionTokenDO } from '../../data-objects/user/ActionTokenDO';
import { HotelContactDetailsDO } from '../../data-objects/hotel-contact-details/HotelContactDetailsDO';
import { GeoLocationDO } from '../../../common/data-objects/geo-location/GeoLocationDO';
import {
	IHotelRepository, HotelMetaRepoDO, BasicHotelInfoRepoDO, UserAccountActivationRepoDO, RequestResetPasswordRepoDO,
	ResetPasswordRepoDO, PaymentsPoliciesRepoDO, PropertyDetailsRepoDO, SequenceValue, BookingDotComAuthenticationRepoDO, BookingDotComHotelConfigurationRepoDO, BookingDotComRoomsConfigurationRepoDO, BookingDotComPriceProductsConfigurationRepoDO
} from '../IHotelRepository';
import { LazyLoadRepoDO } from '../../../common/repo-data-objects/LazyLoadRepoDO';
import { HotelSequenceType } from '../../data-objects/sequences/HotelSequencesDO';
import { MongoHotelIntegrationsRepository } from './actions/MongoHotelIntegrationsRepository';
import { BookingDotComConfigurationDO } from '../../../integrations/booking-dot-com/BookingDotComConfigurationDO';

declare var sails: any;

export class MongoHotelRepository extends MongoRepository implements IHotelRepository {
	private _accountActionsRepository: MongoHotelAccountRepository;
	private _hotelDetailsRepository: MongoHotelDetailsRepository;
	private _hotelIntegrationsRepository: MongoHotelIntegrationsRepository;

	constructor() {
		var hotelsEntity = sails.models.hotelsentity;
		super(hotelsEntity);
		this._accountActionsRepository = new MongoHotelAccountRepository(hotelsEntity);
		this._hotelDetailsRepository = new MongoHotelDetailsRepository(hotelsEntity);
		this._hotelIntegrationsRepository = new MongoHotelIntegrationsRepository(hotelsEntity);
	}
	public addHotel(hotel: HotelDO): Promise<HotelDO> {
		return this._accountActionsRepository.addHotel(hotel);
	}
	public getHotelByUserEmail(email: string): Promise<HotelDO> {
		return this._accountActionsRepository.getHotelByUserEmail(email);
	}
	public activateUserAccount(activationParams: UserAccountActivationRepoDO): Promise<UserDO> {
		return this._accountActionsRepository.activateUserAccount(activationParams);
	}
	public requestResetPassword(reqParams: RequestResetPasswordRepoDO): Promise<UserDO> {
		return this._accountActionsRepository.requestResetPassword(reqParams);
	}
	public resetPassword(resetParams: ResetPasswordRepoDO): Promise<UserDO> {
		return this._accountActionsRepository.resetPassword(resetParams);
	}
	public getHotelById(id: string): Promise<HotelDO> {
		return this._hotelDetailsRepository.getHotelById(id);
	}
	public getHotelList(lazyLoad: LazyLoadRepoDO): Promise<HotelDO[]> {
		return this._hotelDetailsRepository.getHotelList(lazyLoad);
	}
	public getUser(hotelId: string, userId: string): Promise<UserDO> {
		return this._hotelDetailsRepository.getUser(hotelId, userId);
	}
	public updateBasicInformation(hotelMeta: HotelMetaRepoDO, basicInfo: BasicHotelInfoRepoDO): Promise<HotelDO> {
		return this._hotelDetailsRepository.updateBasicInformation(hotelMeta, basicInfo);
	}
	public updatePaymentsPolicies(hotelMeta: HotelMetaRepoDO, paymPoliciesParams: PaymentsPoliciesRepoDO): Promise<HotelDO> {
		return this._hotelDetailsRepository.updatePaymentsPolicies(hotelMeta, paymPoliciesParams);
	}
	public updatePropertyDetails(hotelMeta: HotelMetaRepoDO, propertyDetails: PropertyDetailsRepoDO): Promise<HotelDO> {
		return this._hotelDetailsRepository.updatePropertyDetails(hotelMeta, propertyDetails);
	}
	public markConfigurationCompleted(hotelMeta: HotelMetaRepoDO, hotel: HotelDO): Promise<HotelDO> {
		return this._hotelDetailsRepository.markConfigurationCompleted(hotelMeta, hotel);
	}
	public getNextSequenceValue(hotelId: string, sequenceType: HotelSequenceType): Promise<SequenceValue> {
		return this._hotelDetailsRepository.getNextSequenceValue(hotelId, sequenceType);
	}
	public updateBookingDotComAuthentication(hotelMeta: HotelMetaRepoDO, authenticationInfo: BookingDotComAuthenticationRepoDO): Promise<HotelDO> {
		return this._hotelIntegrationsRepository.updateBookingDotComAuthentication(hotelMeta, authenticationInfo);
	}
	public updateBookingDotComHotelConfiguration(hotelMeta: HotelMetaRepoDO, hotelInfo: BookingDotComHotelConfigurationRepoDO): Promise<HotelDO> {
		return this._hotelIntegrationsRepository.updateBookingDotComHotelConfiguration(hotelMeta, hotelInfo);
	}
	public updateBookingDotComRoomsConfiguration(hotelMeta: HotelMetaRepoDO, hotelInfo: BookingDotComRoomsConfigurationRepoDO): Promise<HotelDO> {
		return this._hotelIntegrationsRepository.updateBookingDotComRoomsConfiguration(hotelMeta, hotelInfo);
	}
	public updateBookingDotComPriceProductsConfiguration(hotelMeta: HotelMetaRepoDO, hotelInfo: BookingDotComPriceProductsConfigurationRepoDO): Promise<HotelDO> {
		return this._hotelIntegrationsRepository.updateBookingDotComPriceProductsConfiguration(hotelMeta, hotelInfo);
	}
	public enableBookingDotComIntegration(hotelMeta: HotelMetaRepoDO, enabled: boolean): Promise<HotelDO> {
		return this._hotelIntegrationsRepository.enableBookingDotComIntegration(hotelMeta, enabled);		
	}
	
}