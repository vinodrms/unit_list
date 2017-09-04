import { ThLogger, ThLogLevel } from './logging/ThLogger';
import { ThError } from './th-responses/ThError';
import { ThStatusCode } from './th-responses/ThResponse';
import { Locales } from './localization/ThTranslation';
import { UserRoles, UserDO } from '../data-layer/hotel/data-objects/user/UserDO';
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

export class SessionManager {
	constructor(private _req: any) {
	}
	public initializeSession(loginData: { user: UserDO, hotel: HotelDO }): Promise<SessionContext> {
		return new Promise<SessionContext>((resolve: { (result: SessionContext): void }, reject: { (err: ThError): void }) => {
			this.initializeSessionCore(resolve, reject, loginData);
		});
	}
	private initializeSessionCore(resolve: { (result: SessionContext): void }, reject: { (err: ThError): void }, loginData: { user: UserDO, hotel: HotelDO }) {
		var sessionContext: SessionContext = this.getSessionContext(loginData);
		this._req.login(sessionContext, (err: any) => {
			if (err) {
				var thError = new ThError(ThStatusCode.SessionManagerErrorInitializingSession, err);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error Initializing session", loginData, thError);
				reject(err);
			}
			else {
				resolve(sessionContext);
			}
		});
	}
	public getSessionContext(loginData: { user: UserDO, hotel: HotelDO }): SessionContext {
		let sessionDO = new SessionDO();
		sessionDO.user = {
			id: loginData.user.id,
			email: loginData.user.email,
			roleList: loginData.user.roleList
		}
		sessionDO.hotel = {
			id: loginData.hotel.id
		}

		return {
			sessionDO: sessionDO,
			language: loginData.user.language
		}
	}
	public sessionExists(): boolean {
		var sessionContext: SessionContext = this._req["user"];
		if (sessionContext) {
			return true;
		}
		return false;
	}
}