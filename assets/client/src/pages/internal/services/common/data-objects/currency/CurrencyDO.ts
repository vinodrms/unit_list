import {BaseDO} from '../../../../../../common/base/BaseDO';

export class CurrencyDO extends BaseDO {
    constructor() {
        super();
    }
    code: string;
    symbol: string;
    nativeSymbol: string;
    name: string;
    namePlural: string;
    decimalsNo: number;

    protected getPrimitivePropertyKeys(): string[] {
        return ["code", "symbol", "nativeSymbol", "name", "namePlural", "decimalsNo"];
    }
}