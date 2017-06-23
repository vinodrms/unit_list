import { KeyMetricsReaderInput, CommissionOption } from "./KeyMetricsReaderInput";
import { YieldManagerPeriodDO } from "../../utils/YieldManagerPeriodDO";
import { ThPeriodType } from "../../../reports/key-metrics/period-converter/ThPeriodDO";

export class KeyMetricsReaderInputBuilder {
    private _input: KeyMetricsReaderInput;

    constructor() {
        this._input = new KeyMetricsReaderInput();
        this._input.includePreviousPeriod = true;
        this._input.commissionOption = CommissionOption.INCLUDE;
        this._input.excludeVat = false;    
        this._input.customerIdList = [];
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

    public setCommissionOption(commissionOption: CommissionOption): KeyMetricsReaderInputBuilder {
        this._input.commissionOption = commissionOption;
        return this;
    }

    public excludeVat(excludeVat: boolean): KeyMetricsReaderInputBuilder {
        this._input.excludeVat = excludeVat;
        return this;
    }

    public setCustomerIdList(customerIdList: string[]): KeyMetricsReaderInputBuilder {
        this._input.customerIdList = customerIdList;
        return this;
    }

    public build(): KeyMetricsReaderInput {
        return this._input;
    }
}