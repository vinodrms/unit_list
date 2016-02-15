import {UnitPalConfig} from '../../core/utils/environment/UnitPalConfig';
import {AppContext} from '../../core/utils/AppContext';
import {SessionContext, SessionManager} from '../../core/utils/SessionContext';
import {Locales} from '../../core/utils/localization/Translation';
import {HotelDO} from '../../core/data-layer/hotel/data-objects/HotelDO';
import {UserDO} from '../../core/data-layer/hotel/data-objects/user/UserDO';

export class TestContext {
	appContext: AppContext;
	sessionContext: SessionContext;
	constructor() {
		var unitPalConfig = new UnitPalConfig();
		this.appContext = new AppContext(unitPalConfig);
		this.sessionContext = <any>{ language: Locales.English };
	}
	public updateSessionContext(loginData: { user: UserDO, hotel: HotelDO }) {
		var sessionManager = new SessionManager(null);
		this.sessionContext = sessionManager.getSessionContext(loginData);
	}
}