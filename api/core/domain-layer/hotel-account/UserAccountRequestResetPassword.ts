import {AppContext} from '../../utils/AppContext';
import {SessionContext} from '../../utils/SessionContext';
import {UserDO} from '../../data-layer/hotel/data-objects/user/UserDO';
import {ActionTokenDO} from '../../data-layer/hotel/data-objects/user/ActionTokenDO';
import {Logger, LogLevel} from '../../utils/logging/Logger';
import {ErrorContainer, ErrorCode} from '../../utils/responses/ResponseWrapper';
import {AuthUtils} from './utils/AuthUtils';
import {AppUtils} from '../../utils/AppUtils';
import {IHotelRepository} from '../../data-layer/hotel/repositories/IHotelRepository';
import {AccountRequestResetPasswordTemplateDO} from '../../services/email/data-objects/AccountRequestResetPasswordTemplateDO';
import {AEmailService, EmailHeaderDO} from '../../services/email/AEmailService';

import async = require("async");
import _ = require("underscore");

export class UserAccountRequestResetPasswordDO {
	email: string;

	public static getRequiredProperties(): string[] {
		return ["email"];
	}
}

export class UserAccountRequestResetPassword {
	private _authUtils: AuthUtils;
	private _appUtils: AppUtils;
	private _generatedToken: ActionTokenDO;
	private _updatedUser: UserDO;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext, private _resetPasswdDO: UserAccountRequestResetPasswordDO) {
		this._authUtils = new AuthUtils(this._appContext.getUnitPalConfig());
		this._appUtils = new AppUtils();
	}

	public requestResetPassword(): Promise<ActionTokenDO> {
		return new Promise<ActionTokenDO>((resolve: { (actionToken: ActionTokenDO): void }, reject: { (err: any): void }) => {
			try {
				this.requestResetPasswordCore(resolve, reject);
			} catch (e) {
				Logger.getInstance().logError(LogLevel.Error, "Error requesting reset password", this._resetPasswdDO, e);
				reject(new ErrorContainer(ErrorCode.UserAccountRequestResetPasswordError, e));
			}
		});
	}
	private requestResetPasswordCore(resolve: { (actionToken: ActionTokenDO): void }, reject: { (err: any): void }) {
		this._generatedToken = this.generateResetPasswordToken();
		async.waterfall([
			((finishUpdateTokenCallback) => {
				var hotelRepository: IHotelRepository = this._appContext.getRepositoryFactory().getHotelRepository();
				hotelRepository.requestResetPasswordAsync(this._resetPasswdDO.email, this._generatedToken, finishUpdateTokenCallback);
			}),
			((updatedUser: UserDO, finishSendRequestResetPasswordEmailCallback) => {
				this._updatedUser = updatedUser;

				var requestResetPasswordEmailTemplateDO = this.getRequestResetPasswordEmailTemplateDO();
				var emailHeaderDO = this.getEmailHeaderDO();
				var emailService: AEmailService = this._appContext.getServiceFactory().getEmailService(emailHeaderDO, requestResetPasswordEmailTemplateDO);
				emailService.sendEmailAsync(finishSendRequestResetPasswordEmailCallback);
			})
		], ((error: any, emailSendResult: any) => {
			if (error) {
				reject(error);
			}
			else {
				resolve(this._generatedToken);
			}
		}));
	}
	private generateResetPasswordToken(): ActionTokenDO {
		var resetPasswdToken = new ActionTokenDO();
		resetPasswdToken.code = this._appUtils.generateUniqueID();
		resetPasswdToken.expiryTimestamp = this._authUtils.getAccountResetpasswordExpiryTimestamp();
		return resetPasswdToken;
	}

	private getRequestResetPasswordEmailTemplateDO(): AccountRequestResetPasswordTemplateDO {
        var emailTemplateDO: AccountRequestResetPasswordTemplateDO = new AccountRequestResetPasswordTemplateDO();
		emailTemplateDO.activationLink = this._authUtils.getResetPasswordLink(this._generatedToken.code);
		emailTemplateDO.firstName = this._updatedUser.contactDetails.firstName;
		emailTemplateDO.lastName = this._updatedUser.contactDetails.lastName;
        return emailTemplateDO;
	}
	private getEmailHeaderDO(): EmailHeaderDO {
		return {
			destinationEmail: this._resetPasswdDO.email,
			subject: "[UnitPal] Password Reset Request",
            attachments: []
		};
	}
}