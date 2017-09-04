import { BaseDO } from "../../common/base/BaseDO";
import { ThUtils } from "../../../utils/ThUtils";
import { IToken, IClient } from "../../../bootstrap/oauth/OAuthServerInitializer";

export class OAuthTokenDO extends BaseDO {
    id: string;
    versionId: number;
    hotelId: string;

    accessToken: string;
    accessTokenExpiresAt: number;

    refreshToken: string;
    refreshTokenExpiresAt: number;

    userId: string;
    clientId: string;

    protected getPrimitivePropertyKeys(): string[] {
        return ["id", "versionId", "hotelId", "accessToken", "accessTokenExpiresAt", "refreshToken", "refreshTokenExpiresAt", "userId", "clientId"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);
    }

    public buildFromTokenUserInfoAndClient(token: IToken, userId: string, clientId: string, hotelId: string) {
        this.userId = userId;
        this.clientId = clientId;
        this.hotelId = hotelId;
        this.saveTokenInfoFromTokenObject(token);
    }

    private saveTokenInfoFromTokenObject(token: IToken) {
        let thUtils = new ThUtils();

        this.accessToken = token.accessToken;
        this.accessTokenExpiresAt =
            thUtils.getUTCTimestampFromDate(token.accessTokenExpiresAt);
        this.refreshToken = token.refreshToken;
        this.refreshTokenExpiresAt =
            thUtils.getUTCTimestampFromDate(token.refreshTokenExpiresAt);
    }

}