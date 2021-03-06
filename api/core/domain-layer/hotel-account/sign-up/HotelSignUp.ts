import { ThLogger, ThLogLevel } from '../../../utils/logging/ThLogger';
import { ThError } from '../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../utils/th-responses/ThResponse';
import { AppContext } from '../../../utils/AppContext';
import { ThUtils } from '../../../utils/ThUtils';
import { SessionContext } from '../../../utils/SessionContext';
import { HotelDO } from '../../../data-layer/hotel/data-objects/HotelDO';
import { HotelContactDetailsDO } from '../../../data-layer/hotel/data-objects/hotel-contact-details/HotelContactDetailsDO';
import { HotelSequencesDO } from '../../../data-layer/hotel/data-objects/sequences/HotelSequencesDO';
import { ActionTokenDO } from '../../../data-layer/hotel/data-objects/user/ActionTokenDO';
import { UserDO, AccountStatus, UserRoles } from '../../../data-layer/hotel/data-objects/user/UserDO';
import { UserContactDetailsDO } from '../../../data-layer/hotel/data-objects/user/UserContactDetailsDO';
import { IHotelRepository } from '../../../data-layer/hotel/repositories/IHotelRepository';
import { IEmailService, EmailHeaderDO } from '../../../services/email/IEmailService';
import { AccountActivationEmailTemplateDO } from '../../../services/email/data-objects/AccountActivationEmailTemplateDO';
import { AuthUtils } from '../utils/AuthUtils';
import { HotelSignUpDO } from './HotelSignUpDO';
import { ValidationResultParser } from '../../common/ValidationResultParser';
import { HotelConfigurationsBootstrap } from '../../hotel-configurations/HotelConfigurationsBootstrap';
import { SignupCodeDO } from "../../../data-layer/signup-codes/data-objects/SignupCodeDO";

export class HotelSignUp {
	private static FirstUserIndex = 0;
	private _savedHotel: HotelDO;
	private _authUtils: AuthUtils;
	private _activationCode: string;
	private _thUtils: ThUtils;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext, private _signUpDO: HotelSignUpDO) {
		this._authUtils = new AuthUtils(this._appContext.getUnitPalConfig());
		this._thUtils = new ThUtils();
	}

	public signUp(): Promise<ActionTokenDO> {
		return new Promise<ActionTokenDO>((resolve: { (result: ActionTokenDO): void }, reject: { (err: ThError): void }) => {
			try {
				this.signUpCore(resolve, reject);
			} catch (e) {
				var thError = new ThError(ThStatusCode.HotelSignUpError, e);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error saving hotel", this._signUpDO, thError);
				reject(thError);
			}
		});
	}

	private signUpCore(resolve: { (result: ActionTokenDO): void }, reject: { (err: ThError): void }) {
		let validationResult = HotelSignUpDO.getValidationRules().validateStructure(this._signUpDO);
		if (!validationResult.isValid()) {
			let parser = new ValidationResultParser(validationResult, this._signUpDO);
			parser.logAndReject("Error validating hotel sign up fields", reject);
			return;
		}

		let signupCodesRepo = this._appContext.getRepositoryFactory().getSignupCodeRepository();
		let signupCode = this._signUpDO.signupCode;
		signupCodesRepo.getSignupCode(this._signUpDO.signupCode).then((signupCode: SignupCodeDO) => {
			if (this._thUtils.isUndefinedOrNull(signupCode)) {
				var thError = new ThError(ThStatusCode.SignupCodeRepositorySignupCodeInvalid, null);
				ThLogger.getInstance().logError(ThLogLevel.Error, "invalid sign up code", { signupData: this._signUpDO }, thError);
				reject(thError);

				return;
			}
			let defaultHotelData = this.generateDefaultHotel();
			let hotelRepository: IHotelRepository = this._appContext.getRepositoryFactory().getHotelRepository();
			return hotelRepository.addHotel(defaultHotelData);
		}).then((savedHotel: HotelDO) => {
			this._savedHotel = savedHotel;

			return signupCodesRepo.deleteSignupCode(this._signUpDO.signupCode);
		}).then((deletedCount: number) => {
			if (deletedCount !== 1) {
				var thError = new ThError(ThStatusCode.SignupCodeRepositorySignupCodeInvalid, null);
				ThLogger.getInstance().logError(ThLogLevel.Error, "sign up code already used", { signupData: this._signUpDO }, thError);
				reject(thError);

				return;
			}

			let hotelConfigBootstrap = new HotelConfigurationsBootstrap(this._appContext, this._savedHotel.id);
			return hotelConfigBootstrap.bootstrap();
		}).then((bootstrapResult: boolean) => {
			let activationEmailTemplateDO = this.getAccountActivationEmailTemplateDO();
			let emailHeaderDO = this.getEmailHeaderDO();
			let emailService: IEmailService = this._appContext.getServiceFactory().getEmailService();
			return emailService.sendEmail(emailHeaderDO, activationEmailTemplateDO);
		}).then((sendEmailResult: any) => {
			resolve(this._savedHotel.userList[HotelSignUp.FirstUserIndex].accountActivationToken);
		}).catch((error: any) => {
			let thError = new ThError(ThStatusCode.HotelSignUpError, error);
			reject(thError);
		});
	}

	private generateDefaultHotel(): HotelDO {
		this._activationCode = this._thUtils.generateUniqueID();

		var hotel = new HotelDO();
		hotel.contactDetails = new HotelContactDetailsDO();
		hotel.contactDetails.name = this._signUpDO.hotelName;
		hotel.userList = [];
		var user = new UserDO();
		user.id = this._thUtils.generateUniqueID();
		user.accountStatus = AccountStatus.Pending;
		user.accountActivationToken = new ActionTokenDO();
		user.accountActivationToken.code = this._activationCode;
		user.accountActivationToken.expiryTimestamp = this._authUtils.getAccountActivationExpiryTimestamp();
		user.contactDetails = new UserContactDetailsDO();
		user.contactDetails.firstName = this._signUpDO.firstName;
		user.contactDetails.lastName = this._signUpDO.lastName;
		user.email = this._signUpDO.email;
		user.language = this._sessionContext.language;
		user.password = this._authUtils.encryptPassword(this._signUpDO.password);
		user.roleList = [UserRoles.Administrator];
		hotel.userList.push(user);
		hotel.amenityIdList = [];
		hotel.customAmenityList = [];
		hotel.paymentMethodList = [];
		hotel.configurationCompleted = false;
		hotel.sequences = new HotelSequencesDO();
		hotel.sequences.setInitialValues();
		hotel.signupCode = this._signUpDO.signupCode;

		return hotel;
	}

	private getAccountActivationEmailTemplateDO(): AccountActivationEmailTemplateDO {
		var emailTemplateDO: AccountActivationEmailTemplateDO = new AccountActivationEmailTemplateDO();
		emailTemplateDO.activationLink = this._authUtils.getActivationLink(this._signUpDO.email, this._activationCode);
		emailTemplateDO.firstName = this._signUpDO.firstName;
		emailTemplateDO.lastName = this._signUpDO.lastName;
		emailTemplateDO.email = this._signUpDO.email;
		return emailTemplateDO;
	}

	private getEmailHeaderDO(): EmailHeaderDO {
		return {
			to: [this._signUpDO.email],
			subject: "[UnitPal] Account Activation",
			attachments: []
		};
	}
}