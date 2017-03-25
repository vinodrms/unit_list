import { ThDateIntervalDO } from "../../../common/data-objects/th-dates/ThDateIntervalDO";

export interface DynamicPriceYieldParam {
    priceProductId: string;
    dynamicPriceId: string;
    interval: ThDateIntervalDO;
}