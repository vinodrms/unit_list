import { IUser } from "../../bootstrap/oauth/OAuthServerInitializer";

export interface ITokenInvalidationCriteria {
    accessToken?: string;
    refreshToken?: string;
}

export interface ITokenService {
    getUserInfoByAccessToken(accessToken: string): Promise<IUser>;
    invalidateToken(criteria: ITokenInvalidationCriteria): Promise<number>;
    invalidateAllTokensByUser(userId: string): Promise<number>;
}
