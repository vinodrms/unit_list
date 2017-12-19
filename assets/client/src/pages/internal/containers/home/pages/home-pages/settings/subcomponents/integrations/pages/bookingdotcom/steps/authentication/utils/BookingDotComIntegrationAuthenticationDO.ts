import { BaseDO } from "../../../../../../../../../../../../../../common/base/BaseDO";

export class BookingDotComAuthenticationDO extends BaseDO {
    accountName: string;
    accountId: string;
    accountPassword: string;

    protected getPrimitivePropertyKeys(): string[] {
        return ["accountName", "accountId", "accountPassword"];
    }
}