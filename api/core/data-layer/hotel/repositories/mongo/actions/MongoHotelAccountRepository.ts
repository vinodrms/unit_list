import {ThLogger, ThLogLevel} from '../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {MongoRepository, MongoErrorCodes} from '../../../../common/base/MongoRepository';
import {HotelDO} from '../../../data-objects/HotelDO';
import {UserDO, AccountStatus} from '../../../data-objects/user/UserDO';
import {ActionTokenDO} from '../../../data-objects/user/ActionTokenDO';
import {UserAccountActivationRepoDO, RequestResetPasswordRepoDO, ResetPasswordRepoDO} from '../../IHotelRepository';

import _ = require('underscore');

export class MongoHotelAccountRepository extends MongoRepository {
	constructor(hotelsEntity: any) {
		super(hotelsEntity);
	}
	public addHotel(hotel: HotelDO): Promise<HotelDO> {
		return new Promise<HotelDO>((resolve, reject) => {
			this.addHotelCore(resolve, reject, hotel);
		});
	}
	private addHotelCore(resolve: { (result: HotelDO): void }, reject: { (err: ThError): void }, hotel: HotelDO) {
		this.createDocument(hotel,
			(err: Error) => {
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
			},
			(createdHotel: Object) => {
				var savedHotel: HotelDO = new HotelDO();
				savedHotel.buildFromObject(createdHotel);
				resolve(savedHotel);
			}
		);
	}

	public getHotelByUserEmail(email: string): Promise<HotelDO> {
		return new Promise<HotelDO>((resolve, reject) => {
			this.getHotelByUserEmailCore(resolve, reject, email);
		});
	}
	private getHotelByUserEmailCore(resolve: { (result: HotelDO): void }, reject: { (err: ThError): void }, email: string) {
		this.findOneDocument({ "userList.email": email },
			() => {
				var thError = new ThError(ThStatusCode.HotelRepositoryAccountNotFound, null);
				ThLogger.getInstance().logBusiness(ThLogLevel.Info, "Invalid email to retrieve hotel", { email: email }, thError);
				reject(thError);
			},
			(err: Error) => {
				var thError = new ThError(ThStatusCode.HotelRepositoryErrorFindingAccount, err);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting hotel by email", { email: email }, thError);
				reject(thError);
			},
			(foundHotel: Object) => {
				var hotel: HotelDO = new HotelDO();
				hotel.buildFromObject(foundHotel);
				resolve(hotel);
			}
		);
	}

	public activateUserAccount(activationParams: UserAccountActivationRepoDO): Promise<UserDO> {
		return new Promise<UserDO>((resolve: { (user: UserDO): void }, reject: { (err: any): void }) => {
			this.activateUserAccountCore(resolve, reject, activationParams);
		});
	}
	private activateUserAccountCore(resolve: { (user: UserDO): void }, reject: { (err: ThError): void }, activationParams: UserAccountActivationRepoDO) {
		var currentTimestamp = new Date().getTime();
		this.findAndModifyDocument(
			{
				"userList.email": activationParams.email,
				"userList.accountStatus": AccountStatus.Pending,
				"userList.accountActivationToken.code": activationParams.activationCode,
				"userList.accountActivationToken.expiryTimestamp": { $gte: currentTimestamp }

			}, {
				"userList.$.accountStatus": AccountStatus.Active,
				"userList.$.accountActivationToken.updatedTimestamp": currentTimestamp
			},
			() => {
				var thError = new ThError(ThStatusCode.HotelRepositoryAccountCouldNotBeActivated, null);
				ThLogger.getInstance().logBusiness(ThLogLevel.Info, "Problem activating hotel account", activationParams, thError);
				reject(thError);
			},
			(err: Error) => {
				var thError = new ThError(ThStatusCode.HotelRepositoryErrorActivatingAccount, err);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error activating hotel account", activationParams, thError);
				reject(thError);
			},
			(updatedDBHotel: Object) => {
				var updatedHotel: HotelDO = new HotelDO();
				updatedHotel.buildFromObject(updatedDBHotel);
				resolve(this.getUserByEmailFromHotel(updatedHotel, activationParams.email));
			}
		);
	}
	public requestResetPassword(reqParams: RequestResetPasswordRepoDO): Promise<UserDO> {
		return new Promise<UserDO>((resolve: { (user: UserDO): void }, reject: { (err: any): void }) => {
			this.requestResetPasswordCore(resolve, reject, reqParams);
		});
	}
	private requestResetPasswordCore(resolve: { (user: UserDO): void }, reject: { (err: ThError): void }, reqParams: RequestResetPasswordRepoDO) {
		this.findAndModifyDocument(
			{
				"userList.email": reqParams.email,
				"userList.accountStatus": { $in: [AccountStatus.Active, AccountStatus.Pending] }

			}, {
				"userList.$.resetPasswordToken": reqParams.token
			},
			() => {
				var thError = new ThError(ThStatusCode.HotelRepositoryProblemUpdatingPasswordToken, null);
				ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Problem updating reset password token", reqParams, thError);
				reject(thError);
			},
			(err: Error) => {
				var thError = new ThError(ThStatusCode.HotelRepositoryErrorUpdatingPasswordToken, err);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error updating reset password token", reqParams, thError);
				reject(thError);
			},
			(updatedDBHotel: Object) => {
				var updatedHotel: HotelDO = new HotelDO();
				updatedHotel.buildFromObject(updatedDBHotel);
				resolve(this.getUserByEmailFromHotel(updatedHotel, reqParams.email));
			}
		);
	}
	public resetPassword(resetParams: ResetPasswordRepoDO): Promise<UserDO> {
		return new Promise<UserDO>((resolve: { (user: UserDO): void }, reject: { (err: any): void }) => {
			this.resetPasswordCore(resolve, reject, resetParams);
		});
	}
	private resetPasswordCore(resolve: { (user: UserDO): void }, reject: { (err: ThError): void }, resetParams: ResetPasswordRepoDO) {
		var currentTimestamp = new Date().getTime();
		this.findAndModifyDocument(
			{
				"userList.email": resetParams.email,
				"userList.accountStatus": { $in: [AccountStatus.Active, AccountStatus.Pending] },
				"userList.resetPasswordToken.code": resetParams.activationCode,
				"userList.resetPasswordToken.expiryTimestamp": { $gte: currentTimestamp },
				"userList.resetPasswordToken.updatedTimestamp": { $exists: false }
			}, {
				"userList.$.accountStatus": AccountStatus.Active,
				"userList.$.resetPasswordToken.updatedTimestamp": currentTimestamp,
				"userList.$.password": resetParams.newPassword
			},
			() => {
				var thError = new ThError(ThStatusCode.HotelRepositoryCouldNotResetPassword, null);
				ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Problem resetting password - possible errors: code expired, account is disabled, password already changed", resetParams, thError);
				reject(thError);
			},
			(err: Error) => {
				var thError = new ThError(ThStatusCode.HotelRepositoryErrorCouldNotResetPassword, err);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error resetting password", resetParams, thError);
				reject(thError);
			},
			(updatedDBHotel: Object) => {
				var updatedHotel: HotelDO = new HotelDO();
				updatedHotel.buildFromObject(updatedDBHotel);
				resolve(this.getUserByEmailFromHotel(updatedHotel, resetParams.email));
			}
		);
	}
	private getUserByEmailFromHotel(hotel: HotelDO, userEmail: string): UserDO {
		return _.find(hotel.userList, (currentUser: UserDO) => {
			return currentUser.email == userEmail;
		});
	}
}