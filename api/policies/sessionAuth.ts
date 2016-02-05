import {UnitPalConfig, AppEnvironmentType} from '../core/utils/environment/UnitPalConfig';
import {SessionContext} from '../core/utils/SessionContext';
import {Locales} from '../core/utils/localization/Translation';

module.exports = function(req:Express.Request, res:Express.Response, next : any) {
	// TODO: check the key for the session (user)
	if (req.sessionContext && req.sessionContext.user) {
		return next();
	}
	var unitPalConfig = new UnitPalConfig();
	if(unitPalConfig.getAppEnvironment() == AppEnvironmentType.Development) {
		// TODO: update with default user
		req.sessionContext = new SessionContext(Locales.English);
		return next();
	}
	
	return res.forbidden('You are not permitted to perform this action.');
};