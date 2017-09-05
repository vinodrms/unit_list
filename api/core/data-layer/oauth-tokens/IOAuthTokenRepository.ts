import { OAuthTokenDO } from "./data-objects/OAuthTokenDO";


export interface OAuthTokenSearchCriteria {
    id?: string,
    versionId?: number,
    accessToken?: string,
    refreshToken?: string,
    userId?: string,
    
}

export interface IOAuthTokenRepository {
    getOAuthToken(searchCriteria: OAuthTokenSearchCriteria): Promise<OAuthTokenDO>;
    addOAuthToken(oAuthToken: OAuthTokenDO): Promise<OAuthTokenDO>;
    updateOAuthToken(searchCriteria: OAuthTokenSearchCriteria, oAuthToken: OAuthTokenDO): Promise<OAuthTokenDO>;
    deleteOAuthToken(searchCriteria: OAuthTokenSearchCriteria): Promise<number>;
    deleteMultipleOAuthTokens(searchCriteria: OAuthTokenSearchCriteria): Promise<number>;
}