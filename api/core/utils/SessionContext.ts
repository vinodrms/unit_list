import {ThLogger, ThLogLevel} from './logging/ThLogger';
import {ThError} from './th-responses/ThError';
import {ThStatusCode} from './th-responses/ThResponse';
import {Locales} from './localization/ThTranslation';
import {UserRoles, UserDO} from '../data-layer/hotel/data-objects/user/UserDO';
import {HotelDO} from '../data-layer/hotel/data-objects/HotelDO';

export class SessionDO {
	user: {
		id: string
		email: string,
		roleList: UserRoles[]
	}
	hotel: {
		id: string,
		timezone: string
	}
}
export class SessionContext {
	language: Locales;
	sessionDO: SessionDO;
}

export class SessionManager {
	constructor(private _req: Express.Request) {
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
		var sessionDO: SessionDO = {
			user: {
				id: loginData.user.id,
				email: loginData.user.email,
				roleList: loginData.user.roleList
			},
			hotel: {
				id: loginData.hotel.id,
				timezone: loginData.hotel.timezone
			}
		};
		return {
			sessionDO: sessionDO,
			language: loginData.user.language
		}
	}
	public destroySession() {
		this._req.logout();
	}
	public sessionExists(): boolean {
		var sessionContext: SessionContext = this._req["user"];
		if (this._req.isAuthenticated() && sessionContext) {
			return true;
		}
		return false;
	}
}