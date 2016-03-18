import {UnitPalConfig} from '../core/utils/environment/UnitPalConfig';
import {AppContext} from '../core/utils/AppContext';
import {ThUtils} from '../core/utils/ThUtils';
import {Locales, Translation} from '../core/utils/localization/Translation';

import _ = require("underscore");

module.exports = function(req: Express.Request, res: Express.Response, next: any) {
	var unitPalConfig = new UnitPalConfig();
	req.appContext = new AppContext(unitPalConfig);

	var requestLocale = Translation.DefaultLocale;
	var thUtils = new ThUtils();
	if (!thUtils.isUndefinedOrNull(req, "body.thLocale")) {
		var translation = new Translation(Locales.English);
		requestLocale = translation.parseLocale(req.body.thLocale);
	}
	if (thUtils.isUndefinedOrNull(req.sessionContext)) {
		req.sessionContext = { language: requestLocale };
	}
	else {
		req.sessionContext.language = requestLocale;
	}
	return next();
};