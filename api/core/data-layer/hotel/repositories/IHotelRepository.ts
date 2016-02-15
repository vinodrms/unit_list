import {HotelDO} from '../data-objects/HotelDO';
import {UserDO} from '../data-objects/user/UserDO';
import {ActionTokenDO} from '../data-objects/user/ActionTokenDO';

export interface IHotelRepository {
	addHotelAsync(hotel: HotelDO, finishAddHotelCallback: { (err: any, savedHotel?: HotelDO): void; });
	getHotelByUserEmailAsync(email: string, finishGetHotelByUserEmailCallback: { (err: any, hotel?: HotelDO): void; });
	getHotelByUserEmail(email: string): Promise<HotelDO>;

	activateUserAccount(email: string, activationCode: string): Promise<UserDO>;
	requestResetPasswordAsync(email: string, token: ActionTokenDO, finishUpdateTokenCallback: { (err: any, user?: UserDO): void; });
	resetPasswordAsync(email: string, activationCode: string, newPassword: string, finishResetPasswordCallback: { (err: any, user?: UserDO): void; });
}