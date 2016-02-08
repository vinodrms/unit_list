import {AppContext} from '../../utils/AppContext';
import {HotelDO} from '../../data-layer/hotel/data-objects/HotelDO';
import {UserDO, AccountStatus} from '../../data-layer/hotel/data-objects/user/UserDO';
import {Logger} from '../../utils/logging/Logger';
import {ErrorContainer, ErrorCode} from '../../utils/responses/ResponseWrapper';
import {AuthUtils} from './utils/AuthUtils';
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
	private checkCredentialsCore(resolve: { (result?: { user: UserDO, hotel: HotelDO }): void; }, reject: any) {
		this._appContext.getRepositoryFactory().getHotelRepository().getHotelByUserEmail(this._email).then((hotel: HotelDO) => {
			var user: UserDO = _.find(hotel.users, (currentUser: UserDO) => {
				return currentUser.email == this._email;
			});

			switch (user.accountStatus) {
				case AccountStatus.Active:
					if (this._authUtils.isSamePassword(user.password, this._password)) {
						resolve({
							user: user,
							hotel: hotel
						});
					}
					else {
						Logger.getInstance().logBusiness("Invalid password", { email: this._email, hotel: hotel });
						reject(new ErrorContainer(ErrorCode.HotelAuthenticationInvalidEmailOrPassword));
					}
					break;
				default:
					Logger.getInstance().logBusiness("Account not active", { email: this._email, hotel: hotel });
					reject(new ErrorContainer(ErrorCode.HotelAuthenticationAccountNotActive));
					break;
			}
		}).catch((err: any) => {
			reject(err);
		});
	}
}