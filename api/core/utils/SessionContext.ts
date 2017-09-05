import { Locales } from './localization/ThTranslation';
import { UserRoles } from '../data-layer/hotel/data-objects/user/UserDO';
import { HotelDO } from '../data-layer/hotel/data-objects/HotelDO';
import { IUser } from "../bootstrap/oauth/OAuthServerInitializer";

export class SessionDO {
	user: {
		id: string
		email: string,
		roleList: UserRoles[]
	}
	hotel: {
		id: string
	}

	public buildFromUserInfo(user: IUser) {
		this.user = {
			id: user.id,
			email: user.email,
			roleList: user.roleList
		};
		this.hotel = {
			id: user.hotelId
		}
	}
}
export class SessionContext {
	language: Locales;
	sessionDO: SessionDO;
}
