import {ThLogger, ThLogLevel} from '../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {MongoRepository, MongoErrorCodes} from '../../../../common/base/MongoRepository';
import {HotelDO} from '../../../data-objects/HotelDO';
import {UserDO, AccountStatus} from '../../../data-objects/user/UserDO';
import {ActionTokenDO} from '../../../data-objects/user/ActionTokenDO';

import _ = require('underscore');

export class MongoHotelAccountRepository extends MongoRepository {
	constructor(private _hotelsEntity: Sails.Model) {
		super(_hotelsEntity);
	}
	public addHotel(hotel: HotelDO): Promise<HotelDO> {
		return new Promise<HotelDO>((resolve, reject) => {
			this.addHotelCore(resolve, reject, hotel);
		});
	}
	private addHotelCore(resolve: { (result: HotelDO): void }, reject: { (err: ThError): void }, hotel: HotelDO) {
		this._hotelsEntity.create(hotel).then((createdHotel: Sails.QueryResult) => {
			var savedHotel: HotelDO = new HotelDO();
			savedHotel.buildFromObject(createdHotel);
			resolve(savedHotel);
		}).catch((err: Error) => {
			var errorCode = this.getMongoErrorCode(err);
			if (errorCode == MongoErrorCodes.DuplicateKeyError) {
				var thError = new ThError(ThStatusCode.HotelRepositoryAccountAlreadyExists, err);
				ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Account already exists", hotel, thError);
				reject(thError);
			}
			else {
				var thError = new ThError(ThStatusCode.HotelRepositoryErrorAddingHotel, err);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error adding hotel", hotel, thError);
				reject(thError);
			}
		});
	}

	public getHotelByUserEmail(email: string): Promise<HotelDO> {
		return new Promise<HotelDO>((resolve, reject) => {
			this.getHotelByUserEmailCore(resolve, reject, email);
		});
	}
	private getHotelByUserEmailCore(resolve: { (result: HotelDO): void }, reject: { (err: ThError): void }, email: string) {
		this._hotelsEntity.findOne({ "users.email": email }).then((foundHotel: Sails.QueryResult) => {
			if (!foundHotel) {
				var thError = new ThError(ThStatusCode.HotelRepositoryAccountNotFound, null);
				ThLogger.getInstance().logBusiness(ThLogLevel.Info, "Invalid email to retrieve hotel", { email: email }, thError);
				reject(thError);
				return;
			}
			var hotel: HotelDO = new HotelDO();
			hotel.buildFromObject(foundHotel);
			resolve(hotel);
		}).catch((err: Error) => {
			var thError = new ThError(ThStatusCode.HotelRepositoryErrorFindingAccount, err);
			ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting hotel by email", { email: email }, thError);
			reject(thError);
		});
	}

	public activateUserAccount(email: string, activationCode: string): Promise<UserDO> {
		return new Promise<UserDO>((resolve: { (user: UserDO): void }, reject: { (err: any): void }) => {
			this.activateUserAccountCore(resolve, reject, email, activationCode);
		});
	}
	private activateUserAccountCore(resolve: { (user: UserDO): void }, reject: { (err: ThError): void }, email: string, activationCode: string) {
		var currentTimestamp = new Date().getTime();
		this.findAndModify(
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
			}).then((updatedDBHotel: Object) => {
				if (!updatedDBHotel) {
					var thError = new ThError(ThStatusCode.HotelRepositoryAccountCouldNotBeActivated, null);
					ThLogger.getInstance().logBusiness(ThLogLevel.Info, "Problem activating hotel account", { email: email, activationCode: activationCode }, thError);
					reject(thError);
					return;
				}
				var updatedHotel: HotelDO = new HotelDO();
				updatedHotel.buildFromObject(updatedDBHotel);
				resolve(this.getUserByEmailFromHotel(updatedHotel, email));
			}).catch((err: Error) => {
				var thError = new ThError(ThStatusCode.HotelRepositoryErrorActivatingAccount, err);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error activating hotel account", { email: email, activationCode: activationCode }, thError);
				reject(thError);
			});
	}
	public requestResetPassword(email: string, token: ActionTokenDO): Promise<UserDO> {
		return new Promise<UserDO>((resolve: { (user: UserDO): void }, reject: { (err: any): void }) => {
			this.requestResetPasswordCore(resolve, reject, email, token);
		});
	}
	private requestResetPasswordCore(resolve: { (user: UserDO): void }, reject: { (err: ThError): void }, email: string, token: ActionTokenDO) {
		this.findAndModify(
			{
				$and: [
					{ "users.email": email },
					{ "users.accountStatus": { $in: [AccountStatus.Active, AccountStatus.Pending] } }
				]
			}, {
				"users.$.resetPasswordToken": token
			}).then((updatedDBHotel: Object) => {
				if (!updatedDBHotel) {
					var thError = new ThError(ThStatusCode.HotelRepositoryProblemUpdatingPasswordToken, null);
					ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Problem updating reset password token", { email: email, resetPasswordToken: token }, thError);
					reject(thError);
					return;
				}
				var updatedHotel: HotelDO = new HotelDO();
				updatedHotel.buildFromObject(updatedDBHotel);
				resolve(this.getUserByEmailFromHotel(updatedHotel, email));
			}).catch((err: Error) => {
				var thError = new ThError(ThStatusCode.HotelRepositoryErrorUpdatingPasswordToken, err);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error updating reset password token", { email: email, resetPasswordToken: token }, thError);
				reject(thError);
			});
	}
	public resetPassword(email: string, activationCode: string, newPassword: string): Promise<UserDO> {
		return new Promise<UserDO>((resolve: { (user: UserDO): void }, reject: { (err: any): void }) => {
			this.resetPasswordCore(resolve, reject, email, activationCode, newPassword);
		});
	}
	private resetPasswordCore(resolve: { (user: UserDO): void }, reject: { (err: ThError): void }, email: string, activationCode: string, newPassword: string) {
		var currentTimestamp = new Date().getTime();
		this.findAndModify(
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
			}).then((updatedDBHotel: Object) => {
				if (!updatedHotel) {
					var thError = new ThError(ThStatusCode.HotelRepositoryCouldNotResetPassword, null);
					ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Problem resetting password - possible errors: code expired, account is disabled, password already changed", { email: email, activationCode: activationCode }, thError);
					reject(thError);
					return;
				}
				var updatedHotel: HotelDO = new HotelDO();
				updatedHotel.buildFromObject(updatedDBHotel);
				resolve(this.getUserByEmailFromHotel(updatedHotel, email));
			}).catch((err: Error) => {
				var thError = new ThError(ThStatusCode.HotelRepositoryErrorCouldNotResetPassword, err);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error resetting password", { email: email, activationCode: activationCode }, thError);
				reject(thError);
			});
	}
	private getUserByEmailFromHotel(hotel: HotelDO, userEmail: string): UserDO {
		return _.find(hotel.users, (currentUser: UserDO) => {
			return currentUser.email == userEmail;
		});
	}
}