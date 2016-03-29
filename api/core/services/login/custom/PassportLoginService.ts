import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {ILoginService, LoginType} from '../ILoginService';
import {ILoginServiceInitializer} from '../ILoginServiceInitializer';
import {HotelDO} from '../../../data-layer/hotel/data-objects/HotelDO';
import {UserDO} from '../../../data-layer/hotel/data-objects/user/UserDO';
import {IHotelAuthentication} from '../../../domain-layer/hotel-account/authentication/IHotelAuthentication';

import passport = require('passport');
import LocalStrategy = require('passport-local');

export class PassportLoginService implements ILoginServiceInitializer, ILoginService {
	private _passportLoginTypes: { [index: number]: string; } = {};

	constructor() {
		this._passportLoginTypes[LoginType.Basic] = "local";
	}
	public init() {
		this.initLocalStrategy();
	}
	private initLocalStrategy() {
		passport.serializeUser(function(sessionContext: Object, done: any) {
			done(null, sessionContext);
		});
		passport.deserializeUser(function(sessionContext: any, done: any) {
			done(null, sessionContext);
		});
		passport.use(new LocalStrategy.Strategy({
			passReqToCallback: true,
			usernameField: "email",
			passwordField: "password"
		}, function(req: Express.Request, email: string, password: string, done: { (err?: Error, result?: { user: UserDO, hotel: HotelDO }): void; }) {
			var hotelAuthentication: IHotelAuthentication = req.basicHotelAuthentication;
			hotelAuthentication.checkCredentials(email, password).then((result: { user: UserDO, hotel: HotelDO }) => {
				return done(null, result);
			}).catch((err: any) => {
				return done(err);
			});
		}));
	}

	public logIn(loginType: LoginType, req: Express.Request): Promise<{ user: UserDO, hotel: HotelDO }> {
		return new Promise<{ user: UserDO, hotel: HotelDO }>((resolve, reject) => {
			this.logInCore(loginType, req, resolve, reject);
		});
	}
	private logInCore(loginType: LoginType, req: any, resolve: { (result: { user: UserDO, hotel: HotelDO }): void; }, reject: { (err: ThError): void }) {
		var loginStrategyName = this._passportLoginTypes[loginType];
		passport.authenticate(loginStrategyName, function(err, result: { user: UserDO, hotel: HotelDO }) {
			process.nextTick(() => {
				if (err) {
					var thError = new ThError(ThStatusCode.PassportLoginServiceErrorInvalidLogin, err);
					if (thError.isNativeError()) {
						ThLogger.getInstance().logError(ThLogLevel.Warning, "Invalid Login", req.body, thError);
					}
					reject(thError);
					return;
				}
				/*
					Passport can return 'err'=null and put false on 'result'
				*/
				if (!result) {
					var thError = new ThError(ThStatusCode.PassportLoginServiceInvalidLogin, null);
					ThLogger.getInstance().logBusiness(ThLogLevel.Info, "Invalid Login", req.body, thError);
					reject(thError);
					return;
				}
				resolve(result);
			});
		})(req, null, null);
	}
}