import { IOAuthTokenRepository } from "../../data-layer/oauth-tokens/IOAuthTokenRepository";
import { UnitPalConfig } from "../../utils/environment/UnitPalConfig";
import { RepositoryFactory } from "../../data-layer/RepositoryFactory";
import { AppContext } from "../../utils/AppContext";
import { IHotelAuthentication, HotelAuthenticationType } from "../../domain-layer/hotel-account/authentication/IHotelAuthentication";
import { HotelAuthenticationFactory } from "../../domain-layer/hotel-account/authentication/HotelAuthenticationFactory";

const OAuth2Server = require('oauth2-server');

declare var sails: any;

export class OAuthServerInitializer {
    private _oAuthTokenRepository: IOAuthTokenRepository;
    private _hotelAuthentication: IHotelAuthentication;

    constructor(unitPalConfig: UnitPalConfig) {   
        let repoFactory = new RepositoryFactory(unitPalConfig);
        this._oAuthTokenRepository = repoFactory.getOAuthTokenRepository();

        let appContext = new AppContext(unitPalConfig);
        let hotelAuthFactory = new HotelAuthenticationFactory(appContext);
        this._hotelAuthentication = hotelAuthFactory.getHotelAuthenticationService(HotelAuthenticationType.Basic);
    }

    public register() {
        // saving globally the oauthserver server instance 
        console.log("Initializing oauth server");

        sails.config.oauthserver = new OAuth2Server({
            model: {
                //Request Authentication

                getAccessToken: (accessToken, callback) => {
                    console.log("getAccessToken");

                    let token = {};
                    callback(null);
                },

                /**
                 * Invoked during request authentication to check if the provided access token was 
                 * authorized the requested scopes.
                 * 
                 * This model function is required if scopes are used with OAuth2Server#authenticate().
                 */
                // verifyScope: (accessToken, scope, callback) => {
                // },

                //Password Grant

                /**
                 * This model function is optional. If not implemented, a default handler is used that generates access tokens 
                 * consisting of 40 characters in the range of a..z0..9.
                 */
                // generateAccessToken: (client, user, scope, callback) => {
                // },
                getUser: (username, password, callback) => {
                    debugger
                    console.log("getUser");
                    
                    this._hotelAuthentication.checkCredentials(username, password).then((response: any) => {
                        // { user: UserDO, hotel: HotelDO }
                        let user = response.user;
                        let hotel = response.hotel;
                        
                        callback(null, user);
                    }).catch((error: any) => {
                        
                        callback(error, null);
                    });
                },

                /**
                 * Invoked to check if the requested scope is valid for a particular client/user combination.
                 * This model function is optional. If not implemented, any scope is accepted.
                 */
                // validateScope: (user, client, scope, callback) => {
                // },

                //Refresh Token Grant
                getRefreshToken: (refreshToken, callback) => {
                    console.log("getRefreshToken");

                    let token = {
                        refreshToken: "",
                        refreshTokenExpiresAt: 0,
                        scope: "",

                        client: {
                            id: ""
                        },

                        user: {

                        }
                    };

                    callback(token);
                },

                revokeToken: (token, callback) => {
                    console.log("revokeToken");

                    let revokedToken = {
                        refreshToken: "",
                        client: {
                            id: ""
                        },
                        user: {

                        }
                    };
                    callback(token);
                },

                //Password & Refresh Token Grant common

                /**
                 * Invoked to generate a new refresh token.
                 * This model function is optional. If not implemented, a default handler is used that generates refresh tokens 
                 * consisting of 40 characters in the range of a..z0..9.
                 */
                // generateRefreshToken: (client, user, scope, callback) => {
                // },

                getClient: (clientId, clientSecret, callback) => {
                    console.log("getClient");
                    debugger
                    let client = {
                        id: "QWERTY",
                        grants: ["password", "refresh_token"]
                    };

                    callback(null, client);
                },
                saveToken: (token, client, user, callback) => {
                    console.log("saveToken");
                    
                    debugger
                    
                    let savedToken = {
                        accessToken: "",
                        accessTokenExpiresAt: 0,
                        client: {

                        },
                        user: {

                        }
                    }
                    callback(null, savedToken);
                }
            },
            grants: ['password', 'refresh_token'],
            debug: true
        });

    }
}