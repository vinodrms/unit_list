import {AppEnvironment, AppEnvironmentType} from '../../core/utils/environment/AppEnvironment';
import {DatabaseType, DatabaseSettings} from '../../core/utils/environment/DatabaseSettings';
import {AppContext} from '../../core/utils/AppContext';
import {SessionContext} from '../../core/utils/SessionContext';
import {Locales} from '../../core/utils/localization/Translation';

export class TestContext {
	appContext : AppContext;
	sessionContext : SessionContext;
	constructor() {
		var appEnvironmentType = AppEnvironment.getAppEnvironment();
		var databaseType = DatabaseSettings.getDatabaseType();
		this.appContext = new AppContext(appEnvironmentType, databaseType);
		this.sessionContext = new SessionContext(Locales.English);
	}
}