import {ResponseWrapper, ResponseStatusCode} from '../../utils/responses/ResponseWrapper';
import {AppContext} from '../../utils/AppContext';
import {SessionContext} from '../../utils/SessionContext';
import {HotelDO} from '../../data-layer/hotel/data-objects/HotelDO';
import {HotelContactDetailsDO} from '../../data-layer/hotel/data-objects/hotel-contact-details/HotelContactDetailsDO';
import {UserDO, AccountStatus, UserRoles} from '../../data-layer/hotel/data-objects/user/UserDO';
import {UserContactDetailsDO} from '../../data-layer/hotel/data-objects/user/UserContactDetailsDO';
import {AHotelRepository} from '../../data-layer/hotel/repositories/AHotelRepository';
import {AccountActivationEmailTemplateBuilder, AccountActivationEmailTemplateDO} from '../../services/email/content-builder/custom/AccountActivationEmailTemplateBuilder';
import {EmailTemplateDO} from '../../services/email/content-builder/AEmailTemplateBuilder';
import {AEmailSender, EmailSenderDO} from '../../services/email/sender/AEmailSender';

import async = require("async");

export class HotelSignUpDO {
	hotelName : string;
	email : string;
	password : string;
	firstName : string;
	lastName : string;
	
	public static getRequiredProperties() : string[] {
		return ["hotelName", "email", "password", "firstName", "lastName"];
	}
}

export class HotelSignUp {
	private _savedHotel : HotelDO;
	
	constructor(private _appContext : AppContext, private _sessionContext : SessionContext, private _signUpDO : HotelSignUpDO) {
	}
	
	public signUp() : Promise<string> {
		return new Promise<string>((resolve, reject) => {
			try {
				this.signUpCore(resolve, reject);
			} catch (e) {
				reject(new ResponseWrapper(ResponseStatusCode.HotelSignUpError));
			}
		});
	}
	
	private signUpCore(resolve, reject) {
		var defaultHotelData = this.generateDefaultHotel();
		async.waterfall([
			((finishAddHotelCallback) => {
				var hotelRepository: AHotelRepository = this._appContext.getRepositoryFactory().getHotelRepository();
				hotelRepository.addHotelAsyncWrapper(defaultHotelData, finishAddHotelCallback);
			}),
			((savedHotel: HotelDO, finishSendActivationEmailCallback) => {
				this._savedHotel = savedHotel;
				var activationEmailTemplateDO = this.getAccountActivationEmailTemplateDO();
				var emailTemplateDO = this.getEmailTemplateDO();
				var templateBuilder = new AccountActivationEmailTemplateBuilder(emailTemplateDO, activationEmailTemplateDO);
				var emailSenderDO = this.getEmailSenderDO();
				var emailSender : AEmailSender = this._appContext.getServiceFactory().getEmailSender(emailSenderDO, templateBuilder);
				emailSender.buildEmailContentAndSendAsyncWrapper(finishSendActivationEmailCallback);
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
	private generateDefaultHotel() : HotelDO {
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
		hotel.amenities = [];
		hotel.customAmenities = [];
		hotel.paymentMethods = [];
		hotel.configurationStatus = false;
		return hotel;
	}
	private getAccountActivationEmailTemplateDO(): AccountActivationEmailTemplateDO {
		return {
			activationLink: "dsadsajkdaghjdgajjdhas",
			firstName: this._signUpDO.firstName,
			lastName: this._signUpDO.lastName,
			email: this._signUpDO.email
		};
	}
	private getEmailTemplateDO() : EmailTemplateDO {
		return {
			destinationEmail: this._signUpDO.email,
			subject: "UnitPal Account Activation"
		}
	}
	private getEmailSenderDO(): EmailSenderDO {
		return {
			destinationEmail: this._signUpDO.email,
			subject: "UnitPal Account Activation"
		};
	}
}