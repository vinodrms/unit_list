import {AppEnvironment, AppEnvironmentType} from '../core/utils/environment/AppEnvironment';
import {AppContext} from '../core/utils/AppContext';
import {Locales} from '../core/utils/localization/Translation';

import _ = require("underscore");

module.exports = function(req:Express.Request, res:Express.Response, next : any) {
	var appEnvironmentType = AppEnvironment.getAppEnvironment();
	req.appContext = new AppContext(appEnvironmentType);
	
	if (_.isUndefined(req.sessionContext.locale)) {
		req.sessionContext.locale = Locales.English;
	}
	
	return next();
};