import {UnitPalConfig, AppEnvironmentType} from '../core/utils/environment/UnitPalConfig';
import {SessionContext} from '../core/utils/SessionContext';
import {Locales} from '../core/utils/localization/Translation';
import {UserRoles} from '../core/data-layer/hotel/data-objects/user/UserDO';

module.exports = function(req: Express.Request, res: Express.Response, next: any) {
	var sessionContext: SessionContext = req["user"];
	if (req.isAuthenticated() && sessionContext) {
		req.sessionContext = sessionContext;
		return next();
	}
	var unitPalConfig = new UnitPalConfig();
	if (unitPalConfig.getAppEnvironment() == AppEnvironmentType.Development) {
		var devSessionContext: SessionContext = {
			language: Locales.English,
			sessionDO: {
				hotel: {
<<<<<<< HEAD
					id: "570793406d6d38d00240b506"
=======
					id: "570bc63ed5d45fecaf47f003"
>>>>>>> a4957135aed5eb92ce41da3712d4d6bffc65e912
				},
				user: {
					id: "68a28490-f661-11e5-a533-ef4574c81a92",
					email: "paraschiv.ionut@gmail.com",
					roleList: [UserRoles.Administrator]
				}
			}
		};
		req.sessionContext = devSessionContext;
		return next();
	}
	return res.forbidden('You are not permitted to perform this action.');
};