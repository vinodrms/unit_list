import {BaseDO} from '../../../common/base/BaseDO';

export enum BookingCancellationTimeType {
    ExactTimestamp,
    DependentOnCancellationHour
}

export class BookingCancellationTimeDO extends BaseDO {
    type: BookingCancellationTimeType;
    value: number;

    protected getPrimitivePropertyKeys(): string[] {
        return ["type", "value"];
    }
}