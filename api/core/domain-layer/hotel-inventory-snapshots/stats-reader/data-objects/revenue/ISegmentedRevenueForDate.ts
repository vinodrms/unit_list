import { IRevenueForDate } from "./IRevenueForDate";
import { BookingSegment } from "../utils/BookingSegment";

export interface ISegmentedRevenueForDate {
    segment: BookingSegment;
    revenue: IRevenueForDate;    
}