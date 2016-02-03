import {AppEnvironment, AppEnvironmentType} from '../core/utils/environment/AppEnvironment';
import {SessionContext} from '../core/utils/SessionContext';
import {Locales} from '../core/utils/localization/Translation';

module.exports = function(req:Express.Request, res:Express.Response, next : any) {
	if (req.sessionContext) {
		return next();
	}
	
	var appEnvironmentType = AppEnvironment.getAppEnvironment();
	if(appEnvironmentType == AppEnvironmentType.Development) {
		req.sessionContext = new SessionContext(Locales.English);
		return next();
	}
	
	return res.forbidden('You are not permitted to perform this action.');
};