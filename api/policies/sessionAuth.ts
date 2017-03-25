import { UnitPalConfig, AppEnvironmentType } from '../core/utils/environment/UnitPalConfig';
import { SessionContext } from '../core/utils/SessionContext';
import { Locales } from '../core/utils/localization/ThTranslation';
import { UserRoles } from '../core/data-layer/hotel/data-objects/user/UserDO';
import { AppContext } from "../core/utils/AppContext";
import { DefaultDataBuilder } from "../test/db-initializers/DefaultDataBuilder";

module.exports = function (req: Express.Request, res: Express.Response, next: any) {
	var sessionContext: SessionContext = req["user"];
	if (req.isAuthenticated() && sessionContext) {
		req.sessionContext = sessionContext;
		return next();
	}
	var unitPalConfig = new UnitPalConfig();

	// if enabled so, read the default hotel & user from the database and set it on the server session
	// used for development; should NEVER be enabled on production environments !
	if (unitPalConfig.defaultClientSessionIsEnabled()) {
		let appContext = new AppContext(unitPalConfig);
		let hotelRepo = appContext.getRepositoryFactory().getHotelRepository();
		hotelRepo.getHotelByUserEmail(DefaultDataBuilder.DefaultEmail)
			.then(hotel => {
				var devSessionContext: SessionContext = {
					language: Locales.English,
					sessionDO: {
						hotel: {
							id: hotel.id
						},
						user: {
							id: hotel.userList[0].id,
							email: hotel.userList[0].email,
							roleList: [UserRoles.Administrator]
						}
					}
				};
				req.sessionContext = devSessionContext;
				return next();
			}).catch(e => {
				return res.forbidden('Could not read the default hotel & user from the database.');
			});
	}
	else {
		return res.forbidden('You are not permitted to perform this action.');
	}
};