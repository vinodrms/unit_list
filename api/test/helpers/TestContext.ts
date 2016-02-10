import {UnitPalConfig} from '../../core/utils/environment/UnitPalConfig';
import {AppContext} from '../../core/utils/AppContext';
import {SessionContext} from '../../core/utils/SessionContext';
import {Locales} from '../../core/utils/localization/Translation';

export class TestContext {
	appContext : AppContext;
	sessionContext : SessionContext;
	constructor() {
		var unitPalConfig = new UnitPalConfig();
		this.appContext = new AppContext(unitPalConfig);
		// TODO: the session context should hold the user and hotel
		this.sessionContext = <any>{language: Locales.English};
	}
}