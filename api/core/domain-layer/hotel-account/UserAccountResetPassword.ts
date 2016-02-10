import {AppContext} from '../../utils/AppContext';
import {SessionContext} from '../../utils/SessionContext';
import {AuthUtils} from './utils/AuthUtils';
import {Logger, LogLevel} from '../../utils/logging/Logger';
import {ErrorContainer, ErrorCode} from '../../utils/responses/ResponseWrapper';
import {IHotelRepository} from '../../data-layer/hotel/repositories/IHotelRepository';
import {UserDO} from '../../data-layer/hotel/data-objects/user/UserDO';
import {AccountPasswordWasResetTemplateDO} from '../../services/email/data-objects/AccountPasswordWasResetTemplateDO';
import {AEmailService, EmailHeaderDO} from '../../services/email/AEmailService';

import async = require("async");

export class UserAccountResetPasswordDO {
	activationCode: string;
	email: string;
	password: string;

	public static getRequiredProperties(): string[] {
		return ["activationCode", "email", "password"];
	}
}

export class UserAccountResetPassword {
	private _authUtils: AuthUtils;
	private _updatedUser: UserDO;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext, private _resetPasswdDO: UserAccountResetPasswordDO) {
		this._authUtils = new AuthUtils(this._appContext.getUnitPalConfig());
	}
	public resetPassword(): Promise<UserDO> {
		return new Promise<UserDO>((resolve: { (user: UserDO): void }, reject: { (err: any): void }) => {
			try {
				this.resetPasswordCore(resolve, reject);
			} catch (e) {
				Logger.getInstance().logError(LogLevel.Error, "Error resetting password", this._resetPasswdDO, e);
				reject(new ErrorContainer(ErrorCode.UserAccountResetPasswordError, e));
			}
		});
	}
	private resetPasswordCore(resolve: { (user: UserDO): void }, reject: { (err: any): void }) {
		var encryptedPassword = this._authUtils.encrypPassword(this._resetPasswdDO.password);
		async.waterfall([
			((finishResetPasswordCallback) => {
				var hotelRepository: IHotelRepository = this._appContext.getRepositoryFactory().getHotelRepository();
				hotelRepository.resetPasswordAsync(this._resetPasswdDO.email, this._resetPasswdDO.activationCode, encryptedPassword, finishResetPasswordCallback);
			}),
			((updatedUser: UserDO, finishSendResetPasswordEmailCallback) => {
				this._updatedUser = updatedUser;

				var passwordWasResetEmailTemplateDO = this.getPasswordWasResetEmailTemplateDO();
				var emailHeaderDO = this.getEmailHeaderDO();
				var emailService: AEmailService = this._appContext.getServiceFactory().getEmailService(emailHeaderDO, passwordWasResetEmailTemplateDO);
				emailService.sendEmailAsync(finishSendResetPasswordEmailCallback);
			})
		], ((error: any, emailSendResult: any) => {
			if (error) {
				reject(error);
			}
			else {
				resolve(this._updatedUser);
			}
		}));
	}
	private getPasswordWasResetEmailTemplateDO(): AccountPasswordWasResetTemplateDO {
		var emailTemplateDO: AccountPasswordWasResetTemplateDO = new AccountPasswordWasResetTemplateDO();
		emailTemplateDO.firstName = this._updatedUser.contactDetails.firstName;
		emailTemplateDO.lastName = this._updatedUser.contactDetails.lastName;
        return emailTemplateDO;
	}
	private getEmailHeaderDO(): EmailHeaderDO {
		return {
			destinationEmail: this._resetPasswdDO.email,
			subject: "[UnitPal] Password Was Reset",
            attachments: []
		};
	}
}