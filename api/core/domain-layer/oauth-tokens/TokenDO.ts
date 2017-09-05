
import { BaseDO } from "../../data-layer/common/base/BaseDO";
import { IToken } from "../../bootstrap/oauth/OAuthServerInitializer";
import { TokenType, TokenTypeName } from "./TokenType";

export class TokenDO extends BaseDO {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;

    protected getPrimitivePropertyKeys(): string[] {
        return ["access_token", "token_type", "expires_in", "refresh_token"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);
    }

    public buildFromToken(token: IToken, tokenType: TokenType, accessTokenLifeTime: number) {
        this.access_token = token.accessToken;
        this.token_type = TokenTypeName[tokenType];
        this.expires_in = accessTokenLifeTime;
        this.refresh_token = token.refreshToken;
    }
}