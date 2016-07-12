import {UnitPalConfig, AppEnvironmentType} from '../core/utils/environment/UnitPalConfig';
import {SessionContext} from '../core/utils/SessionContext';
import {Locales} from '../core/utils/localization/ThTranslation';
import {UserRoles} from '../core/data-layer/hotel/data-objects/user/UserDO';

module.exports = function (req: Express.Request, res: Express.Response, next: any) {
	var sessionContext: SessionContext = req["user"];
	if (req.isAuthenticated() && sessionContext) {
		req.sessionContext = sessionContext;
		return next();
	}
	var unitPalConfig = new UnitPalConfig();
	if (unitPalConfig.getAppEnvironment() == AppEnvironmentType.Development ||
		unitPalConfig.getAppEnvironment() == AppEnvironmentType.Test) {
		var devSessionContext: SessionContext = {
			language: Locales.English,
			sessionDO: {
				hotel: {
					id: "574400c7330ff27c24566890",
					timezone: "Europe/Bucharest"
				},
				user: {
					id: "04604f90-2180-11e6-a529-0d3f44df752c",
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