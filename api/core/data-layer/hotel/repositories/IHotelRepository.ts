import {HotelDO} from '../data-objects/HotelDO';
import {UserDO} from '../data-objects/user/UserDO';
import {ActionTokenDO} from '../data-objects/user/ActionTokenDO';
import {HotelContactDetailsDO} from '../data-objects/hotel-contact-details/HotelContactDetailsDO';
import {GeoLocationDO} from '../../common/data-objects/geo-location/GeoLocationDO';

export interface IHotelRepository {
	addHotelAsync(hotel: HotelDO, finishAddHotelCallback: { (err: any, savedHotel?: HotelDO): void; });
	getHotelByUserEmailAsync(email: string, finishGetHotelByUserEmailCallback: { (err: any, hotel?: HotelDO): void; });
	getHotelByUserEmail(email: string): Promise<HotelDO>;
	getHotelByIdAsync(id: string, finishGetHotelByIdCallback: { (err: any, hotel?: HotelDO): void; });

	updateBasicInformationAsync(
		hotelMeta: { id: string, versionId: number },
		updates: { contactDetails: HotelContactDetailsDO, geoLocation: GeoLocationDO, logoUrl: string },
		updateBasicInformationCallback: { (err: any, updatedHotel?: HotelDO): void; }
	);

	activateUserAccount(email: string, activationCode: string): Promise<UserDO>;
	requestResetPasswordAsync(email: string, token: ActionTokenDO, finishUpdateTokenCallback: { (err: any, user?: UserDO): void; });
	resetPasswordAsync(email: string, activationCode: string, newPassword: string, finishResetPasswordCallback: { (err: any, user?: UserDO): void; });
}