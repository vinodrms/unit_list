import { IOAuthTokenRepository } from "../../data-layer/oauth-tokens/IOAuthTokenRepository";
import { UnitPalConfig } from "../../utils/environment/UnitPalConfig";
import { RepositoryFactory } from "../../data-layer/RepositoryFactory";
import { AppContext } from "../../utils/AppContext";
import { IHotelAuthentication, HotelAuthenticationType } from "../../domain-layer/hotel-account/authentication/IHotelAuthentication";
import { HotelAuthenticationFactory } from "../../domain-layer/hotel-account/authentication/HotelAuthenticationFactory";
import { OAuthTokenDO } from "../../data-layer/oauth-tokens/data-objects/OAuthTokenDO";
import { ThUtils } from "../../utils/ThUtils";
import { IHotelRepository } from "../../data-layer/hotel/repositories/IHotelRepository";
import { UserDO, UserRoles } from "../../data-layer/hotel/data-objects/user/UserDO";
import { HotelDO } from "../../data-layer/hotel/data-objects/HotelDO";
import { ITokenService } from "../../domain-layer/token/ITokenService";

const OAuth2Server = require('oauth2-server');
const AccessDeniedError = require('oauth2-server/lib/errors/access-denied-error');
const InvalidClientError = require('oauth2-server/lib/errors/invalid-client-error');
const InvalidTokenError = require('oauth2-server/lib/errors/invalid-token-error');

declare var sails: any;

export interface IClient {
    id: string,
    grants: string[]
}

export interface IUser {
    id: string,
    hotelId: string,
    email: string,
    roleList: UserRoles[]
}

export interface IToken {
    accessToken?: string,
    accessTokenExpiresAt?: Date
    refreshToken?: string,
    refreshTokenExpiresAt?: Date
    user?: IUser,
    client?: IClient
}

const client: IClient = {
    id: "UnitPal-Web",
    grants: ["password", "refresh_token"]
};

const AccessTokenLifetime: number = 3600;
const RefreshTokenLifetime: number = 1209600;
export { AccessTokenLifetime, RefreshTokenLifetime };

export class OAuthServerInitializer {
    private thUtils: ThUtils;

    private oAuthTokenRepository: IOAuthTokenRepository;
    private hotelRepository: IHotelRepository;
    private hotelAuthentication: IHotelAuthentication;
    private tokenService: ITokenService;

    constructor(unitPalConfig: UnitPalConfig) {
        this.thUtils = new ThUtils();

        let repoFactory = new RepositoryFactory(unitPalConfig);
        this.oAuthTokenRepository = repoFactory.getOAuthTokenRepository();
        this.hotelRepository = repoFactory.getHotelRepository();

        let appContext = new AppContext(unitPalConfig);
        let hotelAuthFactory = new HotelAuthenticationFactory(appContext);
        this.hotelAuthentication = hotelAuthFactory.getHotelAuthenticationService(HotelAuthenticationType.Basic);
        this.tokenService = appContext.getServiceFactory().getTokenService();
    }

    public getTokenFromOAuthTokenDO(oAuthToken: OAuthTokenDO): Object {
        return {
            accessToken: oAuthToken.accessToken,
            accessTokenExpiresAt: this.thUtils.getDateFromUTCTimestamp(oAuthToken.accessTokenExpiresAt),
            refreshToken: oAuthToken.refreshToken,
            refreshTokenExpiresAt: this.thUtils.getDateFromUTCTimestamp(oAuthToken.refreshTokenExpiresAt)
        }
    }

    public getRefreshTokenFromOAuthTokenDO(oAuthToken: OAuthTokenDO): IToken {
        return {
            refreshToken: oAuthToken.refreshToken,
            refreshTokenExpiresAt: this.thUtils.getDateFromUTCTimestamp(oAuthToken.refreshTokenExpiresAt)
        };
    }

    public getAccessTokenFromOAuthTokenDO(oAuthToken: OAuthTokenDO): IToken {
        return {
            accessToken: oAuthToken.accessToken,
            accessTokenExpiresAt: this.thUtils.getDateFromUTCTimestamp(oAuthToken.accessTokenExpiresAt)
        }
    }

    public buildUserInfo(user: UserDO, hotelId: string): IUser {
        return {
            id: user.id,
            hotelId: hotelId,
            email: user.email,
            roleList: user.roleList
        }
    }

    public register() {
        // saving globally the oauthserver server instance
        sails.config.oauthserver = new OAuth2Server({
            model: {
                //Request Authentication
                getAccessToken: (accessToken, callback) => {
                    let oAuthToken: OAuthTokenDO;

                    this.oAuthTokenRepository.getOAuthToken({ accessToken: accessToken }).then((savedOAuthToken: OAuthTokenDO) => {
                        oAuthToken = savedOAuthToken;

                        return this.hotelRepository.getUser(oAuthToken.hotelId, oAuthToken.userId);
                    }).then((user: UserDO) => {
                        let token = this.getAccessTokenFromOAuthTokenDO(oAuthToken);
                        token.user = this.buildUserInfo(user, oAuthToken.hotelId);
                        token.client = client;
                        callback(null, token);
                    }).catch((error: any) => {
                        callback(new InvalidTokenError(), null);
                    });
                },

                /**
                 * Invoked during request authentication to check if the provided access token was
                 * authorized the requested scopes.
                 *
                 * This model function is required if scopes are used with OAuth2Server#authenticate().
                 */
                verifyScope: (accessToken: string, scope: string[], callback) => {
                    callback(true);
                },

                //Password Grant
                getUser: (username: string, password: string, callback) => {
                    this.hotelAuthentication.checkCredentials(username, password).then((response: { user: UserDO, hotel: HotelDO }) => {
                        callback(null, {
                            id: response.user.id,
                            email: response.user.email,
                            roleList: response.user.roleList,
                            hotelId: response.hotel.id
                        });
                    }).catch((error: any) => {
                        let err = new AccessDeniedError("Username or password incorrect");

                        callback(err, null);
                    });
                },

                //Refresh Token Grant
                getRefreshToken: (refreshToken: string, callback) => {
                    let oAuthToken: OAuthTokenDO;

                    this.oAuthTokenRepository.getOAuthToken({ refreshToken: refreshToken }).then((savedOAuthToken: OAuthTokenDO) => {
                        oAuthToken = savedOAuthToken;

                        return this.hotelRepository.getUser(oAuthToken.hotelId, oAuthToken.userId);
                    }).then((user: UserDO) => {
                        let token = this.getRefreshTokenFromOAuthTokenDO(oAuthToken);
                        token.user = this.buildUserInfo(user, oAuthToken.hotelId);
                        token.client = client;
                        callback(null, token);
                    }).catch((error: any) => {
                        callback(new InvalidTokenError(), null);
                    });

                },

                revokeToken: (token: IToken, callback) => {
                    this.tokenService.invalidateToken({
                        refreshToken: token.refreshToken
                    }).then((deletedCount: number) => {
                        callback(null, true);
                    }).catch((error: any) => {
                        callback(null, false);
                    });

                },

                //Password & Refresh Token Grant common
                getClient: (clientId: string, clientSecret: string, callback) => {
                    if (client.id === clientId) {
                        callback(null, client);
                    }
                    else {
                        callback(new InvalidClientError(), null);
                    }

                },
                saveToken: (token: IToken, client: IClient, user: IUser, callback) => {
                    let oAuthToken = new OAuthTokenDO();
                    oAuthToken.buildFromTokenUserInfoAndClient(token, user.id, client.id, user.hotelId);

                    this.oAuthTokenRepository.addOAuthToken(oAuthToken).then((savedOAuthToken: OAuthTokenDO) => {
                        let token: IToken = this.getTokenFromOAuthTokenDO(savedOAuthToken);
                        token.user = user;
                        token.client = client;

                        callback(null, token);
                    }).catch((error: any) => {
                        callback(error, null);
                    });
                }
            },
            grants: ['password', 'refresh_token'],
            debug: true
        });

    }
}
