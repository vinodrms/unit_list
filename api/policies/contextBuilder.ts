import {UnitPalConfig} from '../core/utils/environment/UnitPalConfig';
import {AppContext} from '../core/utils/AppContext';
import {ThUtils} from '../core/utils/ThUtils';
import {Locales} from '../core/utils/localization/Translation';

import _ = require("underscore");

module.exports = function(req: Express.Request, res: Express.Response, next: any) {
	var unitPalConfig = new UnitPalConfig();
	req.appContext = new AppContext(unitPalConfig);

	var thUtils = new ThUtils();
	if (thUtils.isUndefinedOrNull(req.sessionContext)) {
		req.sessionContext = { language: Locales.English };
	}
	else if (thUtils.isUndefinedOrNull(req.sessionContext.language)) {
		req.sessionContext.language = Locales.English;
	}
	return next();
};