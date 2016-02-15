import {HotelDO} from '../../../core/data-layer/hotel/data-objects/HotelDO';
import {HotelContactDetailsDO} from '../../../core/data-layer/hotel/data-objects/hotel-contact-details/HotelContactDetailsDO';
import {ActionTokenDO} from '../../../core/data-layer/hotel/data-objects/user/ActionTokenDO';
import {UserDO, AccountStatus, UserRoles} from '../../../core/data-layer/hotel/data-objects/user/UserDO';
import {UserContactDetailsDO} from '../../../core/data-layer/hotel/data-objects/user/UserContactDetailsDO';
import {AuthUtils} from '../../../core/domain-layer/hotel-account/utils/AuthUtils';
import {ThUtils} from '../../../core/utils/ThUtils';
import {Locales} from '../../../core/utils/localization/Translation';
import {AppContext} from '../../../core/utils/AppContext';

export class DefaultHotelBuilder {
	private _thUtils;
	private _authUtils;
	constructor(private _appContext: AppContext, private _password: string, private _email: string) {
		this._thUtils = new ThUtils();
		this._authUtils = new AuthUtils(this._appContext.getUnitPalConfig());
	}

	getHotel(): HotelDO {
		var hotel = new HotelDO();
		hotel.contactDetails = new HotelContactDetailsDO();
		hotel.contactDetails.name = "3angleTECH Hotel";
		hotel.users = [];
		var user = new UserDO();
		user.id = this._thUtils.generateUniqueID();
		user.accountStatus = AccountStatus.Active;
		user.accountActivationToken = new ActionTokenDO();
		user.accountActivationToken.code = this._thUtils.generateUniqueID();
		user.accountActivationToken.expiryTimestamp = new Date().getTime();
		user.accountActivationToken.updatedTimestamp = new Date().getTime();
		user.contactDetails = new UserContactDetailsDO();
		user.contactDetails.firstName = "Ionut Cristian";
		user.contactDetails.lastName = "Paraschiv";
		user.email = this._email;
		user.language = Locales.English;
		user.password = this._authUtils.encrypPassword(this._password);
		user.roles = [UserRoles.Administrator];
		hotel.users.push(user);
		hotel.amenityIds = [];
		hotel.customAmenities = [];
		hotel.paymentMethodIds = [];
		hotel.configurationStatus = false;
		return hotel;
	}
}