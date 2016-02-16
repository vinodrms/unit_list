import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {HotelDO} from '../../../data-layer/hotel/data-objects/HotelDO';
import {UserDO, AccountStatus} from '../../../data-layer/hotel/data-objects/user/UserDO';
import {AuthUtils} from '../utils/AuthUtils';
import {IHotelAuthentication} from './IHotelAuthentication';

import _ = require("underscore");

export class HotelBasicAuthentication implements IHotelAuthentication {
	private _authUtils: AuthUtils;
	private _email: string;
	private _password: string;

	constructor(private _appContext: AppContext) {
		this._authUtils = new AuthUtils(this._appContext.getUnitPalConfig());
	}
	public checkCredentials(email: string, password: string): Promise<{ user: UserDO, hotel: HotelDO }> {
		this._email = email;
		this._password = password;
		return new Promise<{ user: UserDO, hotel: HotelDO }>((resolve, reject) => {
			this.checkCredentialsCore(resolve, reject);
		});
	}
	private checkCredentialsCore(resolve: { (result?: { user: UserDO, hotel: HotelDO }): void; }, reject: { (err: ThError): void }) {
		this._appContext.getRepositoryFactory().getHotelRepository().getHotelByUserEmail(this._email).then((hotel: HotelDO) => {
			var user: UserDO = _.find(hotel.userList, (currentUser: UserDO) => {
				return currentUser.email == this._email;
			});

			switch (user.accountStatus) {
				case AccountStatus.Active:
					if (this._authUtils.isSamePassword(this._password, user.password)) {
						resolve({
							user: user,
							hotel: hotel
						});
					}
					else {
						var thError = new ThError(ThStatusCode.HotelAuthenticationInvalidEmailOrPassword, null);
						ThLogger.getInstance().logBusiness(ThLogLevel.Info, "Invalid password", { email: this._email, hotel: hotel }, thError);
						reject(thError);
					}
					break;
				default:
					var thError = new ThError(ThStatusCode.HotelAuthenticationAccountNotActive, null);
					ThLogger.getInstance().logBusiness(ThLogLevel.Info, "Account not active", { email: this._email, hotel: hotel }, thError);
					reject(thError);
					break;
			}
		}).catch((err: any) => {
			var thError = new ThError(ThStatusCode.HotelAuthenticationErrorQueryingRepository, null);
			reject(thError);
		});
	}
}