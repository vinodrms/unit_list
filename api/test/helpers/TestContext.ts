import { UnitPalConfig } from '../../core/utils/environment/UnitPalConfig';
import { AppContext } from '../../core/utils/AppContext';
import { SessionContext, SessionDO } from '../../core/utils/SessionContext';
import { Locales, ThTranslation } from '../../core/utils/localization/ThTranslation';
import { HotelDO } from '../../core/data-layer/hotel/data-objects/HotelDO';
import { UserDO } from '../../core/data-layer/hotel/data-objects/user/UserDO';

export class TestContext {
	appContext: AppContext;
	sessionContext: SessionContext;
	constructor() {
		var unitPalConfig = new UnitPalConfig();
		this.appContext = new AppContext(unitPalConfig);
		this.sessionContext = <any>{ language: Locales.English };
		this.appContext.thTranslate = new ThTranslation(Locales.English);
	}
	public updateSessionContext(loginData: { user: UserDO, hotel: HotelDO }) {
		let sessionDO = new SessionDO();
		sessionDO.user = {
			id: loginData.user.id,
			email: loginData.user.email,
			roleList: loginData.user.roleList
		}
		sessionDO.hotel = {
			id: loginData.hotel.id
		}

		this.sessionContext = {
			sessionDO: sessionDO,
			language: loginData.user.language
		};
	}
}