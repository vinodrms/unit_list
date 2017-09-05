import { BaseDO } from "../../base/BaseDO";

export class TokenDO extends BaseDO {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;

    constructor() {
        super();
    }

    protected getPrimitivePropertyKeys(): string[] {
        return ["access_token", "token_type", "expires_in", "refresh_token"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);
    }
}