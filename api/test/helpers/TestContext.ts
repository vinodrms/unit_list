import {AppEnvironment, AppEnvironmentType} from '../../core/utils/environment/AppEnvironment';
import {AppContext} from '../../core/utils/AppContext';
import {SessionContext} from '../../core/utils/SessionContext';
import {Locales} from '../../core/utils/localization/Translation';

export class TestContext {
	appContext : AppContext;
	sessionContext : SessionContext;
	constructor() {
		var appEnvironmentType = AppEnvironment.getAppEnvironment();
		this.appContext = new AppContext(appEnvironmentType);
		this.sessionContext = new SessionContext(Locales.English);
	}
}