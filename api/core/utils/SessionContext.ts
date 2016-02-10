import {ThLogger, ThLogLevel} from './logging/ThLogger';
import {ThError} from './th-responses/ThError';
import {ThStatusCode} from './th-responses/ThResponse';
import {Locales} from './localization/Translation';
import {UserRoles, UserDO} from '../data-layer/hotel/data-objects/user/UserDO';
import {HotelDO} from '../data-layer/hotel/data-objects/HotelDO';

export class SessionDO {
	user: {
		id: string
		email: string,
		roles: UserRoles[]
	}
	hotel: {
		id: string,
		ccy: string
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
	private getSessionContext(loginData: { user: UserDO, hotel: HotelDO }): SessionContext {
		var sessionDO: SessionDO = {
			user: {
				id: loginData.user.id,
				email: loginData.user.email,
				roles: loginData.user.roles
			},
			hotel: {
				id: loginData.hotel.id,
				ccy: loginData.hotel.ccy
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
}