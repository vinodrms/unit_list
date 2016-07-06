import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {UserDO} from '../../../data-layer/hotel/data-objects/user/UserDO';
import {ActionTokenDO} from '../../../data-layer/hotel/data-objects/user/ActionTokenDO';
import {AuthUtils} from '../utils/AuthUtils';
import {ThUtils} from '../../../utils/ThUtils';
import {IHotelRepository, RequestResetPasswordRepoDO} from '../../../data-layer/hotel/repositories/IHotelRepository';
import {AccountRequestResetPasswordTemplateDO} from '../../../services/email/data-objects/AccountRequestResetPasswordTemplateDO';
import {IEmailService, EmailHeaderDO} from '../../../services/email/IEmailService';
import {UserAccountRequestResetPasswordDO} from './UserAccountRequestResetPasswordDO';
import {ValidationResultParser} from '../../common/ValidationResultParser';

import _ = require("underscore");

export class UserAccountRequestResetPassword {
	private _authUtils: AuthUtils;
	private _thUtils: ThUtils;
	private _generatedToken: ActionTokenDO;
	private _updatedUser: UserDO;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext, private _resetPasswdDO: UserAccountRequestResetPasswordDO) {
		this._authUtils = new AuthUtils(this._appContext.getUnitPalConfig());
		this._thUtils = new ThUtils();
	}

	public requestResetPassword(): Promise<ActionTokenDO> {
		return new Promise<ActionTokenDO>((resolve: { (actionToken: ActionTokenDO): void }, reject: { (err: ThError): void }) => {
			try {
				this.requestResetPasswordCore(resolve, reject);
			} catch (e) {
				var thError = new ThError(ThStatusCode.UserAccountRequestResetPasswordError, e);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error requesting reset password", this._resetPasswdDO, thError);
				reject(thError);
			}
		});
	}
	private requestResetPasswordCore(resolve: { (actionToken: ActionTokenDO): void }, reject: { (ThError: any): void }) {
		var validationResult = UserAccountRequestResetPasswordDO.getValidationStructure().validateStructure(this._resetPasswdDO);
		if (!validationResult.isValid()) {
			var parser = new ValidationResultParser(validationResult, this._resetPasswdDO);
			parser.logAndReject("Error validating request reset password fields", reject);
			return;
		}

		this._generatedToken = this.generateResetPasswordToken();
		var requestResetPasswordRepoDO: RequestResetPasswordRepoDO = {
			email: this._resetPasswdDO.email,
			token: this._generatedToken
		};
		var hotelRepository: IHotelRepository = this._appContext.getRepositoryFactory().getHotelRepository();
		hotelRepository.requestResetPassword(requestResetPasswordRepoDO)
			.then((updatedUser: UserDO) => {
				this._updatedUser = updatedUser;

				var requestResetPasswordEmailTemplateDO = this.getRequestResetPasswordEmailTemplateDO();
				var emailHeaderDO = this.getEmailHeaderDO();
				var emailService: IEmailService = this._appContext.getServiceFactory().getEmailService();
				return emailService.sendEmail(emailHeaderDO, requestResetPasswordEmailTemplateDO);
			})
			.then((sendEmailResult: any) => {
				resolve(this._generatedToken);
			}).
			catch((error: any) => {
				var thError = new ThError(ThStatusCode.UserAccountRequestResetPasswordError, error);
				reject(thError);
			});
	}
	private generateResetPasswordToken(): ActionTokenDO {
		var resetPasswdToken = new ActionTokenDO();
		resetPasswdToken.code = this._thUtils.generateUniqueID();
		resetPasswdToken.expiryTimestamp = this._authUtils.getAccountResetpasswordExpiryTimestamp();
		return resetPasswdToken;
	}

	private getRequestResetPasswordEmailTemplateDO(): AccountRequestResetPasswordTemplateDO {
        var emailTemplateDO: AccountRequestResetPasswordTemplateDO = new AccountRequestResetPasswordTemplateDO();
		emailTemplateDO.activationLink = this._authUtils.getResetPasswordLink(this._resetPasswdDO.email, this._generatedToken.code);
		emailTemplateDO.firstName = this._updatedUser.contactDetails.firstName;
		emailTemplateDO.lastName = this._updatedUser.contactDetails.lastName;
        return emailTemplateDO;
	}
	private getEmailHeaderDO(): EmailHeaderDO {
		return {
			to: [this._resetPasswdDO.email],
			subject: "[UnitPal] Password Reset Request",
            attachments: []
		};
	}
}