import { OAuthTokenDO } from "./data-objects/OAuthTokenDO";

export interface IOAuthTokenRepository {
    getOAuthTokenByAccessToken(accessToken: string): Promise<OAuthTokenDO>;
    createOAuthTokenToken(oAuthToken: OAuthTokenDO): Promise<OAuthTokenDO>;
}