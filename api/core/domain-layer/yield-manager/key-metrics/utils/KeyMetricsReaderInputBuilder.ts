import { KeyMetricsReaderInput } from "./KeyMetricsReaderInput";
import { YieldManagerPeriodDO } from "../../utils/YieldManagerPeriodDO";
import { ThPeriodType } from "../../../reports/key-metrics/period-converter/ThPeriodDO";

export class KeyMetricsReaderInputBuilder {
    private _input: KeyMetricsReaderInput;

    constructor() {
        this._input = new KeyMetricsReaderInput();
        this._input.includePreviousPeriod = true;
        this._input.excludeCommission = false;
        this._input.excludeVat = false;    
    }

    public setYieldManagerPeriodDO(yieldManagerPeriodDO: YieldManagerPeriodDO): KeyMetricsReaderInputBuilder {
        this._input.yieldManagerPeriodDO = yieldManagerPeriodDO;
        return this;
    }

    public includePreviousPeriod(includePreviousPeriod: boolean): KeyMetricsReaderInputBuilder {
        this._input.includePreviousPeriod = includePreviousPeriod;
        return this;
    }

    public setDataAggregationType(dataAggregationType: ThPeriodType): KeyMetricsReaderInputBuilder {
        this._input.dataAggregationType = dataAggregationType;
        return this;
    }

    public excludeCommission(excludeCommission: boolean): KeyMetricsReaderInputBuilder {
        this._input.excludeCommission = excludeCommission;
        return this;
    }

    public excludeVat(excludeVat: boolean): KeyMetricsReaderInputBuilder {
        this._input.excludeVat = excludeVat;
        return this;
    }

    public build(): KeyMetricsReaderInput {
        return this._input;
    }
}