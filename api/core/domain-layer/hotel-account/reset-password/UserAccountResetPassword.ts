import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {AuthUtils} from '../utils/AuthUtils';
import {IHotelRepository, ResetPasswordRepoDO} from '../../../data-layer/hotel/repositories/IHotelRepository';
import {UserDO} from '../../../data-layer/hotel/data-objects/user/UserDO';
import {AccountPasswordWasResetTemplateDO} from '../../../services/email/data-objects/AccountPasswordWasResetTemplateDO';
import {IEmailService, EmailHeaderDO} from '../../../services/email/IEmailService';
import {UserAccountResetPasswordDO} from './UserAccountResetPasswordDO';
import {ValidationResultParser} from '../../common/ValidationResultParser';

export class UserAccountResetPassword {
	private _authUtils: AuthUtils;
	private _updatedUser: UserDO;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext, private _resetPasswdDO: UserAccountResetPasswordDO) {
		this._authUtils = new AuthUtils(this._appContext.getUnitPalConfig());
	}
	public resetPassword(): Promise<UserDO> {
		return new Promise<UserDO>((resolve: { (user: UserDO): void }, reject: { (err: ThError): void }) => {
			try {
				this.resetPasswordCore(resolve, reject);
			} catch (e) {
				var thError = new ThError(ThStatusCode.UserAccountResetPasswordError, e);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error resetting password", this._resetPasswdDO, thError);
				reject(thError);
			}
		});
	}
	private resetPasswordCore(resolve: { (user: UserDO): void }, reject: { (err: ThError): void }) {
		var validationResult = UserAccountResetPasswordDO.getValidationStructure().validateStructure(this._resetPasswdDO);
		if (!validationResult.isValid()) {
			var parser = new ValidationResultParser(validationResult, this._resetPasswdDO);
			parser.logAndReject("Error validating reset password fields", reject);
			return;
		}

		var encryptedPassword = this._authUtils.encrypPassword(this._resetPasswdDO.password);
		var resetPasswordRepoDO: ResetPasswordRepoDO = {
			activationCode: this._resetPasswdDO.activationCode,
			email: this._resetPasswdDO.email,
			newPassword: encryptedPassword
		};
		var hotelRepository: IHotelRepository = this._appContext.getRepositoryFactory().getHotelRepository();
		hotelRepository.resetPassword(resetPasswordRepoDO)
			.then((updatedUser: UserDO) => {
				this._updatedUser = updatedUser;

				var passwordWasResetEmailTemplateDO = this.getPasswordWasResetEmailTemplateDO();
				var emailHeaderDO = this.getEmailHeaderDO();
				var emailService: IEmailService = this._appContext.getServiceFactory().getEmailService(emailHeaderDO, passwordWasResetEmailTemplateDO);
				return emailService.sendEmail();
			})
			.then((sendEmailResult: any) => {
				resolve(this._updatedUser);
			})
			.catch((error: any) => {
				var thError = new ThError(ThStatusCode.UserAccountResetPasswordError, error);
				reject(thError);
			});
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