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
		passport.serializeUser(function(sessionData: Object, done: any) {
			done(null, sessionData);
		});
		passport.deserializeUser(function(sessionData: any, done: any) {
			done(null, sessionData);
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
	private logInCore(loginType: LoginType, req: any, resolve: { (result?: { user: UserDO, hotel: HotelDO }): void; }, reject: any) {
		var loginStrategyName = this._passportLoginTypes[loginType];
		passport.authenticate(loginStrategyName, function(err, result: { user: UserDO, hotel: HotelDO }) {
			if (err && !result) {
				reject(err);
			}
			else {
				resolve(result);
			}
		})(req, null, null);
	}
}