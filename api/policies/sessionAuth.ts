import {UnitPalConfig, AppEnvironmentType} from '../core/utils/environment/UnitPalConfig';
import {SessionContext} from '../core/utils/SessionContext';
import {Locales} from '../core/utils/localization/Translation';

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
					id: "1",
					ccy: "EUR"
				},
				user: {
					id: "1",
					email: "paraschiv.ionut@gmail.com",
					roles: [0]
				}
			}
		};
		req.sessionContext = devSessionContext;
		return next();
	}
	return res.forbidden('You are not permitted to perform this action.');
};