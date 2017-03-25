import { BaseDO } from '../../../../../../../common/base/BaseDO';

export enum YieldItemStateType {
    Open,
    Closed
}

export class YieldItemStateDO extends BaseDO {
    open: YieldItemStateType;
    openForArrival: YieldItemStateType;
    openForDeparture: YieldItemStateType;

    protected getPrimitivePropertyKeys(): string[] {
        return ["open", "openForArrival", "openForDeparture"];
    }
}