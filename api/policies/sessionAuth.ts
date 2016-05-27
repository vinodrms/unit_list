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
					id: "573f19cf210fd03624a8ca98"
				},
				user: {
					id: "7fad0310-16b7-11e6-9c7c-c727702b2c69",
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