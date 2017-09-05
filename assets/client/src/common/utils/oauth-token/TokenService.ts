import { ITokenService } from "./ITokenService";
import { Inject } from "@angular/core";
import { TokenDO } from "./TokenDO";
import { IThLocalStorage } from "../local-storage/IThLocalStorage";

export class TokenService implements ITokenService {
    private readonly ACCESS_TOKEN_KEY = "access_token";
    private readonly REFRESH_TOKEN_KEY = "refresh_token";

    constructor( @Inject(IThLocalStorage) private thLocalStorage: IThLocalStorage) {
    }

    public set token(value: TokenDO) {
        this.accessToken = value.access_token;
        this.refreshToken = value.refresh_token;
    }

    public get token() {
        let accessToken = this.accessToken;
        let refreshToken = this.refreshToken;

        let value = new TokenDO();
        value.access_token = this.accessToken;
        value.refresh_token = this.refreshToken;

        return value;
    }

    public get accessToken(): string {
        return this.thLocalStorage.get(this.ACCESS_TOKEN_KEY);
    }
    public set accessToken(value: string) {
        this.thLocalStorage.set(this.ACCESS_TOKEN_KEY, value);
    }

    public get refreshToken(): string {
        return this.thLocalStorage.get(this.REFRESH_TOKEN_KEY);
    }
    public set refreshToken(value: string) {
        this.thLocalStorage.set(this.REFRESH_TOKEN_KEY, value);
    }

    public clearTokenData() {
        this.thLocalStorage.remove(this.ACCESS_TOKEN_KEY);
        this.thLocalStorage.remove(this.REFRESH_TOKEN_KEY);
    }

}