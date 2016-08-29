import {ThDateIntervalDO} from '../../../common/data-objects/th-dates/ThDateIntervalDO';

export enum PriceProductYieldAction {
    Open,
    Close,
    OpenForArrival,
    CloseForArrival,
    OpenForDeparture,
    CloseForDeparture
}

export interface PriceProductYieldParam {
    priceProductIdList: string[];
    action: PriceProductYieldAction;
    forever: boolean;
    interval?: ThDateIntervalDO;
}