import {AppEnvironment, AppEnvironmentType} from '../core/utils/environment/AppEnvironment';
import {DatabaseType, DatabaseSettings} from '../core/utils/environment/DatabaseSettings';
import {AppContext} from '../core/utils/AppContext';
import {Locales} from '../core/utils/localization/Translation';

import _ = require("underscore");

module.exports = function(req:Express.Request, res:Express.Response, next : any) {
	var appEnvironmentType = AppEnvironment.getAppEnvironment();
	var databaseType = DatabaseSettings.getDatabaseType();
	req.appContext = new AppContext(appEnvironmentType, databaseType);
	
	if (_.isUndefined(req.sessionContext.locale)) {
		req.sessionContext.locale = Locales.English;
	}
	
	return next();
};