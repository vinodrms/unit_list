import { BaseDO } from "../../common/base/BaseDO";

export class OAuthTokenDO extends BaseDO {
    id: string;
    versionId: number;
    hotelId: string;

    accessToken: string;
    accessTokenExpiresOn: number;

    refreshToken: string;
    refreshTokenExpiresOn: number;

    userId: string;

    protected getPrimitivePropertyKeys(): string[] {
        return ["id", "versionId", "hotelId", "accessToken", "accessTokenExpiresOn", "refreshToken", "refreshTokenExpiresOn", "userId"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);
    }
}