import { IUser } from "../../bootstrap/oauth/OAuthServerInitializer";

export interface ITokenService {
    getUserInfoByAccessToken(accessToken: string): Promise<IUser>;
    revokeToken(refreshToken: string): Promise<number>;
    revokeAllTokensByUser(userId: string): Promise<number>;
}