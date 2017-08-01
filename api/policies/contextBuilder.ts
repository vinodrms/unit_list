import { UnitPalConfig } from '../core/utils/environment/UnitPalConfig';
import { AppContext } from '../core/utils/AppContext';
import { ThUtils } from '../core/utils/ThUtils';
import { Locales, ThTranslation } from '../core/utils/localization/ThTranslation';

import _ = require("underscore");

module.exports = function (req: any, res: any, next: any) {
	var unitPalConfig = new UnitPalConfig();
	let appContext = new AppContext(unitPalConfig);
	req.appContext = appContext;

	var requestLocale = ThTranslation.DefaultLocale;
	var thUtils = new ThUtils();
	if (!thUtils.isUndefinedOrNull(req, "body.thLocale")) {
		var translation = new ThTranslation(Locales.English);
		requestLocale = translation.parseLocale(req.body.thLocale);
	}
	if (thUtils.isUndefinedOrNull(req.sessionContext)) {
		req.sessionContext = { language: requestLocale };
	}
	else {
		req.sessionContext.language = requestLocale;
	}

	appContext.thTranslate = new ThTranslation(requestLocale);

	return next();
};