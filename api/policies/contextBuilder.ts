import {UnitPalConfig} from '../core/utils/environment/UnitPalConfig';
import {AppContext} from '../core/utils/AppContext';
import {AppUtils} from '../core/utils/AppUtils';
import {Locales} from '../core/utils/localization/Translation';

import _ = require("underscore");

module.exports = function(req: Express.Request, res: Express.Response, next: any) {
	var unitPalConfig = new UnitPalConfig();
	req.appContext = new AppContext(unitPalConfig);

	var appUtils = new AppUtils();
	if (appUtils.isUndefined(req.sessionContext)) {
		req.sessionContext = { language: Locales.English };
	}
	else if (appUtils.isUndefined(req.sessionContext.language)) {
		req.sessionContext.language = Locales.English;
	}
	return next();
};