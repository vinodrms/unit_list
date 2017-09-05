import { OpaqueToken } from "@angular/core";
import { TokenDO } from "./TokenDO";

export interface ITokenService {
    token: TokenDO;

    accessToken: string;
    refreshToken: string;

    clearTokenData();
}

export const ITokenService = new OpaqueToken("ITokenService");