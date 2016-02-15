import {MongoRepository} from '../../../common/base/MongoRepository';
import {IRepositoryCleaner} from '../../../common/base/IRepositoryCleaner';
import {HotelDO} from '../../data-objects/HotelDO';
import {UserDO} from '../../data-objects/user/UserDO';
import {IHotelRepository} from '../IHotelRepository';
import {ActionTokenDO} from '../../data-objects/user/ActionTokenDO';

export abstract class AMongoHotelRepository extends MongoRepository implements IHotelRepository, IRepositoryCleaner {
	public addHotelAsync(hotel: HotelDO, finishAddHotelCallback: { (err: any, savedHotel?: HotelDO): void; }) {
		this.addHotel(hotel).then((savedHotel: HotelDO) => {
			finishAddHotelCallback(null, savedHotel);
		}).catch((error: any) => {
			finishAddHotelCallback(error);
		});
	}
	protected abstract addHotel(hotel: HotelDO): Promise<HotelDO>;

	public getHotelByUserEmailAsync(email: string, finishGetHotelByUserEmailCallback: { (err: any, hotel?: HotelDO): void; }) {
		this.getHotelByUserEmail(email).then((hotel: HotelDO) => {
			finishGetHotelByUserEmailCallback(null, hotel);
		}).catch((error: any) => {
			finishGetHotelByUserEmailCallback(error);
		});
	}
	public abstract getHotelByUserEmail(email: string): Promise<HotelDO>;
	public abstract cleanRepository(): Promise<Object>;

	public abstract activateUserAccount(email: string, activationCode: string): Promise<UserDO>;

	public requestResetPasswordAsync(email: string, token: ActionTokenDO, finishUpdateTokenCallback: { (err: any, user?: UserDO): void; }) {
		this.requestResetPassword(email, token).then((updatedUser: UserDO) => {
			finishUpdateTokenCallback(null, updatedUser);
		}).catch((error: any) => {
			finishUpdateTokenCallback(error);
		});
	}
	protected abstract requestResetPassword(email: string, token: ActionTokenDO): Promise<UserDO>;

	public resetPasswordAsync(email: string, activationCode: string, newPassword: string, finishResetPasswordCallback: { (err: any, user?: UserDO): void; }) {
		this.resetPassword(email, activationCode, newPassword).then((updatedUser: UserDO) => {
			finishResetPasswordCallback(null, updatedUser);
		}).catch((error: any) => {
			finishResetPasswordCallback(error);
		});
	}
	protected abstract resetPassword(email: string, activationCode: string, newPassword: string): Promise<UserDO>;
}