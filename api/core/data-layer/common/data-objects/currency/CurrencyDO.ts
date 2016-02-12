import {BaseDO} from '../../base/BaseDO';

export class CurrencyDO extends BaseDO {
    constructor() {
        super();
    }
    code: string;
    symbol: string;
    nativeSymbol: string;
    name: string;
    namePlural: string;

    protected getPrimitivePropertyKeys(): string[] {
        return ["code", "symbol", "nativeSymbol", "name", "namePlural"];
    }
}