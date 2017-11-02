import { SessionContext, SessionDO } from "../core/utils/SessionContext";
import { IToken } from "../core/bootstrap/oauth/OAuthServerInitializer";
import { UnitPalConfig } from "../core/utils/environment/UnitPalConfig";
import { AppContext } from "../core/utils/AppContext";
import { DefaultDataBuilder } from "../test/db-initializers/DefaultDataBuilder";
import { Locales } from "../core/utils/localization/ThTranslation";
import { UserRoles } from "../core/data-layer/hotel/data-objects/user/UserDO";

const OAuth2Server = require('oauth2-server');
const OAuth2Request = OAuth2Server.Request;
const OAuth2Response = OAuth2Server.Response;

declare var sails: any;

module.exports = function (req: any, res: any, next: any) {
    sails.config.oauthserver.authenticate(new OAuth2Request(req), new OAuth2Response(res))
        .then((token: IToken) => {
            // The request was successfully authenticated.
            let sessionContext: SessionContext = new SessionContext();
            sessionContext.sessionDO = new SessionDO();
            sessionContext.sessionDO.buildFromUserInfo(token.user);
            sessionContext.token = token;

            req.sessionContext = sessionContext;

            return next();
        })
        .catch((err) => {
            // The request failed authentication.

            let unitPalConfig = new UnitPalConfig();

            // if enabled so, read the default hotel & user from the database and set it on the server session
            // used for development; should NEVER be enabled on production environments !
            if (unitPalConfig.defaultClientSessionIsEnabled()) {
                let appContext = new AppContext(unitPalConfig);
                let hotelRepo = appContext.getRepositoryFactory().getHotelRepository();
                hotelRepo.getHotelByUserEmail(DefaultDataBuilder.DefaultEmail)
                    .then(hotel => {
                        let devSessionContext: SessionContext = new SessionContext();
                        devSessionContext.language = Locales.English;
                        devSessionContext.sessionDO = new SessionDO();
                        devSessionContext.sessionDO.hotel =
                            {
                                id: hotel.id
                            };
                        devSessionContext.sessionDO.user = {
                            id: hotel.userList[0].id,
                            email: hotel.userList[0].email,
                            roleList: [UserRoles.Administrator]
                        }
                        req.sessionContext = devSessionContext;

                        return next();
                    }).catch(e => {
                        return res.forbidden('Could not read the default hotel & user from the database.');
                    });
            }
            else {
                return res.forbidden('You are not permitted to perform this action.');
            }
        });

};
