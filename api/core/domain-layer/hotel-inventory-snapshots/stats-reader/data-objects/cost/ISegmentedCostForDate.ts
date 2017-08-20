import { BookingSegment } from "../utils/BookingSegment";

export interface ISegmentedCostForDate {
    segment: BookingSegment;
    cost: number;    
}