import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {ThUtils} from '../../../utils/ThUtils';
import {SessionContext} from '../../../utils/SessionContext';
import {HotelDO} from '../../../data-layer/hotel/data-objects/HotelDO';
import {HotelContactDetailsDO} from '../../../data-layer/hotel/data-objects/hotel-contact-details/HotelContactDetailsDO';
import {ActionTokenDO} from '../../../data-layer/hotel/data-objects/user/ActionTokenDO';
import {UserDO, AccountStatus, UserRoles} from '../../../data-layer/hotel/data-objects/user/UserDO';
import {UserContactDetailsDO} from '../../../data-layer/hotel/data-objects/user/UserContactDetailsDO';
import {IHotelRepository} from '../../../data-layer/hotel/repositories/IHotelRepository';
import {IEmailService, EmailHeaderDO} from '../../../services/email/IEmailService';
import {AccountActivationEmailTemplateDO} from '../../../services/email/data-objects/AccountActivationEmailTemplateDO';
import {AuthUtils} from '../utils/AuthUtils';
import {HotelSignUpDO} from './HotelSignUpDO';
import {ValidationResultParser} from '../../common/ValidationResultParser';
import {HotelConfigurationsBootstrap} from '../../hotel-configurations/HotelConfigurationsBootstrap';

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
		var validationResult = HotelSignUpDO.getValidationRules().validateStructure(this._signUpDO);
		if (!validationResult.isValid()) {
			var parser = new ValidationResultParser(validationResult, this._signUpDO);
			parser.logAndReject("Error validating hotel sign up fields", reject);
			return;
		}
		var defaultHotelData = this.generateDefaultHotel();
		var hotelRepository: IHotelRepository = this._appContext.getRepositoryFactory().getHotelRepository();
		hotelRepository.addHotel(defaultHotelData)
			.then((savedHotel: HotelDO) => {
				this._savedHotel = savedHotel;

				var hotelConfigBootstrap = new HotelConfigurationsBootstrap(this._appContext, savedHotel.id);
				return hotelConfigBootstrap.bootstrap();
			})
			.then((bootstrapResult: boolean) => {
				var activationEmailTemplateDO = this.getAccountActivationEmailTemplateDO();
				var emailHeaderDO = this.getEmailHeaderDO();
				var emailService: IEmailService = this._appContext.getServiceFactory().getEmailService(emailHeaderDO, activationEmailTemplateDO);
				return emailService.sendEmail();
			})
			.then((sendEmailResult: any) => {
				resolve(this._savedHotel.userList[HotelSignUp.FirstUserIndex].accountActivationToken);
			}).catch((error: any) => {
				var thError = new ThError(ThStatusCode.HotelSignUpError, error);
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
		user.password = this._authUtils.encrypPassword(this._signUpDO.password);
		user.roleList = [UserRoles.Administrator];
		hotel.userList.push(user);
		hotel.amenityIdList = [];
		hotel.customAmenityList = [];
		hotel.paymentMethodIdList = [];
		hotel.configurationCompleted = false;
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
			destinationEmail: this._signUpDO.email,
			subject: "[UnitPal] Account Activation",
            attachments: []
		};
	}
}