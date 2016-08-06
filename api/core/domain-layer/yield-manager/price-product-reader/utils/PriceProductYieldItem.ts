import {PriceProductYieldFilterMetaDO} from '../../../../data-layer/price-products/data-objects/yield-filter/PriceProductYieldFilterDO';
import {ThDateDO} from '../../../../utils/th-dates/data-objects/ThDateDO';

export enum YieldItemStateType {
    Open,
    Closed
}

export class YieldItemState {
    open: YieldItemStateType;
    openForArrival: YieldItemStateType;
    openForDeparture: YieldItemStateType;
}

export class PriceProductYieldItem {
    priceProductId: string;
    priceProductName: string;
    lastRoomAvailability: boolean;
    yieldFilterList: PriceProductYieldFilterMetaDO[];
    stateList: YieldItemState[];
}

export class PriceProductYieldResult {
    dateList: ThDateDO[];
    itemList: PriceProductYieldItem[];
}