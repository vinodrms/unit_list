import {ErrorContainer, ErrorCode} from '../../utils/responses/ResponseWrapper';
import {Logger} from '../../utils/logging/Logger';
import {AppContext} from '../../utils/AppContext';
import {SessionContext} from '../../utils/SessionContext';
import {HotelDO} from '../../data-layer/hotel/data-objects/HotelDO';
import {HotelContactDetailsDO} from '../../data-layer/hotel/data-objects/hotel-contact-details/HotelContactDetailsDO';
import {UserDO, AccountStatus, UserRoles} from '../../data-layer/hotel/data-objects/user/UserDO';
import {UserContactDetailsDO} from '../../data-layer/hotel/data-objects/user/UserContactDetailsDO';
import {IHotelRepository} from '../../data-layer/hotel/repositories/IHotelRepository';
import {AccountActivationEmailTemplateBuilder, AccountActivationEmailTemplateDO} from '../../services/email/content-builder/custom/AccountActivationEmailTemplateBuilder';
import {AEmailService, EmailMetadataDO} from '../../services/email/sender/AEmailService';

import async = require("async");

export class HotelSignUpDO {
	hotelName: string;
	email: string;
	password: string;
	firstName: string;
	lastName: string;

	public static getRequiredProperties(): string[] {
		return ["hotelName", "email", "password", "firstName", "lastName"];
	}
}

export class HotelSignUp {
	private _savedHotel: HotelDO;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext, private _signUpDO: HotelSignUpDO) {
	}

	public signUp(): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			try {
				this.signUpCore(resolve, reject);
			} catch (e) {
				Logger.getInstance().logError("Error saving hotel", this._signUpDO, e);
				reject(new ErrorContainer(ErrorCode.HotelSignUpError, e));
			}
		});
	}

	private signUpCore(resolve, reject) {
		var defaultHotelData = this.generateDefaultHotel();
		async.waterfall([
			((finishAddHotelCallback) => {
				var hotelRepository: IHotelRepository = this._appContext.getRepositoryFactory().getHotelRepository();
				hotelRepository.addHotelAsync(defaultHotelData, finishAddHotelCallback);
			}),
			((savedHotel: HotelDO, finishSendActivationEmailCallback) => {
				this._savedHotel = savedHotel;
				var activationEmailTemplateDO = this.getAccountActivationEmailTemplateDO();
				var templateBuilder = new AccountActivationEmailTemplateBuilder(activationEmailTemplateDO);
				var emailMetadataDO = this.getEmailMetadataDO();
				var emailService: AEmailService = this._appContext.getServiceFactory().getEmailService(emailMetadataDO, templateBuilder);
				emailService.buildEmailContentAndSendAsync(finishSendActivationEmailCallback);
			})
		], ((error: any, emailSendResult: any) => {
			if (error) {
				reject(error);
			}
			else {
				resolve(this._savedHotel.users[0].activationCode);
			}
		}));
	}
	private generateDefaultHotel(): HotelDO {
		// TODO: generate activation code, encrypt password 
		var hotel = new HotelDO();
		hotel.contactDetails = new HotelContactDetailsDO();
		hotel.contactDetails.name = this._signUpDO.hotelName;
		hotel.users = [];
		var user = new UserDO();
		user.accountStatus = AccountStatus.Pending;
		user.activationCode = "123";
		user.activationExpiryTimestamp = 111;
		user.contactDetails = new UserContactDetailsDO();
		user.contactDetails.firstName = this._signUpDO.firstName;
		user.contactDetails.lastName = this._signUpDO.lastName;
		user.email = this._signUpDO.email;
		user.language = this._sessionContext.locale;
		user.password = this._signUpDO.password;
		user.roles = [UserRoles.Administrator];
		hotel.users.push(user);
		hotel.amenityIds = [];
		hotel.customAmenities = [];
		hotel.paymentMethodIds = [];
		hotel.configurationStatus = false;
		return hotel;
	}
	private getAccountActivationEmailTemplateDO(): AccountActivationEmailTemplateDO {
		// TODO: update activation link
		return {
			activationLink: "dsadsajkdaghjdgajjdhas",
			firstName: this._signUpDO.firstName,
			lastName: this._signUpDO.lastName,
			email: this._signUpDO.email
		};
	}
	private getEmailMetadataDO(): EmailMetadataDO {
		return {
			destinationEmail: this._signUpDO.email,
			subject: "UnitPal Account Activation"
		};
	}
}