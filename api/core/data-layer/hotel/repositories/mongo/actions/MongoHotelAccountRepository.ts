import {BaseMongoRepository} from '../../../../common/base/BaseMongoRepository';
import {MongoErrorCodes} from '../../../../common/base/BaseMongoRepository';
import {ErrorContainer, ErrorCode} from '../../../../../utils/responses/ResponseWrapper';
import {Logger, LogLevel} from '../../../../../utils/logging/Logger';
import {HotelDO} from '../../../data-objects/HotelDO';
import {UserDO, AccountStatus} from '../../../data-objects/user/UserDO';
import {ActionTokenDO} from '../../../data-objects/user/ActionTokenDO';

import _ = require('underscore');

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

	public activateUserAccount(email: string, activationCode: string): Promise<UserDO> {
		return new Promise<UserDO>((resolve: { (user: UserDO): void }, reject: { (err: any): void }) => {
			this.activateUserAccountCore(resolve, reject, email, activationCode);
		});
	}
	private activateUserAccountCore(resolve: { (user: UserDO): void }, reject: { (err: any): void }, email: string, activationCode: string) {
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
				resolve(this.getUserByEmailFromHotel(updatedHotel, email));
			}).catch((err: Error) => {
				Logger.getInstance().logError(LogLevel.Error, "Error activating hotel account", { email: email, activationCode: activationCode }, err);
				reject(new ErrorContainer(ErrorCode.HotelRepositoryErrorActivatingAccount, err));
			});
	}
	public requestResetPassword(email: string, token: ActionTokenDO): Promise<UserDO> {
		return new Promise<UserDO>((resolve: { (user: UserDO): void }, reject: { (err: any): void }) => {
			this.requestResetPasswordCore(resolve, reject, email, token);
		});
	}
	private requestResetPasswordCore(resolve: { (user: UserDO): void }, reject: { (err: any): void }, email: string, token: ActionTokenDO) {
		this._hotelsEntity.update(
			{
				$and: [
					{ "users.email": email },
					{ "users.accountStatus": { $in: [AccountStatus.Active, AccountStatus.Pending] } }
				]
			}, {
				"users.$.resetPasswordToken": token
			}).then((updatedHotels: Array<Sails.QueryResult>) => {
				if (!updatedHotels || updatedHotels.length == 0) {
					Logger.getInstance().logBusiness(LogLevel.Warning, "Problem updating reset password token", { email: email, resetPasswordToken: token });
					reject(new ErrorContainer(ErrorCode.HotelRepositoryProblemUpdatingPasswordToken));
					return;
				}
				var updatedHotel: HotelDO = new HotelDO();
				updatedHotel.buildFromObject(updatedHotels[0]);
				resolve(this.getUserByEmailFromHotel(updatedHotel, email));
			}).catch((err: Error) => {
				Logger.getInstance().logError(LogLevel.Error, "Error updating reset password token", { email: email, resetPasswordToken: token }, err);
				reject(new ErrorContainer(ErrorCode.HotelRepositoryErrorUpdatingPasswordToken, err));
			});
	}
	public resetPassword(email: string, activationCode: string, newPassword: string): Promise<UserDO> {
		return new Promise<UserDO>((resolve: { (user: UserDO): void }, reject: { (err: any): void }) => {
			this.resetPasswordCore(resolve, reject, email, activationCode, newPassword);
		});
	}
	private resetPasswordCore(resolve: { (user: UserDO): void }, reject: { (err: any): void }, email: string, activationCode: string, newPassword: string) {
		var currentTimestamp = new Date().getTime();
		this._hotelsEntity.update(
			{
				$and: [
					{ "users.email": email },
					{ "users.accountStatus": { $in: [AccountStatus.Active, AccountStatus.Pending] } },
					{ "users.resetPasswordToken.code": activationCode },
					{ "users.resetPasswordToken.expiryTimestamp": { $gte: currentTimestamp } },
					{ "users.resetPasswordToken.updatedTimestamp": { $exists: false } }
				]
			}, {
				"users.$.accountStatus": AccountStatus.Active,
				"users.$.resetPasswordToken.updatedTimestamp": currentTimestamp,
				"users.$.password": newPassword
			}).then((updatedHotels: Array<Sails.QueryResult>) => {
				if (!updatedHotels || updatedHotels.length == 0) {
					Logger.getInstance().logBusiness(LogLevel.Warning, "Problem resetting password - possible errors: code expired, account is disabled, password already changed", { email: email, activationCode: activationCode });
					reject(new ErrorContainer(ErrorCode.HotelRepositoryCountNotResetPassword));
					return;
				}
				var updatedHotel: HotelDO = new HotelDO();
				updatedHotel.buildFromObject(updatedHotels[0]);
				resolve(this.getUserByEmailFromHotel(updatedHotel, email));
			}).catch((err: Error) => {
				Logger.getInstance().logError(LogLevel.Error, "Error resetting password", { email: email, activationCode: activationCode }, err);
				reject(new ErrorContainer(ErrorCode.HotelRepositoryErrorCouldNotResetPassword, err));
			});
	}
	private getUserByEmailFromHotel(hotel: HotelDO, userEmail: string): UserDO {
		return _.find(hotel.users, (currentUser: UserDO) => {
			return currentUser.email == userEmail;
		});
	}
}