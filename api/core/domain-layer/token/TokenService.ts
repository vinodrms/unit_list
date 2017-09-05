import { ITokenService } from "./ITokenService";
import { AppContext } from "../../utils/AppContext";
import { IOAuthTokenRepository } from "../../data-layer/oauth-tokens/IOAuthTokenRepository";
import { ThError } from "../../utils/th-responses/ThError";
import { UnitPalConfig } from "../../utils/environment/UnitPalConfig";
import { OAuthTokenDO } from "../../data-layer/oauth-tokens/data-objects/OAuthTokenDO";
import { RepositoryFactory } from "../../data-layer/RepositoryFactory";
import { IUser } from "../../bootstrap/oauth/OAuthServerInitializer";
import { UserDO } from "../../data-layer/hotel/data-objects/user/UserDO";

export class TokenService implements ITokenService {
    private repoFactory: RepositoryFactory;

    constructor(unitPalConfig: UnitPalConfig) {
        this.repoFactory = new AppContext(unitPalConfig).getRepositoryFactory();
    }

    public getUserInfoByAccessToken(accessToken: string): Promise<IUser> {
        return new Promise<IUser>((resolve: { (result: IUser): void }, reject: { (err: ThError): void }) => {
            this.getUserInfoByAccessTokenCore(accessToken, resolve, reject);
        });
    }

    private getUserInfoByAccessTokenCore(accessToken: string, resolve: { (result: IUser): void }, reject: { (err: ThError): void }) {
        let oAuthRepo = this.repoFactory.getOAuthTokenRepository();
        let hotelRepository = this.repoFactory.getHotelRepository();

        let oAuthToken: OAuthTokenDO;
        oAuthRepo.getOAuthToken({ accessToken: accessToken }).then((result: OAuthTokenDO) => {
            oAuthToken = result;

            return hotelRepository.getUser(oAuthToken.hotelId, oAuthToken.userId);
        }).then((user: UserDO) => {
            resolve({
                id: user.id,
                hotelId: oAuthToken.hotelId,
                email: user.email,
                roleList: user.roleList
            });
        }).catch((error: any) => {
            reject(error);
        });
    }

    public revokeToken(refreshToken: string): Promise<number> {
        return new Promise<number>((resolve: { (result: number): void }, reject: { (err: ThError): void }) => {
            this.revokeTokenCore(refreshToken, resolve, reject);
        });
    }

    private revokeTokenCore(refreshToken: string, resolve: { (result: number): void }, reject: { (err: ThError): void }) {
        let oAuthRepo = this.repoFactory.getOAuthTokenRepository();
        oAuthRepo.deleteOAuthToken({
            refreshToken: refreshToken
        }).then((deletedCount: number) => {
            resolve(deletedCount);
        }).catch((error: any) => {
            reject(error);
        });
    }

    public revokeAllTokensByUser(userId: string): Promise<number> {
        return new Promise<number>((resolve: { (result: number): void }, reject: { (err: ThError): void }) => {
            this.revokeAllTokensByUserCore(userId, resolve, reject);
        });
    }

    private revokeAllTokensByUserCore(userId: string, resolve: { (result: number): void }, reject: { (err: ThError): void }) {
        let oAuthRepo = this.repoFactory.getOAuthTokenRepository();
        oAuthRepo.deleteMultipleOAuthTokens({
            userId: userId
        }).then((deletedCount: number) => {
            resolve(deletedCount);
        }).catch((error: any) => {
            reject(error);
        });
    }
}