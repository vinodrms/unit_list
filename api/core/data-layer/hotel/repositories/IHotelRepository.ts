import {HotelDO} from '../data-objects/HotelDO';
import {UserDO} from '../data-objects/user/UserDO';
import {ActionTokenDO} from '../data-objects/user/ActionTokenDO';
import {HotelContactDetailsDO} from '../data-objects/hotel-contact-details/HotelContactDetailsDO';
import {GeoLocationDO} from '../../common/data-objects/geo-location/GeoLocationDO';
import {OperationHoursDO} from '../data-objects/operation-hours/OperationHoursDO';

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
	paymentMethodIdList: string[];
}
export interface PropertyDetailsRepoDO {
	operationHours: OperationHoursDO;
	timezone: string;
	amenityIdList: string[];
}

export interface IHotelRepository {
	addHotelAsync(hotel: HotelDO, finishAddHotelCallback: { (err: any, savedHotel?: HotelDO): void; });
	activateUserAccount(activationParams: UserAccountActivationRepoDO): Promise<UserDO>;
	requestResetPasswordAsync(reqParams: RequestResetPasswordRepoDO, finishUpdateTokenCallback: { (err: any, user?: UserDO): void; });
	resetPasswordAsync(resetParams: ResetPasswordRepoDO, finishResetPasswordCallback: { (err: any, user?: UserDO): void; });

	getHotelByUserEmailAsync(email: string, finishGetHotelByUserEmailCallback: { (err: any, hotel?: HotelDO): void; });
	getHotelByUserEmail(email: string): Promise<HotelDO>;
	getHotelByIdAsync(id: string, finishGetHotelByIdCallback: { (err: any, hotel?: HotelDO): void; });

	updateBasicInformationAsync(hotelMeta: HotelMetaRepoDO, basicInfo: BasicHotelInfoRepoDO, updateBasicInformationCallback: { (err: any, updatedHotel?: HotelDO): void; });
	updatePaymentsPoliciesAsync(hotelMeta: HotelMetaRepoDO, paymPoliciesParams: PaymentsPoliciesRepoDO, addPaymentsPoliciesCallback: { (err: any, updatedHotel?: HotelDO): void; });
	updatePropertyDetailsAsync(hotelMeta: HotelMetaRepoDO, propertyDetails: PropertyDetailsRepoDO, updatePropertyDetailsCallback: { (err: any, updatedHotel?: HotelDO): void; });
}