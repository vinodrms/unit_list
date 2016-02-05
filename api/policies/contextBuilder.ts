import {UnitPalConfig} from '../core/utils/environment/UnitPalConfig';
import {AppContext} from '../core/utils/AppContext';
import {Locales} from '../core/utils/localization/Translation';

import _ = require("underscore");

module.exports = function(req:Express.Request, res:Express.Response, next : any) {
	var unitPalConfig = new UnitPalConfig();
	req.appContext = new AppContext(unitPalConfig);
	if (_.isUndefined(req.sessionContext)) {
		req.sessionContext = {locale: Locales.English};
	}
	else if (_.isUndefined(req.sessionContext.locale)) {
		req.sessionContext.locale = Locales.English;
	}
	return next();
};