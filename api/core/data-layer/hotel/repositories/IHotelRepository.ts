import { HotelDO } from '../data-objects/HotelDO';
import { UserDO } from '../data-objects/user/UserDO';
import { ActionTokenDO } from '../data-objects/user/ActionTokenDO';
import { HotelContactDetailsDO } from '../data-objects/hotel-contact-details/HotelContactDetailsDO';
import { GeoLocationDO } from '../../common/data-objects/geo-location/GeoLocationDO';
import { OperationHoursDO } from '../data-objects/operation-hours/OperationHoursDO';
import { LazyLoadRepoDO } from '../../common/repo-data-objects/LazyLoadRepoDO';
import { HotelSequenceType } from '../data-objects/sequences/HotelSequencesDO';
import { PaymentMethodInstanceDO } from "../../common/data-objects/payment-method/PaymentMethodInstanceDO";

export interface UserAccountActivationRepoDO {
	email: string;
	activationCode: string;
}
export interface RequestResetPasswordRepoDO {
	email: string;
	token: ActionTokenDO;
}
export interface ResetPasswordRepoDO {
	email: string;
	activationCode: string;
	newPassword: string;
}

export interface HotelMetaRepoDO {
	id: string;
	versionId: number;
}
export interface BasicHotelInfoRepoDO {
	contactDetails: HotelContactDetailsDO;
	geoLocation: GeoLocationDO;
	logoUrl: string;
}
export interface PaymentsPoliciesRepoDO {
	ccyCode: string;
	paymentMethodList: PaymentMethodInstanceDO[];
	additionalInvoiceDetails: string;
	paymentDueInDays: number;
}
export interface PropertyDetailsRepoDO {
	operationHours: OperationHoursDO;
	timezone: string;
	amenityIdList: string[];
}
export interface SequenceValue {
	hotelPrefix: string;
	sequence: number;
}

export interface IHotelRepository {
	addHotel(hotel: HotelDO): Promise<HotelDO>;
	activateUserAccount(activationParams: UserAccountActivationRepoDO): Promise<UserDO>;
	requestResetPassword(reqParams: RequestResetPasswordRepoDO): Promise<UserDO>;
	resetPassword(resetParams: ResetPasswordRepoDO): Promise<UserDO>;

	getHotelByUserEmail(email: string): Promise<HotelDO>;
	getHotelById(id: string): Promise<HotelDO>;
	getHotelList(lazyLoad: LazyLoadRepoDO): Promise<HotelDO[]>;

	getUser(hotelId: string, userId: string): Promise<UserDO>;

	updateBasicInformation(hotelMeta: HotelMetaRepoDO, basicInfo: BasicHotelInfoRepoDO): Promise<HotelDO>;
	updatePaymentsPolicies(hotelMeta: HotelMetaRepoDO, paymPoliciesParams: PaymentsPoliciesRepoDO): Promise<HotelDO>;
	updatePropertyDetails(hotelMeta: HotelMetaRepoDO, propertyDetails: PropertyDetailsRepoDO): Promise<HotelDO>;
	markConfigurationCompleted(hotelMeta: HotelMetaRepoDO, hotel: HotelDO): Promise<HotelDO>;

	getNextSequenceValue(hotelId: string, sequenceType: HotelSequenceType): Promise<SequenceValue>;
}